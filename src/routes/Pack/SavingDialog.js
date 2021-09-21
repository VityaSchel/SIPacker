import React from 'react'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import MuiDialog from '@mui/material/Dialog'
import LinearProgress from '@mui/material/LinearProgress'
import Zoom from '@mui/material/Zoom'
import generate from '../../localStorage/packGenerator'
import { saveAs } from 'file-saver'
import { slugify } from 'transliteration'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />
})

const SavingDialog = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)

  React.useImperativeHandle(ref, () => ({
    save(pack) {
      setOpen(true)
      setTimeout(() => {
        generate(pack).then(zipInBlob => {
          saveAs(zipInBlob, slugify(pack.name))
          setOpen(false)
        })
      }, 500)
    }
  }))

  return (
    <MuiDialog
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>Генерация архива</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>Производится генерация файла пака. Это может занять несколько секунд, в зависимости от количества медиа-файлов.</p>
          <LinearProgress color='primary' />
        </DialogContentText>
      </DialogContent>
    </MuiDialog>
  )
})

SavingDialog.displayName = 'ConfirmationDialog'
export default SavingDialog
