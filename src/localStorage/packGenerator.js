import JSZip from 'jszip'
import { format, formatDefaults } from '../consts'
import xmlJS from 'xml-js'
import { saveLocalPack } from '../localStorage/localPacks'
import { removeUndefined } from '../utils'

const packErrors = {
  noAuthor: 'Добавьте как минимум одного автора в настройках пака',
  noLanguage: 'Установите язык вопросов в настройках пака'
}
export async function check(pack) {
  let errors = []
  if(!pack.author) errors.push(packErrors.noAuthor)
  if(!pack.language) errors.push(packErrors.noLanguage)

  return errors
}

export async function generate(pack) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', formatDefaults.contentTypes)
  // zip.folder('Audio')
  // zip.folder('Images')
  // zip.folder('Texts')

  const packContent = {
    declaration: {
      attributes: {
        version: format.xmlVersion,
        encoding: format.encoding
      }
    },
    elements: [
      {
        type: 'comment',
        comment: 'This package was generated using SIPacker — free open-source online tool for generating SIGame packs. Feel free to leave feedback on https://github.com/VityaSchel/SIPacker'
      },
      {
        type: 'element',
        name: 'package',
        attributes: {
          xmlns: 'http://vladimirkhil.com/ygpackage3.0.xsd',
          id: pack.uuid,
          name: pack.name,
          version: pack.version,
          restriction: pack.over18 ? '18+' : undefined,
          date: pack.date,
          publisher: pack.publisher,
          difficulty: pack.difficulty,
          logo: pack.logo,
          language: pack.language,
          software: 'sipacker'
        },
        elements: [
          pack.tags && {
            type: 'element',
            name: 'tags',
            elements: pack.tags.split(',').map(tag => ({
              type: 'element',
              name: 'tag',
              elements: [{ type: 'text', text: tag }]
            }))
          },
          {
            type: 'element',
            name: 'info',
            elements: [
              {
                type: 'element',
                name: 'authors',
                elements: pack.authors.split(',').map(author => ({
                  type: 'element',
                  name: 'author',
                  elements: [{ type: 'text', text: author }]
                }))
              },
              pack.comment && {
                type: 'element',
                name: 'comments',
                elements: [
                  {
                    type: 'text',
                    text: pack.comment
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  zip.file('content.xml', xmlJS.js2xml(packContent, { compact: true }))
  const zipInBlob = await zip.generateAsync({ type: 'blob' })
  return zipInBlob
}

export async function parse(blob) {
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
