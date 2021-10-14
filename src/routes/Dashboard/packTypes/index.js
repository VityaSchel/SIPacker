import React from 'react'
import styles from '../styles.module.scss'
import PropTypes from 'prop-types'
import { BsPlus } from 'react-icons/bs'
import Skeleton from '@mui/material/Skeleton'
import { componentsPropTypes } from '../../../consts'
import { getFile } from 'localStorage/fileStorage'
export { default as Upload } from './Upload'
export { default as Pack } from './Pack'

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

PackImage.propTypes = { src: componentsPropTypes.pack.thumbnail }
export default function PackImage(props) {
  const [src, setSrc] = React.useState()

  React.useEffect(() => {
    let cleanup = () => {}
    if(props.src) {
      (async () => {
        const file = await getFile(props.src)
        const src = URL.createObjectURL(file.blob)
        cleanup = () => URL.revokeObjectURL(src)
        setSrc(src)
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
