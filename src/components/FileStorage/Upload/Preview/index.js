import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Button from '@mui/material/Button'
import cx from 'classnames'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { filesize, getType } from 'utils'
import Compressor from 'compressorjs'
import { MdInfoOutline } from 'react-icons/md'
import { mimeTypes } from 'localStorage/fileStorage/saveFile'

Preview.propTypes = {
  onContinue: PropTypes.func,
  onCancel: PropTypes.func,
  files: PropTypes.array,
}

const compressableTypes = ['image/png', 'image/jpeg']

export default function Preview(props) {
  const [selectedFile, setSelectedFile] = React.useState({ blob: props.files?.[0], index: 0 })
  const [originals, setOriginals] = React.useState()
  const [compresses, setCompresses] = React.useState()
  const [files, setFiles] = React.useState()

  React.useEffect(() => {
    setFiles(props.files)
    compressFiles()
  }, [props.files])

  const compressFiles = async () => {
    const originalsMap = originals ?? new WeakMap()
    const originalsSources = []
    const compressesMap = compresses ?? new WeakMap()
    const compressessSources = []
    for (let file of props.files) {
      if(!compressableTypes.includes(file.type)) continue

      const originalSrcURL = URL.createObjectURL(file)
      originalsMap.set(file, { size: file.size, src: originalSrcURL, blob: file })
      originalsSources.push(originalSrcURL)

      const compressedFile = await new Promise(resolve => new Compressor(file, { quality: 0.7, success: resolve }))
      const compressedSrcURL = URL.createObjectURL(compressedFile)
      compressesMap.set(file, { size: compressedFile.size, src: compressedSrcURL, blob: compressedFile })
      compressessSources.push(compressedSrcURL)
    }
    setOriginals(originalsMap)
    setCompresses(compressesMap)
    return () => originalsSources?.concat(...compressessSources)?.forEach?.(URL.revokeObjectURL)
  }

  const setFile = (index, newValue) => {
    files[index] = newValue
    setFiles(files)
  }

  return (
    <div className={styles.preview}>
      <div className={styles.list}>
        <div className={styles.scrollable}>
          {props.files.map((file, i) => (
            <div
              className={cx(styles.treeFile, { [styles.selected]: selectedFile.blob === file })}
              key={i} title={file.name}
              onClick={() => setSelectedFile({ blob: file, index: i })}
            >{file.name}</div>
          ))}
        </div>
        <div className={styles.actions}>
          <Button
            onClick={() => props.onContinue(files)}
            color='primary'
            variant='contained'
          >
            Продолжить
          </Button>
          <Button
            onClick={props.onCancel}
            color='primary'
          >
            Отмена
          </Button>
        </div>
      </div>
      <div className={styles.file}>
        <h2>{selectedFile.blob.name}</h2>
        <h4>{getType(selectedFile.blob.type)}</h4>
        { compressableTypes.includes(selectedFile.blob.type)
            && originals && compresses
            && originals.get(selectedFile.blob).size !== compresses.get(selectedFile.blob).size
          ? <VersionChoose
            originals={originals}
            compresses={compresses}
            selectedFile={selectedFile}
            setFile={setFile}
          />
          : <FileInfo file={selectedFile} />
        }
      </div>
    </div>
  )
}

VersionChoose.propTypes = {
  originals: PropTypes.array,
  compresses: PropTypes.array,
  selectedFile: PropTypes.object,
  setFile: PropTypes.func
}
function VersionChoose(props) {
  const [choosedVersion, setChoosedVersion] = React.useState('original')
  const original = props.originals?.get(props.selectedFile.blob)
  const compressed = props.compresses?.get(props.selectedFile.blob)
  const compressedPercent = 100-(compressed.size/original.size*100)

  const handleChangeVersion = (_, newValue) => {
    if(newValue === 'original') props.setFile(props.selectedFile.index, original.blob)
    else if(newValue === 'compressed') props.setFile(props.selectedFile.index, compressed.blob)
    setChoosedVersion(newValue)
  }

  return (
    <div className={styles.choose}>
      <div className={styles.versionsPreview}>
        <div onClick={() => handleChangeVersion(null, 'original')}><img src={original.src} alt='Оригинал' /></div>
        <div onClick={() => compressedPercent !== 0 && handleChangeVersion(null, 'compressed')}><img src={compressed.src} alt='Сжатая версия' /></div>
      </div>
      <RadioGroup
        value={choosedVersion}
        onChange={handleChangeVersion}
        name='version-chooser'
        row className={styles.row}
      >
        <FormControlLabel
          value='original'
          control={<Radio />}
          label={
            <RadioLabel
              label='Использовать оригинал'
              sublabel={filesize(original.size)}
            />
          }
        />
        <FormControlLabel
          value='compressed'
          disabled={compressedPercent === 0}
          control={<Radio />}
          label={
            <RadioLabel
              label='Сжать изображение'
              sublabel={
                `${filesize(compressed.size)} (-${compressedPercent.toFixed(2)}%)`
              }
            />
          }
        />
      </RadioGroup>
    </div>
  )
}

RadioLabel.propTypes = {
  label: PropTypes.string,
  sublabel: PropTypes.string,
}
function RadioLabel(props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>{props.label}</span>
      <span style={{ color: '#a0a0a0' }}>{props.sublabel}</span>
    </div>
  )
}

FileInfo.propTypes = {
  file: PropTypes.object,
}
function FileInfo(props) {
  const [src, setSrc] = React.useState()

  React.useEffect(() => {
    const src = URL.createObjectURL(props.file.blob)
    setSrc(src)
    return () => URL.revokeObjectURL(src)
  }, [props.file])

  return (
    <div className={styles.fileInfo}>
      {mimeTypes.image.includes(props.file.blob.type) && <img src={src} />}
      {mimeTypes.audio.includes(props.file.blob.type) && <audio controls src={src} />}
      {mimeTypes.video.includes(props.file.blob.type) && <video controls src={src} />}
      <div className={styles.info}>
        <span>Размер: {filesize(props.file.blob.size)}</span>
        <span className={styles.hint}>
          <MdInfoOutline /> Сжатие файла этого типа в браузере невозможно, попробуйте сжать файл самостоятельно и
          загрузить сжатую версию.
        </span>
      </div>
    </div>
  )
}
