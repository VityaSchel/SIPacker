import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import styles from './styles.module.scss'
import { MdFileUpload, MdDone } from 'react-icons/md'
import CircularProgress from '@mui/material/CircularProgress'
import { saveFile, allowedFileTypes } from 'localStorage/fileStorage'
import Button from '@mui/material/Button'

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

  return (
    !uploading
      ? <Dropzone
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
