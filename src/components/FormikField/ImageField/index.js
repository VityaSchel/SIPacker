import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getFile } from 'localStorage/fileStorage'

ImageField.propTypes = {
  label: PropTypes.string,
  fileURI: PropTypes.string,
  formik: PropTypes.object,
  name: PropTypes.string,
}
export default function ImageField(props) {
  const [src, setSrc] = React.useState({})
  const { formik, name } = props

  React.useEffect(() => {
    let cleanup = () => {}
    if(props.fileURI) {
      (async () => {
        const file = await getFile(props.fileURI)
        if(!file) return

        const blob = file.blob
        const url = URL.createObjectURL(blob)
        const name = blob.filename
        const size = blob.size
        setSrc({ url, name, size })

        cleanup = () => URL.revokeObjectURL(url)
      })()
    }
    return () => cleanup()
  }, [props.fileURI])

  const handleClick = () => {
    handleChange('helloworld')
  }

  const handleChange = fileURI => {
    formik.setFieldValue(name, fileURI)
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  const handleClear = () => {
    formik.setFieldValue(name, undefined)
  }

  return (
    <div className={styles.container}>
      <Typography variant='body' color='text.primary'>{props.label}</Typography>
      <div className={styles.preview}>
        <img
          src={src.url}
          alt={`Изображение для поля ${props.label} с именем «${src.name}»`}
          onClick={handleClick}
        />
        <div className={styles.info}>
          <p>Название файла: {src.name ?? '-'}</p>
          <p>Размер файла: {src.size ?? '-'}</p>
          <Button
            variant='contained'
            onClick={handleClear}
            disabled={!src.url}
          >Очистить поле</Button>
        </div>
      </div>
    </div>
  )
}
