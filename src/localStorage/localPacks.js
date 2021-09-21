export function loadLocalPack(packUUID) {
  const pack = window.localStorage.getItem(`packs/${packUUID}`)
  return pack ? JSON.parse(pack) : null
}

export function loadLocalPacks() {
  const packs = Object.keys(window.localStorage)
    .filter(rname => rname.indexOf('packs/') === 0)
    .map(rname => rname.split('packs/', 2)[1])
  return packs
}

export function saveLocalPack(pack) {
  const packUUID = pack.uuid
  let packData = JSON.stringify(pack)
  window.localStorage.setItem(`packs/${packUUID}`, packData)
}

export function deleteLocalPack(packUUID) {
  window.localStorage.removeItem(`packs/${packUUID}`)
}
