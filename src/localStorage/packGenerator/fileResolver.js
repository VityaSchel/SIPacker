import { getFile } from '../fileStorage'
import { nanoid } from 'nanoid'
import { getUrlFileInfo } from 'components/FileStorage/Upload/AddForm'
import { saveFile, saveFileAsURL } from 'localStorage/fileStorage'
import signatures from './signatures.json'
import { extensionsMimeTypes } from 'utils'

// resolve = pack -> zip (downloading)
// connect = zip -> pack (uploading)

export default class FileResolver {
  constructor(zip, packUUID) {
    this.zip = zip
    this.packUUID = packUUID
    this.resolvedFiles = {}
    this.folders = {}
    this.warnings = []
  }

  getDir(folder) {
    if(!this.folders[folder]) this.folders[folder] = this.zip.folder(folder)
    return this.folders[folder]
  }

  async resolve(fileURI, error) {
    if(!fileURI) return
    // this.getDir('Audio')
    // this.getDir('Video')
    const file = await getFile(fileURI)
    if(!file) throw `Файл не найден: Проверьте поле ${error}`

    if(file.url) {
      if(file.url.startsWith('https://')) this.warnings.push(`Файл «${file.fileName}» по адресу ${file.url} будет недоступен в SIGame последних версий, потому что игра не поддерживает протокол https. Поменяйте протокол на http или проголосуйте за поддержку https в официальной группе SIGame ВКонтакте. В веб-версии SIGame файлы с протоколом https отображаются корректно.`)
      return file.url
    }

    if(this.resolvedFiles[fileURI]) return this.resolvedFiles[fileURI]

    if(file.blob.size > 1024*1024) this.warnings.push(`Размер файла «${file.fileName}» превышает 1 МБ`)

    let id, extension
    switch(file.type) {
      case 'image':
        id = nanoid()
        while(Object.values(this.resolvedFiles).includes(id))
          id = nanoid()

        this.resolvedFiles[fileURI] = id
        const images = this.getDir('Images')
        extension = Object.keys(Object.values(extensionsMimeTypes).indexOf(file.blob.type))
        images.file(`${id}.${extension}`, file.blob)
    }
    return `@${id}.${extension}`
  }

  async connect(fileID) {
    if(!fileID) return

    let file
    if(fileID.startsWith('@')) {
      fileID = fileID.substring(1)

      const images = this.zip.folder('Images')
      const audio = this.zip.folder('Audio')
      const video = this.zip.folder('Video')

      const recursiveSearch = () => {
        for (let folder of [images, audio, video]) {
          const file = folder?.file(fileID) ?? folder?.file(encodeURIComponent(fileID))
          if(file) return file
        }
      }

      file = await recursiveSearch()
      if(!file) throw { error: 'File not found', file: fileID }
      else file = await file.async('blob')

      const mimeType = await getMimeType(file, fileID.split('.').splice(-1))
      file = new Blob([file], { type: mimeType })
      file.filename = fileID

      const fileURI = await saveFile(file, this.packUUID)
      return fileURI
    } else {
      try {
        const file = getUrlFileInfo(fileID)
        if(!file) throw { error: 'URL error', file: fileID }
        const fileURI = await saveFileAsURL(fileID, file, this.packUUID)
        return fileURI
      } catch(e) {
        throw { error: e }
      }
    }
  }
}

async function getMimeType(blob, extension) {
  for(let { signs, mime } of signatures){
    for(let signature of signs) {
      let [offset, bytes] = signature.split(',')
      offset = Number(offset)

      const fileBytes = await getBytes(blob, offset, bytes.length/2)
      if(fileBytes === bytes) return mime
    }
  }
  return extensionsMimeTypes[extension]
}

function getBytes(blob, start, length) {
  return new Promise(resolve => {
    let fileReader = new FileReader()

    fileReader.onloadend = event => {
      if(event.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(event.target.result)
        let bytes = []

        uint.forEach((byte) => { // DO NOT use .map because it won't work with 16 hex
          bytes.push(byte.toString(16))
        })

        resolve(bytes.join('').toUpperCase())
      }
    }

    fileReader.readAsArrayBuffer(blob.slice(start, start+length))
  })
}
