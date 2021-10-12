import { init } from '../indexeddb'
import { loadLocalPacks } from 'localStorage/localPacks'
export { allowedFileTypes, saveFile } from './saveFile'

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

export async function getDeletedPacks() {
  let existingPacks = await loadLocalPacks()
  existingPacks = existingPacks.map(({ uuid }) => uuid)
  const allPacks = await getPacksIDs()
  return allPacks.filter(pack => !existingPacks.includes(pack))
}

export async function deleteFile(fileURI) {
  const db = init()
  await db.files.where('fileURI').equals(fileURI).delete()
}

const size = 20
export async function getRecent(filters) {
  const db = init()
  if(filters.includes('null')){
    filters.splice(filters.indexOf('null'), 1)
    const deletedPacks = await getDeletedPacks()
    filters.push(...deletedPacks)
  }
  const files = await db.files.where('packUUID').anyOf(filters)
    .limit(size)
    .offset(0)
    .reverse()
    .sortBy('addedAt')
  return files
}

export async function deleteFilesOfPack(packUUID) {
  const db = init()
  const files = await db.files.where({ packUUID }).primaryKeys()
  await db.files.bulkDelete(files)
}
