import JSZip from 'jszip'
import { format, formatDefaults } from '../consts'
import xmlJS from 'xml-js'

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

  const generateTags = tags => {
    if(!tags) { return }

    tags = tags.split(',').map(tag => ({ _text: tag }))
    return { tag: tags }
  }

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
          version: format.version,
          restriction: pack.over18 ? '18+' : undefined,
          date: pack.date,
          publisher: pack.publisher,
          difficulty: pack.difficulty,
          logo: pack.logo,
          language: pack.language,
          software: 'sipacker'
        }
      },
      {
        type: 'element',
        name: 'tags',
        elements: generateTags(pack.tags)
      },
      {
        type: 'element',
        name: 'info',
        elements: [
          {
            type: 'element',
            name: 'authors',
            attributes: {
              author: pack.authors.split(',')
            }
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
  zip.file('content.xml', xmlJS.js2xml(packContent, { compact: true }))
  const zipInBlob = await zip.generateAsync({ type: 'blob' })
  return zipInBlob
}

export async function parse(blob) {
  try {
    const zip = await JSZip.loadAsync(blob)
    const packContent = await zip.files['content.xml'].async('string')
    const content = xmlJS.xml2js(packContent)
    console.log(content)
  } catch(e) {
    return { errors: e }
  }
}
