import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'
import { getRecent } from 'localStorage/fileStorage'
import File from './File'
import Typography from '@mui/material/Typography'

List.propTypes = {
  packs: PropTypes.array,
  handleSelect: PropTypes.func
}

export default function List(props) {
  const [files, setFiles] = React.useState([])

  React.useEffect(() => { mapFiles() }, [props.packs])

  const mapFiles = async () => {
    const files = await getRecent(props.packs.map(pack => pack.uuid))
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
          files.length
            ? files.map((packGroup, i) => <div key={i}>
              <div className={styles.packDivider}>Пак <b>{packGroup.packName}</b></div>
              <Grid container spacing={2} className={styles.grid}>
                {packGroup.files.map((file, j) =>
                  <File
                    file={file}
                    key={`${i}_${j}`}
                    handleSelect={props.handleSelect}
                    onRemove={mapFiles}
                  />
                )}
              </Grid>
            </div>)
            : <div className={styles.noFilesYet}>
              <Typography className={styles.hint}>Файлы не найдены</Typography>
              <Typography className={styles.hint}>Попробуйте изменить фильтры</Typography>
              <Typography className={styles.hint}>Загрузите файлы во вкладке Загрузка</Typography>
            </div>
        }
      </div>
    </div>
  )
}
