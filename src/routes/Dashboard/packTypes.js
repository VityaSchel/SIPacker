import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'
import { BsPlus } from 'react-icons/bs'
import { MdFileUpload } from 'react-icons/md'
import Skeleton from '@mui/material/Skeleton'
import Dropzone from 'react-dropzone'
import { parse as parsePackGenerator } from 'localStorage/packGenerator'
import { componentsPropTypes } from '../../consts.js'
import cx from 'classnames'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'
import Alert from '@mui/material/Alert'
import { connect } from 'react-redux'
import store from '../../reducers'
import { formatDate } from '../../utils'

export function Create() {
  return (
    <div className={[styles.packBase, styles.newPack].join(' ')}>
      <span><BsPlus /> Создать новый пак</span>
    </div>
  )
}

const SlideTransition = props => <Slide {...props} direction="right" />

export const Upload = connect(state => ({ dashboard: state.dashboard }))(props => {
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
            noContentXML: 'Не найден файл content.xml в паке. Возможно, архив поврежден или неправильно создан, например, с абсолютными путями вместо относительных.'
          }[result.error]
          const date = Date.now()
          setContent(content.concat({ date, text: `Ошибка при загрузке пака «${pack.name}»: ${error}` }))
        } else {
          props.reloadPacks()
        }
        props.dispatch({ type: 'dashboard/setUploading', uploading: store.getState().pack?.uploading.filter(pack => id !== pack.id) })
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
})

Loading.propTypes = { name: PropTypes.string }
export function Loading(props) {
  return (
    <div className={[styles.packBase, styles.loading].join(' ')}>
      <Skeleton variant='rectangular' width='100%' height='100%' className={styles.skeleton} />
      { props.name && <span>Загрузка «{props.name}»</span> }
    </div>
  )
}

Pack.propTypes = { pack: PropTypes.shape(componentsPropTypes.pack) }
export function Pack(props) {
  const creationTime = formatDate(new Date(props.pack.creationTime))

  return (
    <div className={[styles.packBase, styles.pack].join(' ')}>
      <PackImage src={props.pack.thumbnail} />
      <div className={styles.info}>
        <span className={styles.name}>{props.pack.name}</span>
        <span className={styles.time}>Создано: {creationTime}</span>
      </div>
    </div>
  )
}

PackImage.propTypes = { src: componentsPropTypes.pack.thumbnail }
function PackImage() {
  return (
    <img src='' className={styles.thumbnail} />
  )
}
