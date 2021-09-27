import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import { MdClose } from 'react-icons/md'

const FileStorage = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [callback, setCallback] = React.useState(() => {})

  const handleClose = () => setOpen(false)

  React.useImperativeHandle(ref, () => ({
    open(callback) {
      setOpen(true)
      setCallback(callback)
    }
  }))

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        Хранилище файлов
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>

      </DialogContent>
    </Dialog>
  )
})

FileStorage.displayName = 'FileStorage'
export default FileStorage
