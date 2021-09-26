import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getFile } from 'localStorage/fileStorage'
import filesize from 'filesize'
const symbols = { B: 'Б', kB: 'кБ', MB: 'МБ', GB: 'ГБ', TB: 'ТБ', PB: 'ПБ', EB: 'ЭБ', ZB: 'ЗБ', YB: 'ЙБ' }

ImageField.propTypes = {
  label: PropTypes.string,
  formik: PropTypes.object,
  name: PropTypes.string,
}
export default function ImageField(props) {
  const [src, setSrc] = React.useState({})
  const { formik, name } = props

  React.useEffect(() => {
    const fileURI = formik.values[name]
    let cleanup = () => {}
    if(fileURI) {
      (async () => {
        const file = await getFile(fileURI)
        if(!file) return

        const blob = file.blob
        const url = URL.createObjectURL(blob)
        const name = file.filename
        const size = blob.size
        setSrc({ url, name, size })

        cleanup = () => URL.revokeObjectURL(url)
      })()
    } else {
      setSrc({})
    }
    return () => cleanup()
  }, [formik.values[name]])

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
      <Typography
        variant='body'
        color='text.primary'
        gutterBottom
        className={styles.label}
      >{props.label}:</Typography>
      <div className={styles.preview}>
        { src.url
          ? <img
            src={src.url}
            alt={`Изображение для поля ${props.label} с именем «${src.name}»`}
            onClick={handleClick}
            className={styles.image}
          />
          : <div className={styles.placeholder}><span>Нажмите, чтобы выбрать</span></div>
        }
        <div className={styles.info}>
          <span>Название файла: {src.name ?? '-'}</span>
          <span>Размер файла: {src.size ? filesize(src.size, { symbols }) : '-'}</span>
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
