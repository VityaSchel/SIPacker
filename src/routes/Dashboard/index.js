import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'
import { componentsPropTypes } from '../../consts.js'
import cx from 'classnames'
import { BsPlus } from 'react-icons/bs'
import { MdFileUpload } from 'react-icons/md'
import Skeleton from '@mui/material/Skeleton'
import { Link } from 'react-router-dom'
import { loadLocalPacks, loadLocalPack } from '../../localStorage/localPacks'

export default function Dashboard() {
  return (
    <LocalPacks />
  )
}

function LocalPacks() {
  const [savedLocalPacks, setSavedLocalPacks] = React.useState()

  React.useEffect(() => {
    const packsUUID = loadLocalPacks()
    const packs = packsUUID
      .map(uuid => loadLocalPack(uuid))
      .sort((a,b) => a.creationTime - b.creationTime)
    setSavedLocalPacks(packs)
  }, [])

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
    props.type === 'loading'
      ? <PackContainer {...props} />
      : <Link to={props.type === 'pack' ? `/pack/${props.pack.uuid}` : `${props.type}`}><PackContainer {...props} /></Link>
  )
}

function PackContainer(props) {
  return (
    <div className={cx(
      styles.packBase,
      {
        [styles.newPack]: ['create', 'upload'].includes(props.type),
        [styles.loading]: props.type === 'loading'
      }
    )}>
      {
        {
          'create': <span><BsPlus /> Создать новый пак</span>,
          'upload': <span><MdFileUpload /> Загрузить файл пака</span>,
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
