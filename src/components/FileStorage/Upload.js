import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import styles from './styles.module.scss'
import { MdFileUpload, MdDone } from 'react-icons/md'
import CircularProgress from '@mui/material/CircularProgress'
import { saveFile, saveFileAsURL, allowedFileTypes } from 'localStorage/fileStorage'
import Button from '@mui/material/Button'
import { FormikTextField } from 'components/FormikField'
import { useFormik } from 'formik'
import * as yup from 'yup'

Upload.propTypes = {
  packUUID: PropTypes.string,
  setTab: PropTypes.func
}

export default function Upload(props) {
  const [uploading, setUploading] = React.useState(false)
  const [uploadingFileIndex, setUploadingFileIndex] = React.useState()
  const [filesListLength, setFilesListLength] = React.useState()
  const [errors, setErrors] = React.useState([])
  const [uploaded, setUploaded] = React.useState(false)

  const handleDrop = async files => {
    setUploaded(false)
    setUploading(true)
    setFilesListLength(files.length)
    const errors = []
    let hasErrors = false
    for (let fileIndex in files) {
      setUploadingFileIndex(Number(fileIndex)+1)
      const file = files[fileIndex]
      file.filename = file.name
      try {
        await saveFile(file, props.packUUID)
      } catch(e) {
        console.error(e)
        hasErrors = true
        setErrors(errors.concat({ filename: file.name, errorMessage: e }))
      }
    }
    setUploaded(true)
    if(!hasErrors) {
      setUploading(false)
      props.setTab('added')
    }
  }

  const validate = async values => {
    const url = values.url
    let responseRaw
    try {
      responseRaw = await fetch(url)
      if(responseRaw?.status !== 200) throw {}
    } catch(e) {
      return { url: 'Не удалось получить изображение' }
    }
    values.file = {}
    values.file.type = responseRaw?.headers?.get('content-type')
    if(!allowedFileTypes.includes(values.file.type))
      return { url: 'Неподдерживаемый тип файла' }
    values.file.size = 
    values.file.name = url.split('/').splice(-1) || 'Без названия'
  }

  const formik = useFormik({
    initialValues: { url: '' },
    validationSchema: yup.object({
      url: yup
        .string()
        .url('Некорректный формат адреса')
        .required('Введите адрес')
    }),
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      let hasErrors = false
      try {
        await saveFileAsURL(values.url, values.fileType, values.fileName, props.packUUID)
      } catch(e) {
        console.error(e)
        hasErrors = true
        setErrors([{ filename: values.fileName, errorMessage: e }])
        setUploading(true)
      }
      !hasErrors && props.setTab('added')
    }
  })

  return (
    !uploading
      ? <div className={styles.addForm}>
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
          <Button type='submit'>Добавить</Button>
        </form>
      </div>
      : <div className={styles.uploadingFiles}>
        <div className={styles.uploadingScreen}>
          <div className={styles.uploadingCaption}>
            { !uploaded
              ? <>
                <CircularProgress size={20} thickness={10} />
                <span className={styles.caption}>Загрузка файла {uploadingFileIndex} из {filesListLength}</span>
              </>
              : <>
                <MdDone />
                <span className={styles.caption}>{errors.length < filesListLength ? 'Файлы загружены' : 'Операция завершена'}</span>
              </>
            }
          </div>
          {Boolean(errors.length) && <div className={styles.errors}>
            <span>Ошибки во время загрузки файлов:</span>
            {errors.map((error, i) => <span key={i}>Файл «{error.filename}»: {
              {
                'File with such hash already exist': 'Такой файл уже загружен в этот пак'
              }[error.errorMessage]
            }</span>)}
          </div>}
          {uploaded && <Button variant='contained' onClick={() => setUploading(false)}>ОК</Button>}
        </div>
      </div>
  )
}
