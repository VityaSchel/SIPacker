import React from 'react'
import styles from './styles.module.scss'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import { MdClose } from 'react-icons/md'
import { emptyFunc } from '../../utils'
import Filters from './Filters'
import { loadLocalPacks } from 'localStorage/localPacks'
import List from './List'

const FileStorage = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [callback, setCallback] = React.useState(() => emptyFunc)
  const [packs, setPacks] = React.useState([])

  const handleClose = () => {
    setOpen(false)
    let responseCallback = callback
    setTimeout(() => responseCallback('3mIzYnMWUvpmxqyZsa3s6'), 1)
    setCallback(() => emptyFunc)
  }

  React.useImperativeHandle(ref, () => ({
    async open(callback) {
      setCallback(() => callback)
      setPacks(await loadLocalPacks())
      setOpen(true)
    }
  }))

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle className={styles.title}>
        <span>Хранилище файлов</span>
        <IconButton
          onClick={handleClose}
          className={styles.close}
          sx={{ color: theme => theme.palette.grey[500] }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.dialog}>
        <div className={styles.files}>
          <Filters packs={packs} />
          <List />
        </div>
      </DialogContent>
    </Dialog>
  )
})

FileStorage.displayName = 'FileStorage'
export default FileStorage
