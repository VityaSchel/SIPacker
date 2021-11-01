import React from 'react'
import styles from './styles.module.scss'
import store from 'reducers/index'
import { parse as parsePackGenerator } from 'localStorage/packGenerator'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MuiDialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { DashboardContext } from './index'
import { blockedByCors } from 'utils'

export async function uploadPack(file) {
  let previousState = store.getState().dashboard?.uploading ?? []
  const id = Date.now()
  store.dispatch({
    type: 'dashboard/setUploading',
    uploading: previousState.concat({ id, name: file.name })
  })
  const result = await parsePackGenerator(file)
  store.dispatch({ type: 'dashboard/setUploading', uploading: store.getState().dashboard?.uploading?.filter(pack => id !== pack.id) })
  if(result.error) {
    const error = {
      noContentXML: 'Не найден файл content.xml в паке. Возможно, архив поврежден или неправильно создан, например, с абсолютными путями вместо относительных.',
      packExist: 'Пак с таким идентификатором уже существует',
      'File not found': `Медиа-файл «${result.file}» не найден в паке. Возможно, архив поврежден или неправильно создан, например, с абсолютными путями вместо относительных.`,
      'URL error': `Не удалось получить медиа-файл по адресу ${result.file}`,
      'Couldn\'t get the image': `Не удалось получить медиа-файл по адресу ${result.file}. Возможно, он находится по протоколу http, который не поддерживается этим редактором.`,
      'File mime-type is not supported': `Медиа-файл ${result.file ?? ''} имеет неподдерживаемый тип файла (например, документ вместо видео).`,
      'Error: Can\'t find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html': 'Файл не является паком SiGame или архив поврежден.'
    }[result.error] ?? result.error
    throw error
  }
}

const PackUploader = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [importing, setImporting] = React.useState(false)
  const [error, setError] = React.useState('')
  const dashboardActions = React.useContext(DashboardContext)

  React.useImperativeHandle(ref, () => ({
    open() {
      setValue('')
      setOpen(true)
    }
  }))

  React.useEffect(() => {
    const params = new URL(window.location.href).searchParams
    if(params.has('import')) {
      const url = params.get('import')
      setValue(url)
      setOpen(true)
    }
  }, [])

  const handleStartImporting = async () => {
    const exit = text => {
      setError(text)
      setImporting(false)
    }

    setError('')
    setImporting(true)
    let response, blob
    try { response = await fetch(value) } catch(e) {
      if(await blockedByCors(value)) {
        try {
          response = await fetch(`https://api.allorigins.win/raw?url=${value}`)
        } catch(e) {
          return exit('Не удалось получить пак по указанному адресу, потому что автор сайта настроил политику CORS, блокирующую возможность импортирования паков по URL')
        }
      } else {
        return exit('Не удалось получить файл пака по указанному адресу')
      }
    }
    try { blob = await response.blob() } catch(e) {
      return exit('Не удалось получить файл пака по указанному адресу')
    }
    try { await uploadPack(blob) } catch(e) {
      return exit(e)
    }


    setImporting(false)
    setOpen(false)
    dashboardActions.reloadPacks()
  }

  return (
    <MuiDialog
      maxWidth='xs'
      open={open}
      onClose={() => {
        if(importing) return false
        else setOpen(false)
      }}
    >
      <DialogTitle>Импортировать пак по URL-адресу</DialogTitle>
      <DialogContent>
        <div className={styles.url}>
          <TextField
            label='Адрес .siq файла'
            variant='outlined'
            value={value}
            onChange={e => setValue(e.target.value)}
            disabled={importing}
            error={error}
            helperText={String(error)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color='primary' disabled={importing}>
          Отмена
        </Button>
        <Button onClick={handleStartImporting} color='primary' disabled={importing}>
          Загрузить
        </Button>
      </DialogActions>
    </MuiDialog>
  )
})

PackUploader.displayName = 'PackUploader'

export default PackUploader
