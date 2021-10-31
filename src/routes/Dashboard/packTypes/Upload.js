import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import cx from 'classnames'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'
import Alert from '@mui/material/Alert'
import { connect } from 'react-redux'
import { uploadPack } from '../PackUploader'
import { MdFileUpload } from 'react-icons/md'
import Dropzone from 'react-dropzone'

const SlideTransition = props => <Slide {...props} direction='right' />

function Upload(props) {
  const [entered, setEntered] = React.useState(false)
  const [content, setContent] = React.useState([])

  const handleDrop = async acceptedFiles => {
    setEntered(false)
    if(!acceptedFiles) { return }
    for (let pack of acceptedFiles) {
      try {
        await uploadPack(pack)
        props.reloadPacks()
      } catch (e) {
        const date = Date.now()
        setContent(content.concat({ date, text: `Ошибка при загрузке пака «${pack.name}»: ${e}` }))
      }
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
        <Alert severity='error' className={styles.alert}>
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
