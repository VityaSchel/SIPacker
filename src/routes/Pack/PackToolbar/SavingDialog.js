import React from 'react'
import styles from './styles.module.scss'
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
  const [generating, setGenerating] = React.useState(false)
  const [errors, setErrors] = React.useState([])
  const [warnings, setWarnings] = React.useState([])

  React.useImperativeHandle(ref, () => ({
    save(pack) {
      setOpen(true)
      startProcessing(pack)
    }
  }))

  const startProcessing = async pack => {
    const errors = await check(pack)
    setErrors(errors)
    if(errors.length) return

    setGenerating(true)
    setTimeout(() => bundlePack(pack), 500)
  }

  const bundlePack = async pack => {
    let zip, warnings = []
    try {
      const result = await generate(pack)
      zip = result.result
      warnings = result.warnings
    } catch(e) {
      console.error(e)
      return setErrors([e?.message])
    }
    setGenerating(false)
    saveAs(zip, `${slugify(pack.name)}.siq`, { autoBom: true })
    setWarnings(warnings)
    setOpen(warnings.length)
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
          { generating && Boolean(!errors.length) && <>
            <p>Производится генерация файла пака. Это может занять несколько секунд, в зависимости от количества медиа-файлов.</p>
            <LinearProgress color='primary' />
          </>}
          { Boolean(errors.length) && <>
            <p>Исправьте следующие ошибки и перезапустите процесс генерации пака:</p>
            <ul>
              { errors.map((error, i) => <li key={i}>{error}</li>) }
            </ul>
          </> }
          { Boolean(warnings.length) && <>
            <p>Во время генерации возникли возникли следующие предупреждения, их не требуется исправлять:</p>
            <ul>
              { warnings.map((warning, i) => <li key={i} className={styles.warnings}>{warning}</li>) }
            </ul>
          </> }
        </DialogContentText>
      </DialogContent>
      { !generating &&
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
