import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { getRecent } from 'localStorage/fileStorage'
import File from './File'
import Typography from '@mui/material/Typography'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import mergeRefs from 'react-merge-refs'
// import { BsSortNumericDownAlt, BsSortNumericDown } from 'react-icons/bs'

const sortFuncs = {
  uploadDate: {
    asc: (a, b) => a.addedAt - b.addedAt,
    desc: (a, b) => b.addedAt - a.addedAt,
  }
}

const List = React.forwardRef((props, ref) => {
  const [fetchedFiles, setFetchedFiles] = React.useState([])
  const [mappedFiles, setMappedFiles] = React.useState([])
  const [offset, setOffset] = React.useState(0)
  const [filesSortFunc, setFilesSortFunc] = React.useState(() => sortFuncs.uploadDate.desc)
  const scrollRef = useBottomScrollListener(() => setOffset(offset+20))
  const contentRef = React.useRef()

  React.useImperativeHandle(ref, () => ({
    reset() {
      setFetchedFiles([])
      setMappedFiles([])
      contentRef.current.scrollTop = 0
      setOffset(0)
    }
  }))

  React.useEffect(() => setOffset(-1), [props.packs])
  React.useEffect(() => mapFiles(offset), [offset])

  const mapFiles = async offset => {
    offset = Math.max(offset, 0)
    const newFiles = await getRecent(Object.keys(props.packs), offset)
    const newFetchedFiles = fetchedFiles.concat(newFiles)
    setFetchedFiles(newFetchedFiles)

    const newMappedFiles = []
    let packSwitchUUID
    for (let file of newFetchedFiles) {
      if(packSwitchUUID !== file.packUUID){
        packSwitchUUID = file.packUUID
        newMappedFiles.push({
          packName: props.packs[packSwitchUUID],
          files: [file]
        })
      } else {
        newMappedFiles[newMappedFiles.length - 1].files.push(file)
      }
    }

    setMappedFiles(newMappedFiles)
  }

  return (
    <div className={styles.list}>
      <div className={styles.content} ref={mergeRefs([contentRef, scrollRef])}>
        <div className={styles.sortSelector}>
          Сортировка:
          <ToggleButtonGroup
            value={filesSortFunc === sortFuncs.uploadDate.asc}
            exclusive
            onChange={(_, sortNewDirection) => setFilesSortFunc(sortNewDirection === 'asc' ? () => sortFuncs.uploadDate.asc : () => sortFuncs.uploadDate.desc)}
          >
            <ToggleButton value='asc'>
              {/* <BsSortNumericDown /> */}
              <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M21 17h3l-4 4l-4-4h3V3h2v14M8 16h3v-3H8v3m5-11h-1V3h-2v2H6V3H4v2H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V7c0-1.11-.89-2-2-2M3 18v-7h10v7H3Z"/></svg>
            </ToggleButton>
            <ToggleButton value='desc'>
              {/* <BsSortNumericDownAlt /> */}
              <svg width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h-3l4-4l4 4h-3v14h-2V7M8 16h3v-3H8v3m5-11h-1V3h-2v2H6V3H4v2H3c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V7c0-1.11-.89-2-2-2M3 18v-7h10v7H3Z"/></svg>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
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
                {packGroup.files
                  .sort(filesSortFunc)
                  .map((file, j) =>
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
