import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import styles from './styles.module.scss'
import { MdFileUpload } from 'react-icons/md'
import CircularProgress from '@mui/material/CircularProgress'
import { saveFile } from 'localStorage/fileStorage'

Upload.propTypes = {
  packUUID: PropTypes.string,
  setTab: PropTypes.func
}

export default function Upload(props) {
  const [uploading, setUploading] = React.useState(false)
  const [uploadingFileIndex, setUploadingFileIndex] = React.useState()
  const [filesListLength, setFilesListLength] = React.useState()

  const handleDrop = async files => {
    setUploading(true)
    setFilesListLength(files.length)
    for (let fileIndex in files) {
      setUploadingFileIndex(fileIndex)
      const file = files[fileIndex]
      file.filename = file.name
      await saveFile(file, props.packUUID)
    }
    setUploading(false)
    props.setTab('added')
  }

  return (
    !uploading
      ? <Dropzone
        onDrop={handleDrop}
        accept={['.png', '.jpg', '.jpeg', '.gif', '.mp3', '.wav', '.ogg', '.mp4']}
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
        <div className={styles.uploadingCaption}>
          <CircularProgress size={20} thickness={10} />
          <span className={styles.caption}>Загрузка файла {uploadingFileIndex} из {filesListLength}</span>
        </div>
      </div>
  )
}
