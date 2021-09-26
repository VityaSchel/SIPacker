import { init } from './indexeddb'

export async function loadLocalPack(packUUID) {
  const db = init()
  let pack = await db.packs.get(packUUID)
  return pack ?? null
}

export async function loadLocalPacks() {
  const db = init()
  const packs = await db.packs.toArray()
  return packs
}

export async function saveLocalPack(pack) {
  const db = init()
  await db.packs.put(pack)
}

export async function deleteLocalPack(packUUID) {
  const db = init()
  await db.packs.delete(packUUID)
}
