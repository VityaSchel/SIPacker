import SparkMD5 from 'spark-md5'
import { nanoid } from 'nanoid'
import { init } from './indexeddb'
import { loadLocalPacks } from 'localStorage/localPacks'

export async function getFile(fileURI) {
  const db = init()
  let file = await db.files.get(fileURI)
  return file ?? null
}

export async function getPacksIDs() {
  const db = init()
  const packIDs = await db.files.toArray()
  return packIDs.map(({ packUUID }) => packUUID)
}

async function getDeletedPacks() {
  const existingPacks = await loadLocalPacks()
  const allPacks = await getPacksIDs()
  return allPacks.filter(pack => !existingPacks.includes(pack))
}

const mimeTypes = {
  image: ['image/png', 'image/jpeg'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  video: ['video/mpeg']
}
export const allowedFileTypes = [...mimeTypes.image, ...mimeTypes.audio, ...mimeTypes.video]
export async function saveFile(blob, packUUID) {
  if(!allowedFileTypes.includes(blob.type)) { throw 'Mime-type is not supported' }
  if(!blob.filename) { throw 'Blob instance must have filename propery' }

  const db = init()
  const hash = await hashFile(blob)

  let results = await db.files.where({ packUUID, hash }).toArray()
  if(results.length) throw 'File with such hash already exist'

  const type = Object.entries(mimeTypes).find(
    ([,mimeType]) => mimeType.some(type => type === blob.type)
  )[0]

  const fileURI = nanoid()
  const fileObject = {
    fileURI,
    type,
    blob,
    fileName: blob.filename,
    hash,
    packUUID,
    addedAt: Date.now()
  }

  switch(type) {
    case 'image':
      fileObject.miniature = await generateMiniature(blob)
      break
  }

  await db.files.put(fileObject)
  return fileURI
}

const maxSize = 100
async function generateMiniature(blob) {
  const img = document.createElement('img')
  const src = URL.createObjectURL(blob)
  img.src = src
  await new Promise(resolve => img.onload = resolve)
  const { width, height } = img
  const size = Math.min(width, height, maxSize)
  let newWidth = size, newHeight = size
  if(width > height) newHeight = newWidth*height/ width
  else newWidth = newHeight*width/height

  const canvas = document.createElement('canvas')
  canvas.width = newWidth
  canvas.height = newHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const miniature = await new Promise(resolve => canvas.toBlob(resolve))
  URL.revokeObjectURL(src)
  return miniature
}

export async function deleteFile(fileURI) {
  const db = init()
  await db.files.where('fileURI').equals(fileURI).delete()
}

function hashFile(file) {
  return new Promise((resolve, reject) => {
    // from https://github.com/satazor/js-spark-md5#hash-a-file-incrementally
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    const chunkSize = 1024*1024*2
    const chunks = Math.ceil(file.size / chunkSize)
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    let currentChunk = 0

    fileReader.onload = e => {
      spark.append(e.target.result)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = () => reject('Unable to hash file')

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}

const size = 20
export async function getRecent(filters) {
  const db = init()
  if(filters.includes('null')){
    filters.splice(filters.indexOf('null'), 1)
    const deletedPacks = await getDeletedPacks()
    filters.push(...deletedPacks)
  }
  const files = await db.files.where('packUUID').anyOf(filters).limit(size).offset(0).toArray()
  return files
}
