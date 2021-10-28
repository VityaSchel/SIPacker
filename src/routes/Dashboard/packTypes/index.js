import React from 'react'
import styles from '../styles.module.scss'
import PropTypes from 'prop-types'
import { BsPlus } from 'react-icons/bs'
import Skeleton from '@mui/material/Skeleton'
import { componentsPropTypes } from '../../../consts'
import { getFile } from 'localStorage/fileStorage'
export { default as Upload } from './Upload'
export { default as ImportByURL } from './ImportByURL'
export { default as Pack } from './Pack'
import { connect } from 'react-redux'
import unknownFileType from 'assets/unknownFileType.svg'

export function Create() {
  return (
    <div className={[styles.packBase, styles.newPack].join(' ')}>
      <span><BsPlus /> Создать новый пак</span>
    </div>
  )
}

Loading.propTypes = { name: PropTypes.string }
export function Loading(props) {
  return (
    <div className={[styles.packBase, styles.loading].join(' ')}>
      <Skeleton variant='rectangular' width='100%' height='100%' className={styles.skeleton} />
      { props.name && <span>Загрузка «{props.name}»</span> }
    </div>
  )
}

PackImage.propTypes = {
  src: componentsPropTypes.pack.thumbnail,
  dispatch: PropTypes.func
}

function PackImage(props) {
  const [src, setSrc] = React.useState()

  React.useEffect(() => {
    if(!src) return
    props.dispatch({ type: 'fileRendering/setFileUnlinkCallback', fileURI: props.src, callback: () => setSrc() })
  }, [setSrc])

  React.useEffect(() => {
    let cleanup = () => {}
    if(props.src) {
      (async () => {
        const file = await getFile(props.src)
        if(file === null) return setSrc()

        if(file.url) {
          setSrc(file.type === 'unknown' ? unknownFileType : file.url)
        } else {
          const src = URL.createObjectURL(file.blob)
          setSrc(src)
        }
        props.dispatch({ type: 'fileRendering/fileRenderingStarted', fileURI: props.src, callback: () => setSrc() })

        cleanup = () => {
          src?.startsWith('blob:') && URL.revokeObjectURL(src)
          props.dispatch({ type: 'fileRendering/fileRenderingStopped', fileURI: props.src })
        }
      })()
    } else {
      setSrc()
    }
    return () => cleanup(src)
  }, [props.src])

  return (
    <div className={styles.pictureContainer}>
      {src
        ? <img src={src} className={styles.thumbnail} />
        : <div className={styles.thumbnail} />
      }
    </div>
  )
}

export default connect(null)(PackImage)
