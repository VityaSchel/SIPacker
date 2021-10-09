import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { MdInfoOutline } from 'react-icons/md'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import filesize from 'filesize'
import { symbols } from 'components/FormikField/ImageField'
import { formatDate } from '../../utils'

File.propTypes = {
  file: PropTypes.object,
  handleSelect: PropTypes.func
}
export default function File(props) {
  const [fileSrc, setFileSrc] = React.useState()
  const [infoDialogueOpen, setInfoDialogueOpen] = React.useState(false)

  React.useEffect(() => {
    const src = URL.createObjectURL(props.file.miniature)
    setFileSrc(src)
    return () => URL.revokeObjectURL(src)
  }, [props.file.miniature])

  const handleSelect = () => props.handleSelect(props.file.fileURI)

  const handleShowInfo = e => {
    e.stopPropagation()
    setInfoDialogueOpen(true)
  }

  const handleCloseInfo = e => {
    e.stopPropagation()
    setInfoDialogueOpen(false)
  }

  const handleDeleteFile = () => {
    
  }

  return (
    <>
      <Grid
        item xs={4} md={6} sm={12}
        className={styles.item}
        onClick={handleSelect}
      >
        <div className={styles.itemInner}>
          <IconButton
            className={styles.button}
            size='small'
            onClick={handleShowInfo}
          >
            <MdInfoOutline />
          </IconButton>
          <div className={styles.preview}>
            <img src={fileSrc} className={styles.foreground} />
            <img src={fileSrc} className={styles.background} />
          </div>
          <div className={styles.fileName}>{props.file.fileName}</div>
        </div>
      </Grid>
      <Dialog
        open={infoDialogueOpen}
        onClose={handleCloseInfo}
      >
        <DialogTitle className={styles.title}>Информация о файле {props.file.filename}</DialogTitle>
        <DialogContent>
          <p>Размер файла: <b>{filesize(props.file.blob.size, { symbols })}</b></p>
          <p>Дата добавления: <b>{formatDate(new Date(props.file.addedAt))}</b></p>
          <Button
            variant='contained'
            className={styles.delete}
            onClick={handleDeleteFile}
          >Удалить файл</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
