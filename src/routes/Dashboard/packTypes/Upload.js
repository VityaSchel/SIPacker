import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import cx from 'classnames'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'
import Alert from '@mui/material/Alert'
import { connect } from 'react-redux'
import store from '../../../reducers'
import { MdFileUpload } from 'react-icons/md'
import Dropzone from 'react-dropzone'
import { parse as parsePackGenerator } from 'localStorage/packGenerator'

const SlideTransition = props => <Slide {...props} direction="right" />

function Upload(props) {
  const [entered, setEntered] = React.useState(false)
  const [content, setContent] = React.useState([])

  const handleDrop = acceptedFiles => {
    setEntered(false)
    if(!acceptedFiles) { return }
    for (let pack of acceptedFiles) {
      let previousState = props.dashboard?.uploading ?? []
      const id = Date.now()
      props.dispatch({ type: 'dashboard/setUploading', uploading: previousState.concat({ id, name: pack.name }) })
      parsePackGenerator(pack).then(result => {
        if(result.error) {
          const error = {
            noContentXML: 'Не найден файл content.xml в паке. Возможно, архив поврежден или неправильно создан, например, с абсолютными путями вместо относительных.',
            packExist: 'Пак с таким идентификатором уже существует',
            'File not found': `Медиа-файл ${result.file} не найден в паке. Возможно, архив поврежден или неправильно создан, например, с абсолютными путями вместо относительных.`,
            'URL error': `Не удалось получить медиа-файл по адресу ${result.file}`,
            'Couldn\'t get the image': `Не удалось получить медиа-файл по адресу ${result.file}. Возможно, он находится по протоколу http, который не поддерживается этим редактором.`,
            'File mime-type is not supported': `Медиа-файл по адресу ${result.file} имеет неподдерживаемый тип файла (например, документ вместо видео)`
          }[result.error] ?? result.error
          const date = Date.now()
          setContent(content.concat({ date, text: `Ошибка при загрузке пака «${pack.name}»: ${error}` }))
        } else {
          props.reloadPacks()
        }
        props.dispatch({ type: 'dashboard/setUploading', uploading: store.getState().dashboard?.uploading?.filter(pack => id !== pack.id) })
      })
    }
  }

  const handleEnter = () => setEntered(true)
  const handleLeave = () => setEntered(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setContent(content.filter(c => c.date >= Date.now()-1000*5))
    }, 1000)
    return () => clearInterval(interval)
  }, [content])

  return (
    <>
      <Dropzone
        onDragEnter={handleEnter}
        onDragLeave={handleLeave}
        onDrop={handleDrop}
        accept={['.siq']}
      >
        {({getRootProps, getInputProps}) => (
          <div className={cx(
            [styles.packBase, styles.newPack, styles.upload],
            { [styles.dragOver]: entered }
          )} {...getRootProps()}>
            <input {...getInputProps()} />
            <span><MdFileUpload /> Загрузить файл пака</span>
          </div>
        )}
      </Dropzone>
      <div className={cx(styles.backdrop, { [styles.visible]: entered })} />
      <Snackbar
        open={content.length}
        onClose={() => setContent([])}
        TransitionComponent={SlideTransition}
      >
        <Alert severity="error" className={styles.alert}>
          {content.map((c, i) => <p key={i}>{c.text}</p>)}
        </Alert>
      </Snackbar>
    </>
  )
}

Upload.propTypes = {
  dashboard: PropTypes.object,
  dispatch: PropTypes.func,
  reloadPacks: PropTypes.func
}

export default connect(state => ({ dashboard: state.dashboard }))(Upload)
