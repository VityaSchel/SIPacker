import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'
import { componentsPropTypes } from '../../consts.js'
import cx from 'classnames'
import { BsPlus } from 'react-icons/bs'
import { MdFileUpload } from 'react-icons/md'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { loadLocalPacks } from '../../localStorage/localPacks'
import { useDropzone } from 'react-dropzone'
import { parse as parsePackGenerator } from 'localStorage/packGenerator'

export default function Dashboard() {
  return (
    <LocalPacks />
  )
}

function LocalPacks() {
  const [savedLocalPacks, setSavedLocalPacks] = React.useState()

  const loadPacks = async () => {
    const packsUUID = await loadLocalPacks()
    const packs = packsUUID
      .sort((a,b) => a.creationTime - b.creationTime)
    setSavedLocalPacks(packs)
  }

  React.useEffect(() => loadPacks(), [])

  return (
    <div className={styles.packsList}>
      <PackBase type='create' />
      <PackBase type='upload' />
      { savedLocalPacks
        ? savedLocalPacks.map(pack => <PackBase type='pack' key={pack.uuid} pack={pack} />)
        : <><PackBase type='loading' /><PackBase type='loading' /><PackBase type='loading' /></>
      }
    </div>
  )
}

PackBase.propTypes = PackContainer.propTypes = {
  type: PropTypes.oneOf(['create', 'upload', 'pack', 'loading']),
  pack: PropTypes.shape(componentsPropTypes.pack)
}

function PackBase(props) {
  return (
    ['loading', 'upload'].includes(props.type)
      ? <PackContainer {...props} />
      : <Link to={props.type === 'pack' ? `/pack/${props.pack.uuid}` : `${props.type}`}><PackContainer {...props} /></Link>
  )
}

function PackContainer(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

  React.useEffect(() => {
    acceptedFiles && acceptedFiles.forEach(parsePackGenerator)
  }, [acceptedFiles])

  return (
    <div className={cx(
      styles.packBase,
      {
        [styles.newPack]: ['create', 'upload'].includes(props.type),
        [styles.loading]: props.type === 'loading'
      }
    )} {...(props.type === 'upload' && { ...getRootProps() })}>
      {
        {
          'create': <span><BsPlus /> Создать новый пак</span>,
          'upload': <span><input {...getInputProps()} /><MdFileUpload /> Загрузить файл пака</span>,
          'loading': <Skeleton variant='rectangular' width='100%' height='100%' />,
          'pack': <Pack pack={props.pack} />
        }[props.type]
      }
    </div>
  )
}

Pack.propTypes = { pack: PropTypes.shape(componentsPropTypes.pack) }
function Pack(props) {
  const creationTime = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
  }).format(new Date(props.pack.creationTime))

  return (
    <div className={styles.pack}>
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
