import hashFile from './hashFile'
import { nanoid } from 'nanoid'
import { init } from '../indexeddb'
import drawTransparentPattern from 'checkerboardjs'

const mimeTypes = {
  image: ['image/png', 'image/jpeg', 'image/gif'],
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
    size: blob.size,
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

export async function saveFileAsURL(url, file, packUUID) {
  const db = init()

  let results = await db.files.where({ packUUID, url }).toArray()
  if(results.length) throw 'File with such url already exist'

  const type = file.type === 'unknown'
    ? 'unknown'
    : Object.entries(mimeTypes).find(
      ([,mimeType]) => mimeType.some(type => type === file.type)
    )[0]

  const fileURI = nanoid()
  const fileObject = {
    fileURI,
    type,
    url,
    size: file.size,
    fileName: file.name,
    packUUID,
    addedAt: Date.now()
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
  drawTransparentPattern(canvas)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const miniature = await new Promise(resolve => canvas.toBlob(resolve))
  URL.revokeObjectURL(src)
  return miniature
}
