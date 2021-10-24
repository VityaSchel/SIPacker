import { getFile } from '../fileStorage'
import { nanoid } from 'nanoid'

export default class FileResolver {
  constructor(zip) {
    this.zip = zip
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

    if(file.blob.size > 1024*1024) this.warnings.push(`Размер файла «${file.fileName}» превышает 1 МБ`)

    let id, extension
    switch(file.type) {
      case 'image':
        id = nanoid()
        while(Object.keys(this.resolvedFiles).includes(id))
          id = nanoid()

        this.resolvedFiles[id] = true
        const images = this.getDir('Images')
        extension = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif'}[file.blob.type]
        images.file(`${id}.${extension}`, file.blob)
    }
    return `@${id}.${extension}`
  }
}
