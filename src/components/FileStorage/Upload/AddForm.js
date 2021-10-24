import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import Dropzone from 'react-dropzone'
import { FormikTextField } from 'components/FormikField'
import { MdFileUpload } from 'react-icons/md'
import { saveFileAsURL, allowedFileTypes } from 'localStorage/fileStorage'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import contentType from 'content-type'
import { useEventListener } from 'utils'

AddForm.propTypes = {
  setTab: PropTypes.func,
  setUploadingFileIndex: PropTypes.func,
  setErrors: PropTypes.func,
  setFiles: PropTypes.array,
  setStage: PropTypes.func,
  packUUID: PropTypes.string
}

function AddForm(props) {
  React.useEffect(() => {
    const handlePaste = event => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items
      const files = []
      for (let file of items) {
        if (file.kind === 'file') {
          const blob = file.getAsFile()
          files.push(blob)
        }
      }
      if(!files.length) return
      props.setFiles(files)
      props.setStage('preview')
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  const handleDrop = async files => {
    props.setFiles(files)
    props.setStage('preview')
  }

  const validate = async values => {
    const url = values.url.startsWith('!') ? values.url.substring(1) : values.url
    const urlName = url.split('/').splice(-1) || 'Без названия'
    try {
      await yup
        .string()
        .url('Некорректный формат адреса')
        .required('Введите адрес')
        .validate(url)
    } catch(e) { return { url: e.errors } }
    if(!url.startsWith('http')) return { url: 'Поддерживается только схема https' }
    if(url.startsWith('http://')){
      values.file = {
        type: 'unknown',
        size: null,
        name: urlName
      }
    } else {
      let response
      try {
        response = await fetch(url, { headers: { 'X-SIPacker-External-Media': 'True' }})
        if(response?.status !== 200) throw `Couldn't get the image. Status: ${response?.status}`
      } catch(e) {
        console.error(e)
        return { url: 'Не удалось получить изображение' }
      }
      values.file = {}
      const contentTypeHeader = response?.headers?.get?.('content-type')
      const actualMimeType = contentType.parse(contentTypeHeader).type
      values.file.type = actualMimeType
      if(!allowedFileTypes.includes(values.file.type))
        return { url: 'Неподдерживаемый тип файла' }
      const blob = await response.blob()
      values.file.size = blob.size
      values.file.name = blob.name || response?.headers?.get?.('content-disposition') || urlName
    }
  }

  const formik = useFormik({
    initialValues: { url: '' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      let hasErrors = false
      try {
        const url = values.url.startsWith('!') ? values.url.substring(1) : values.url
        await saveFileAsURL(url, values.file, props.packUUID)
      } catch(e) {
        console.error(e)
        hasErrors = true
        props.setErrors([{ filename: values.file.name, errorMessage: e }])
        props.setStage('addForm')
      }
      !hasErrors && props.setTab('added')
    }
  })

  const httpScheme = formik.values.url?.startsWith('http:')

  return (
    <div className={styles.addForm}>
      <Dropzone
        onDropAccepted={handleDrop}
        accept={allowedFileTypes}
      >
        {({ getRootProps, getInputProps }) => (
          <div className={styles.dropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            <span className={styles.flex}><MdFileUpload /> Загрузите, перетащите или вставьте медиа-файлы</span>
            <span className={styles.supportedTypes}>
              <span>Поддерживаемые типы файлов:</span>
              <span>Фото: png, jpeg, gif</span>
              <span>Аудио: mp3, wav, ogg</span>
              <span>Видео: mp4</span>
            </span>
          </div>
        )}
      </Dropzone>
      <form onSubmit={formik.handleSubmit} className={styles.downloadByURL}>
        <span className={styles.hint}>Или загрузить по URL:</span>
        <FormikTextField
          name='url'
          formik={formik}
          label='Адрес файла'
          placeholder='https://example.com/image.png'
          size='small'
          className={styles.input}
        />
        <Tooltip title={httpScheme ? <p>В связи с техническими ограничениями браузера добавлять медиа-контент можно только по протоколу https. Однако, текущая версия SIGame не поддерживает https, поэтому вы можете добавить http ссылку в SIPacker, дописав ! в начале адреса, но в таком случае вы не сможете просматривать файлы через Хранилище файлов. Если вы все равно желаете добавить файл, напишите его адрес вот так: <pre>!{formik.values.url}</pre></p> : ''}>
          <span>
            <Button type='submit' disabled={httpScheme}>Добавить</Button>
          </span>
        </Tooltip>
      </form>
    </div>
  )
}

export default AddForm
