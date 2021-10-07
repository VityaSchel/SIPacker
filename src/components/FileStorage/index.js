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
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Upload from './Upload'

const FileStorage = React.forwardRef((props, ref) => {
  const [tab, setTab] = React.useState('added')
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
        <Tabs
          value={tab} variant='fullWidth'
          onChange={(_, tab) => setTab(tab)}
          textColor='inherit'
          className={styles.tabs}
        >
          <Tab label='Добавленные' value='added' />
          <Tab label='Загрузить' value='upload' />
        </Tabs>
        {
          tab === 'added' &&
          <div className={styles.files}>
            <Filters packs={packs} />
            <List packs={packs} />
          </div>
        }
        {
          tab === 'upload' &&
          <div className={styles.upload}>
            <Upload />
          </div>
        }
      </DialogContent>
    </Dialog>
  )
})

FileStorage.displayName = 'FileStorage'
export default FileStorage
