import Dropzone from 'react-dropzone'
import styles from './styles.module.scss'
import { MdFileUpload } from 'react-icons/md'

export default function Upload() {
  const [uploading, setUploading] = React.useState(false)

  const handleEnter = e => {
    console.log('enter', e);
  }

  const handleLeave = e => {
    console.log('leave', e);
  }

  const handleDrop = e => {
    setUploading(true)
    console.log('drop', e);
  }

  return (
    <Dropzone
      onDragEnter={handleEnter}
      onDragLeave={handleLeave}
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
  )
}
