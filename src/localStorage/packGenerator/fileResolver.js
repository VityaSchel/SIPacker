import { getFile } from '../fileStorage'
import { nanoid } from 'nanoid'

export default class FileResolver {
  constructor(zip) {
    this.zip = zip
    this.resolvedFiles = {}
    this.folders = {}
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
    let id, extension
    switch(file.type) {
      case 'image':
        id = nanoid()
        while(Object.keys(this.resolvedFiles).includes(id))
          id = nanoid()

        this.resolvedFiles[id] = true
        const images = this.getDir('Images')
        extension = {'image/png': 'png', 'image/jpeg': 'jpg'}[file.blob.type]
        images.file(`${id}.${extension}`, file.blob)
    }
    return `@${id}.${extension}`
  }
}
