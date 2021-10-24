import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.module.scss'
import AddForm from './AddForm'
import UploadingFiles from './UploadingFiles'
import Preview from './Preview/'

Upload.propTypes = {
  packUUID: PropTypes.string,
  setTab: PropTypes.func
}

export default function Upload(props) {
  const [files, setFiles] = React.useState()
  const [errors, setErrors] = React.useState([])
  const [stage, setStage] = React.useState('AddForm')
  const uploadingFilesRef = React.useRef()

  React.useEffect(() => setStage('addForm'), [])

  const continueUploading = filesList => {
    setStage('uploading')
    uploadingFilesRef.current.upload(filesList)
  }
  const cancel = () => setStage('addForm')

  return (
    <div className={styles.upload}>
      {stage === 'addForm' &&
        <AddForm
          setFiles={setFiles}
          setTab={props.setTab}
          setErrors={setErrors}
          packUUID={props.packUUID}
          setStage={setStage}
        />}
      {stage === 'preview' &&
        <Preview
          onContinue={continueUploading}
          onCancel={cancel}
          files={files}
        />}
      <UploadingFiles
        ref={uploadingFilesRef}
        display={stage === 'uploading'}
        errors={errors}
        setErrors={setErrors}
        setStage={setStage}
        setTab={props.setTab}
      />
    </div>
  )
}
