export function loadLocalPack(packUUID) {
  const pack = window.localStorage.get(`packs/${packUUID}`)
  return pack ?? null
}

export function loadLocalPacks() {
  const packs = Object.keys(window.localStorage)
    .filter(rname => rname.indexOf('pack/') === 0)
    .map(rname => rname.split('pack/', 2)[1])
  return packs
}
