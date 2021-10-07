import SparkMD5 from 'spark-md5'
import { nanoid } from 'nanoid'
import { init } from './indexeddb'

export async function getFile(fileURI) {
  const db = init()
  let file = await db.files.get(fileURI)
  return file ?? null
}

export async function saveFile(blob, packUUID) {
  const allowedFileTypes = ['image/png', 'image/jpeg', 'audio/mpeg']
  if(!allowedFileTypes.includes(blob.type)) { throw 'Mime-type is not supported' }
  if(!blob.filename) { throw 'Blob instance must have filename propery' }

  const db = init()
  const hash = await hashFile(blob)

  let results = await db.files.where({ packUUID, hash }).toArray()
  if(results.length) throw 'File with such hash already exist'

  const fileURI = nanoid()
  await db.files.put({
    fileURI,
    type: blob.type,
    blob: blob,
    fileName: blob.filename,
    hash,
    packUUID,
    addedAt: Date.now()
  })
  return fileURI
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
  const files = await db.files.where('packUUID').anyOf(filters).limit(size).offset(0).toArray()
  return files
}
