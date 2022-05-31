import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getFile } from 'localStorage/fileStorage'
import FileStorage from 'components/FileStorage'
import { connect } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { MdErrorOutline } from 'react-icons/md'
import store from 'reducers/index'
import { filesize } from 'utils'
import unknownFileType from 'assets/unknownFileType.svg'
import File from './File'

FileField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  pack: PropTypes.object,
  dispatch: PropTypes.func,
  onChange: PropTypes.func,
}

function FileField(props) {
  const [src, setSrc] = React.useState({})
  const [srcUrl, setSrcUrl] = React.useState(null)
  const [noFile, setNoFile] = React.useState(false)
  const fileStorage = React.useRef()

  React.useEffect(() => {
    if(!src.fileURI) return
    props.dispatch({ type: 'fileRendering/setFileUnlinkCallback', fileURI: src.fileURI, callback: () => setNoFile(true) })
  }, [setNoFile])

  React.useEffect(() => {
    const fileURI = props.value
    let cleanup = () => {}
    setSrcUrl()
    if(fileURI) {
      (async () => {
        const file = await getFile(fileURI)
        if(!file) return setNoFile(true)
        else setNoFile(false)

        const blob = file.miniature ?? file.blob
        const name = file.fileName
        const size = file.size
        setSrc({ name, size })

        let url
        if(file.url) {
          setSrcUrl(file.type === 'unknown' ? unknownFileType : file.url)
        } else {
          url = URL.createObjectURL(blob)
          setSrcUrl(url)
        }
        props.dispatch({ type: 'fileRendering/fileRenderingStarted', fileURI: file.fileURI, callback: () => setNoFile(true) })

        cleanup = () => {
          url?.startsWith('blob:') && URL.revokeObjectURL(url)
          store.dispatch({ type: 'fileRendering/fileRenderingStopped', fileURI: file.fileURI })
        }
      })()
    } else {
      setSrc({})
      setSrcUrl(null)
    }
    return () => cleanup()
  }, [props.value])

  const handleClick = async () => {
    let result = await new Promise(resolve => fileStorage.current.open(props.pack.uuid, props.type, resolve))
    if(!result) { return }
    props.onChange(result)
  }

  const handleClear = () => {
    setNoFile(false)
    props.onChange(undefined)
  }

  return (
    <div className={styles.container}>
      <Typography
        variant='body'
        color='text.primary'
        gutterBottom
        className={styles.label}
      >{props.label}:</Typography>
      <div className={styles.preview}>
        { srcUrl === null
          ? <Placeholder onClick={handleClick} />
          : noFile
            ? <FileMissingIcon onClick={handleClick} />
            : srcUrl === undefined
              ? <Loading />
              : <File
                type={props.type}
                src={src}
                srcUrl={srcUrl}
                label={props.label}
                onClick={handleClick}
              />
        }
        <div className={styles.info}>
          { noFile
            ? <FileMissing />
            : src.size !== undefined
              ? <FileInfo src={src} />
              : <FileNotSelected />
          }
          <Button
            variant='contained'
            onClick={handleClear}
            disabled={!srcUrl && !noFile}
          >Очистить поле</Button>
        </div>
      </div>
      <FileStorage ref={fileStorage} />
    </div>
  )
}

export default connect(state => ({ pack: state.pack, fileRendering: state.fileRendering }))(FileField)

Placeholder.propTypes = FileMissingIcon.propTypes = { onClick: PropTypes.func }
function Placeholder({ onClick }) {
  return (
    <div className={styles.placeholder} onClick={onClick}>
      <span>Нажмите, чтобы выбрать</span>
    </div>
  )
}

function FileMissingIcon({ onClick }) {
  return (
    <div className={styles.fileMissing} onClick={onClick}>
      <MdErrorOutline className={styles.icon} />
    </div>
  )
}

function FileMissing() {
  return (
    <span>
      Файл не найден. Вероятно, вы выбрали его, но затем удалили из хранилища файлов.
    </span>
  )
}

FileInfo.propTypes = { src: PropTypes.object }
function FileInfo({ src }) {
  return (
    <>
      <span>Название файла: {src.name}</span>
      <span>Размер файла: {filesize(src.size)}</span>
    </>
  )
}

function FileNotSelected() {
  return (
    <>
      <span>Файл не выбран</span>
      <span>Выберите файл, нажав на кнопку левее.</span>
    </>
  )
}

function Loading() {
  return (
    <div className={styles.loading}>
      <CircularProgress />
    </div>
  )
}
