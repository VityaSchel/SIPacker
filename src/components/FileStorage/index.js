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
import { getPacksIDs } from 'localStorage/fileStorage'
import List from './List'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Upload from './Upload'

const FileStorage = React.forwardRef((props, ref) => {
  const [tab, setTab] = React.useState('added')
  const [open, setOpen] = React.useState(false)
  const [callback, setCallback] = React.useState(() => emptyFunc)
  const [packs, setPacks] = React.useState([])
  const [packUUID, setPackUUID] = React.useState([])
  const [checkboxes, setCheckboxes] = React.useState([])
  const [deletedPacks, setDeletedPacks] = React.useState([])

  const handleClose = () => {
    setOpen(false)
    setCallback(() => emptyFunc)
  }

  const handleSelect = selectedFile => {
    handleClose()
    setTimeout(() => callback(selectedFile), 1)
  }

  React.useImperativeHandle(ref, () => ({
    async open(packUUID, callback) {
      setCallback(() => callback)
      const packs = await loadLocalPacks()
      const deletedPacks = await getPacksIDs()
      if(deletedPacks.length > packs.length) packs.push(null)
      setDeletedPacks(deletedPacks.filter(uuid => !packs.includes(uuid)))
      setPacks(packs)
      setOpen(true)
      setPackUUID(packUUID)
      setCheckboxes(
        packs.map(
          pack => (
            pack === null ? { uuid: null, checked: false } : { uuid: pack.uuid, checked: true }
          )
        )
      )
    }
  }))

  const filteredPacks = Object.fromEntries(checkboxes
    .filter(cb => cb.checked)
    .map(checkedPack => ([checkedPack.uuid,
      checkedPack.uuid === null
        ? 'Удаленные паки'
        : packs.find(pack => pack.uuid === checkedPack.uuid).name
    ])
    )
  )

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
            <Filters
              packs={packs}
              checkboxes={checkboxes}
              onChange={setCheckboxes}
            />
            <List
              packs={filteredPacks}
              handleSelect={handleSelect}
            />
          </div>
        }
        {
          tab === 'upload' &&
          <div className={styles.upload}>
            <Upload packUUID={packUUID} setTab={setTab} />
          </div>
        }
      </DialogContent>
    </Dialog>
  )
})

FileStorage.displayName = 'FileStorage'
export default FileStorage
