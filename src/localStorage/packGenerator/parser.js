import JSZip from 'jszip'
import { saveLocalPack } from 'localStorage/localPacks'
import { removeUndefined } from 'utils'
import xmlJS from 'xml-js'

export default async function parse(blob) {
  try {
    const zip = await JSZip.loadAsync(blob)
    const contentXML = zip.files['content.xml']
    if(!contentXML) { return { error: 'noContentXML' }}
    const packContent = await contentXML.async('string')
    const content = xmlJS.xml2js(packContent)

    const n = (object, property) => {
      const target = object.elements.filter(e => e.name === property)
      return target && target[0]
    }

    const mapText = array => {
      if(!array) { return undefined }
      return array.elements.map(t => t.elements[0].text)
    }

    const packageTag = n(content, 'package')
    const { id, name, version, difficulty, restriction, date, publisher, logo, language } = packageTag.attributes
    const infoTag = n(packageTag, 'info')
    const authors = mapText(n(infoTag, 'authors'))
    const tags = mapText(n(packageTag, 'tags'))

    const pack = removeUndefined({
      uuid: id,
      name,
      version: Number(version),
      difficulty: Number(difficulty),
      creationTime: Date.now(),
      over18: restriction === '18+',
      date,
      authors: authors.join(','),
      publisher,
      tags: tags?.join(','),
      logo,
      language: language || ''
    })
    await saveLocalPack(pack)
    return true
  } catch(e) {
    return { error: e }
  }
}
