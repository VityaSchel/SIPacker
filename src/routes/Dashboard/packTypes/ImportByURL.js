import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import { IoMdCloudDownload } from 'react-icons/io'

ImportByURL.propTypes = {
  packUploaderRef: PropTypes.object,
}
export default function ImportByURL(props) {
  return (
    <div
      className={[styles.packBase, styles.newPack, styles.upload].join(' ')}
      onClick={() => props.packUploaderRef.current.open()}
    >
      <span><IoMdCloudDownload /> Импортировать пак по URL</span>
    </div>
  )
}
