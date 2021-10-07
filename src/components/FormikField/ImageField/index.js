import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { getFile } from 'localStorage/fileStorage'
import filesize from 'filesize'
const symbols = { B: 'Б', kB: 'кБ', MB: 'МБ', GB: 'ГБ', TB: 'ТБ', PB: 'ПБ', EB: 'ЭБ', ZB: 'ЗБ', YB: 'ЙБ' }
import FileStorage from 'components/FileStorage'
import { connect } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'

ImageField.propTypes = {
  label: PropTypes.string,
  formik: PropTypes.object,
  name: PropTypes.string,
  pack: PropTypes.object
}

function ImageField(props) {
  const [src, setSrc] = React.useState({})
  const [srcUrl, setSrcUrl] = React.useState(null)
  const { formik, name } = props
  const fileStorage = React.useRef()

  React.useEffect(() => {
    const fileURI = formik.values[name]
    let cleanup = () => {}
    setSrcUrl()
    if(fileURI) {
      (async () => {
        const file = await getFile(fileURI)
        if(!file) return

        const blob = file.miniature
        const name = file.fileName
        const size = blob.size
        setSrc({ name, size })

        const url = URL.createObjectURL(blob)
        setSrcUrl(url)
        cleanup = () => URL.revokeObjectURL(url)
      })()
    } else {
      setSrc({})
      setSrcUrl(null)
    }
    return () => cleanup()
  }, [formik.values[name]])

  const handleClick = async () => {
    let result = await new Promise(resolve => fileStorage.current.open(props.pack.uuid, resolve))
    if(!result) { return }
    handleChange(result)
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
        { srcUrl === null
          ? <>
            <div className={styles.placeholder} onClick={handleClick}>
              <span>Нажмите, чтобы выбрать</span>
            </div>
          </>
          : srcUrl === undefined
            ? <div className={styles.loading}>
              <CircularProgress />
            </div>
            : <img
              src={srcUrl}
              alt={srcUrl ? `Изображение для поля ${props.label} с именем «${src.name}»` : ''}
              onClick={handleClick}
              className={styles.image}
            />
        }
        <div className={styles.info}>
          <span>Название файла: {src.name ?? '-'}</span>
          <span>Размер файла: {src.size ? filesize(src.size, { symbols }) : '-'}</span>
          <Button
            variant='contained'
            onClick={handleClear}
            disabled={!srcUrl}
          >Очистить поле</Button>
        </div>
      </div>
      <FileStorage ref={fileStorage} />
    </div>
  )
}

export default connect(state => ({ pack: state.pack }))(ImageField)
