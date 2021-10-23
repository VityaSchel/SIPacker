import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import Dropzone from 'react-dropzone'
import { FormikTextField } from 'components/FormikField'
import { MdFileUpload } from 'react-icons/md'
import { saveFileAsURL, allowedFileTypes } from 'localStorage/fileStorage'
import { useFormik } from 'formik'
import * as yup from 'yup'
import Button from '@mui/material/Button'


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
    const url = values.url
    let responseRaw
    try {
      responseRaw = await fetch(url)
      if(responseRaw?.status !== 200) throw {}
    } catch(e) {
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
        <Button type='submit'>Добавить</Button>
      </form>
    </div>
  )
}

export default AddForm
