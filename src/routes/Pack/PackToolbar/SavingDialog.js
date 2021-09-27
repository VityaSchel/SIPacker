import React from 'react'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import MuiDialog from '@mui/material/Dialog'
import LinearProgress from '@mui/material/LinearProgress'
import Zoom from '@mui/material/Zoom'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { generate, check } from 'localStorage/packGenerator'
import { saveAs } from 'file-saver'
import { slugify } from 'transliteration'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />
})

const SavingDialog = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const [pack, setPack] = React.useState()

  React.useImperativeHandle(ref, () => ({
    save(pack) {
      setOpen(true)
      setPack(pack)
    }
  }))

  React.useEffect(() => pack?.uuid && startProcessing(), [pack])

  const startProcessing = async () => {
    const errors = await check(pack)
    setErrors(errors)
    if(errors.length) return

    setTimeout(bundlePack, 500)
  }

  const bundlePack = async () => {
    const zipInBlob = await generate(pack)
    saveAs(zipInBlob, slugify(pack.name))
    setOpen(false)
  }

  const handleRestart = () => {
    setOpen(false)
    setTimeout(() => {
      setOpen(true)
      startProcessing()
    }, 100)
  }

  return (
    <MuiDialog
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      onClose={() => errors.length && setOpen(false)}
    >
      <DialogTitle>Генерация архива</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { !errors.length ? <>
            <p>Производится генерация файла пака. Это может занять несколько секунд, в зависимости от количества медиа-файлов.</p>
            <LinearProgress color='primary' />
          </> : <>
            <p>Исправьте следующие ошибки и перезапустите процесс генерации пака:</p>
            <ul>
              { errors.map(error => <li key={error}>{error}</li>) }
            </ul>
          </> }
        </DialogContentText>
      </DialogContent>
      { errors.length &&
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </DialogActions>
      }
    </MuiDialog>
  )
})

SavingDialog.displayName = 'ConfirmationDialog'
export default SavingDialog
