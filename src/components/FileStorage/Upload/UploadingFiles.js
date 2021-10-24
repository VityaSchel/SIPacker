import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import { MdDone } from 'react-icons/md'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import { saveFile } from 'localStorage/fileStorage'
import { mapPackState } from 'utils'
import { connect } from 'react-redux'

const UploadingFiles = React.forwardRef((props, ref) => {
  const [uploadingFileIndex, setUploadingFileIndex] = React.useState(0)
  const [filesListLength, setFilesListLength] = React.useState(0)
  const [stage, setStage] = React.useState('uploading')

  React.useImperativeHandle(ref, () => ({
    async upload(files) {
      setFilesListLength(files.length)
      setStage('uploading')
      const errors = []
      let hasErrors = false
      for (let fileIndex in files) {
        setUploadingFileIndex(Number(fileIndex)+1)
        const file = files[fileIndex]
        file.filename = file.name
        try {
          await saveFile(file, props.pack.uuid)
        } catch(e) {
          console.error(e)
          hasErrors = true
          props.setErrors(errors.concat({ filename: file.name, errorMessage: e }))
        }
      }
      setStage('uploaded')
      !hasErrors && props.setTab('added')
    }
  }))

  return (
    <div className={styles.uploadingFiles} style={{ display: !props.display && 'none' }}>
      <div className={styles.uploadingScreen}>
        <div className={styles.uploadingCaption}>
          { stage === 'uploading' && <>
            <CircularProgress size={20} thickness={10} />
            <span className={styles.caption}>Загрузка файла {uploadingFileIndex} из {filesListLength}</span>
          </>}
          { stage === 'uploaded' && <>
            <MdDone />
            <span className={styles.caption}>{props.errors.length < filesListLength ? 'Файлы загружены' : 'Операция завершена'}</span>
          </>}
        </div>
        {Boolean(props.errors.length) && <div className={styles.errors}>
          <span>Ошибки во время загрузки файлов:</span>
          {props.errors.map((error, i) => <span key={i}>Файл «{error.filename}»: {
            {
              'File with such hash already exist': 'Такой файл уже загружен в этот пак'
            }[error.errorMessage]
          }</span>)}
        </div>}
        {stage === 'uploaded' && <Button variant='contained' onClick={() => props.setStage('addForm')}>ОК</Button>}
      </div>
    </div>
  )
})

UploadingFiles.propTypes = {
  errors: PropTypes.array,
  setErrors: PropTypes.func,
  setStage: PropTypes.func,
  setTab: PropTypes.func,
  pack: PropTypes.object,
  display: PropTypes.bool,
  // setUploadingFileIndex: PropTypes.number,
}
UploadingFiles.displayName = 'UploadingFiles'

export default connect(mapPackState, null, null, { forwardRef: true })(UploadingFiles)
