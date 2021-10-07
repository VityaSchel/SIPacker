import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'

File.propTypes = {
  file: PropTypes.object,
  handleSelect: PropTypes.func
}
export default function File(props) {
  const [fileSrc, setFileSrc] = React.useState()

  React.useEffect(() => {
    const src = URL.createObjectURL(props.file.miniature)
    setFileSrc(src)
    return () => URL.revokeObjectURL(src)
  }, [props.file.miniature])

  const handleSelect = () => props.handleSelect(props.file.fileURI)

  return (
    <Grid
      item xs={4} md={6} sm={12}
      className={styles.item}
      onClick={handleSelect}
    >
      <div className={styles.itemInner}>
        <div className={styles.preview}>
          <img src={fileSrc} className={styles.foreground} />
          <img src={fileSrc} className={styles.background} />
        </div>
        <div className={styles.fileName}>{props.file.fileName}</div>
      </div>
    </Grid>
  )
}
