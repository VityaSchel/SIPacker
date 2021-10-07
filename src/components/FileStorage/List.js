import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'
import { getRecent } from 'localStorage/fileStorage'
import File from './File'

List.propTypes = {
  packs: PropTypes.array,
  handleSelect: PropTypes.func
}

export default function List(props) {
  const [files, setFiles] = React.useState([])

  React.useEffect(() => {
    getRecent(props.packs.map(pack => pack.uuid)).then(mapFiles)
  }, [])

  const mapFiles = files => {
    const mappedFiles = []
    let packSwitchUUID
    for (let file of files) {
      if(packSwitchUUID !== file.packUUID){
        packSwitchUUID = file.packUUID
        mappedFiles.push({
          packName: props.packs.find(pack => pack.uuid === packSwitchUUID).name,
          files: [file]
        })
      } else {
        mappedFiles[mappedFiles.length - 1].files.push(file)
      }
    }
    setFiles(mappedFiles)
  }

  return (
    <div className={styles.list}>
      <div className={styles.content}>
        {
          files.map((packGroup, i) => <div key={i}>
            <div className={styles.packDivider}>Пак <b>{packGroup.packName}</b></div>
            <Grid container spacing={2} className={styles.grid}>
              {packGroup.files.map((file, j) =>
                <File
                  file={file}
                  key={`${i}_${j}`}
                  handleSelect={props.handleSelect}
                />
              )}
            </Grid>
          </div>
          )
        }
      </div>
    </div>
  )
}
