import Dexie from 'dexie'

export const init = () => {
  const db = new Dexie('sipacker')
  db.version(1).stores({
    packs: [
      'uuid'
      // also: name, version, over18, date, publisher, difficulty, logo, language, tags, authors, comment
    ].join(', '),
    files: [
      'fileURI',
      'type',
      'hash',
      'packUUID',
      'addedAt'
      // also: filename, blob
    ].join(', ')
  })
  return db
}
