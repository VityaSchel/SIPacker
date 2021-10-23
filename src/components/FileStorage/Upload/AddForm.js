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

AddForm.propTypes = {
  setTab: PropTypes.func,
  setUploadingFileIndex: PropTypes.func,
  setErrors: PropTypes.func,
  setFiles: PropTypes.array,
  setStage: PropTypes.func,
  packUUID: PropTypes.string
}

function AddForm(props) {
  const handleDrop = async files => {
    props.setFiles(files)
    props.setStage('preview')
  }

  const validate = async values => {
    const url = values.url.startsWith('!') ? values.url.substring(1) : values.url
    try {
      await yup
        .string()
        .url('Некорректный формат адреса')
        .required('Введите адрес')
        .validate(url)
    } catch(e) { return { url: e.errors } }
    if(!url.startsWith('http')) return { url: 'Поддерживается только схема https' }
    let responseRaw
    try {
      responseRaw = await fetch(url)
      if(responseRaw?.status !== 200) throw {}
    } catch(e) {
      console.error(e)
      return { url: 'Не удалось получить изображение' }
    }
    values.file = {}
    values.file.type = responseRaw?.headers?.get?.('content-type')
    if(!allowedFileTypes.includes(values.file.type))
      return { url: 'Неподдерживаемый тип файла' }
    const blob = await responseRaw.blob()
    values.file.size = blob.size
    values.file.name = blob.name || responseRaw?.headers?.get?.('content-disposition') || url.split('/').splice(-1) || 'Без названия'
  }

  const formik = useFormik({
    initialValues: { url: '' },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      let hasErrors = false
      try {
        await saveFileAsURL(values.url, values.file, props.packUUID)
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
            <span className={styles.flex}><MdFileUpload /> Загрузить медиа-файл</span>
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
