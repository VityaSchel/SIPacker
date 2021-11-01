import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'
import { getRecent } from 'localStorage/fileStorage'
import File from './File'
import Typography from '@mui/material/Typography'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import mergeRefs from 'react-merge-refs'

const List = React.forwardRef((props, ref) => {
  const [fetchedFiles, setFetchedFiles] = React.useState([])
  const [mappedFiles, setMappedFiles] = React.useState([])
  const [offset, setOffset] = React.useState(0)
  const scrollRef = useBottomScrollListener(() => setOffset(offset+20))
  const contentRef = React.useRef()

  React.useImperativeHandle(ref, () => ({
    reset() {
      setOffset(0)
      setFetchedFiles([])
      setMappedFiles([])
      contentRef.current.scrollTop = 0
    }
  }))

  React.useEffect(() => setOffset(0), [props.packs])
  React.useEffect(() => mapFiles(offset), [offset])

  const mapFiles = async offset => {
    const newFiles = await getRecent(Object.keys(props.packs), offset)
    const newFetchedFiles = fetchedFiles.concat(newFiles)
    setFetchedFiles(newFetchedFiles)

    const mappedFiles = []
    let packSwitchUUID
    for (let file of newFetchedFiles) {
      if(packSwitchUUID !== file.packUUID){
        packSwitchUUID = file.packUUID
        mappedFiles.push({
          packName: props.packs[packSwitchUUID],
          files: [file]
        })
      } else {
        mappedFiles[mappedFiles.length - 1].files.push(file)
      }
    }

    setMappedFiles(mappedFiles)
  }

  return (
    <div className={styles.list}>
      <div className={styles.content} ref={mergeRefs([contentRef, scrollRef])}>
        {
          mappedFiles.length
            ? mappedFiles.map((packGroup, i) => <div key={i}>
              <div className={styles.packDivider}>
                {packGroup.packName
                  ? <>Пак <b>{packGroup.packName}</b></>
                  : <>Удаленный пак</>
                }
              </div>
              <div className={styles.grid}>
                {packGroup.files.map((file, j) =>
                  <File
                    file={file}
                    key={`${i}_${j}`}
                    handleSelect={props.handleSelect}
                    onRemove={mapFiles}
                    disabled={file.type !== 'unknown' && file.type !== props.acceptableType}
                  />
                )}
              </div>
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
})

List.propTypes = {
  packs: PropTypes.array,
  handleSelect: PropTypes.func,
  acceptableType: PropTypes.string,
}
List.displayName = 'List'

export default List
