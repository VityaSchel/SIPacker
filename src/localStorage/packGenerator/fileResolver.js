export default class FileResolver {
  constructor(zip) {
    this.zip = zip
  }

  getDir(folder) {
    if(!this.folders[folder]) this.folders[folder] = this.zip.folder(folder)
    return this.folders[folder]
  }

  async resolve(fileURI) {
    this.getDir('Images')
    this.getDir('Audio')
    this.getDir('Video')

  }
}
