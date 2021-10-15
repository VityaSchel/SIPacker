import JSZip from 'jszip'
import { format, formatDefaults } from 'consts'
import xmlJS from 'xml-js'
import FileResolver from './fileResolver'
export { default as parse } from './parser'

const bom = '\uFEFF'

const packErrors = {
  noAuthor: 'Добавьте как минимум одного автора в настройках пака',
  noLanguage: 'Установите язык вопросов в настройках пака'
}
export async function check(pack) {
  let errors = []
  if(!pack.authors) errors.push(packErrors.noAuthor)
  if(!pack.language) errors.push(packErrors.noLanguage)

  return errors
}

export async function generate(pack) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', bom+formatDefaults.contentTypes)

  const texts = zip.folder('Texts')
  texts.file('authors.xml', bom+'<?xml version="1.0" encoding="utf-8"?><Authors />')
  texts.file('sources.xml', bom+'<?xml version="1.0" encoding="utf-8"?><Sources />')

  // const files = new FileResolver(zip)

  const packContent = {
    declaration: {
      attributes: {
        version: format.xmlVersion,
        encoding: format.encoding
      }
    },
    elements: [
      // {
      //   type: 'comment',
      //   comment: 'This package was generated using SIPacker — free open-source online tool for generating SIGame packs. Feel free to leave feedback on https://github.com/VityaSchel/SIPacker'
      // },
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
          // logo: await files.resolve(pack.logo),
          language: pack.language,
          // generator: 'sipacker'
        },
        elements: [
          ...pack.tags ? [
            {
              type: 'element',
              name: 'tags',
              elements: pack.tags.map(tag => (
                {
                  type: 'element',
                  name: 'tag',
                  elements: [{ type: 'text', text: tag }]
                }
              ))
            }
          ] : [],
          {
            type: 'element',
            name: 'info',
            elements: [
              {
                type: 'element',
                name: 'authors',
                elements: pack.authors.map(author => (
                  {
                    type: 'element',
                    name: 'author',
                    elements: [{ type: 'text', text: author }]
                  }
                ))
              },
              ...pack.comment ? [
                {
                  type: 'element',
                  name: 'comments',
                  elements: [
                    {
                      type: 'text',
                      text: pack.comment
                    }
                  ]
                }
              ] : []
            ]
          },
          {
            type: 'element',
            name: 'rounds',
            elements: pack.rounds.map(round => (
              {
                type: 'element',
                name: 'round',
                attributes: {
                  name: round.name
                },
                elements: [
                  {
                    type: 'element',
                    name: 'themes',
                    elements: round.themes.map(theme => (
                      {
                        type: 'element',
                        name: 'theme',
                        attributes: {
                          name: theme.name
                        },
                        elements: [
                          {
                            type: 'element',
                            name: 'questions',
                            elements: theme.questions.map(question => (
                              {
                                type: 'element',
                                name: 'question',
                                attributes: {
                                  price: question.price
                                },
                                elements: [
                                  {
                                    type: 'element',
                                    name: 'scenario',
                                    elements: [
                                      {
                                        type: 'element',
                                        name: 'atom',
                                        elements: [{ type: 'text', text: 'Чехия' }]
                                      }
                                    ]
                                  },
                                  {
                                    type: 'element',
                                    name: 'right',
                                    elements: [
                                      {
                                        type: 'element',
                                        name: 'answer',
                                        elements: [{ type: 'text', text: 'Прага' }]
                                      }
                                    ]
                                  },
                                  {
                                    type: 'element',
                                    name: 'wrong',
                                    elements: [
                                      {
                                        type: 'element',
                                        name: 'answer',
                                        elements: [{ type: 'text', text: 'Самара' }]
                                      },
                                      {
                                        type: 'element',
                                        name: 'answer',
                                        elements: [{ type: 'text', text: 'Москва' }]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ))
                          }
                        ]
                      }
                    ))
                  }
                ]
              }
            ))
          }
        ]
      }
    ]
  }
  const content = xmlJS.js2xml(packContent)
  zip.file('content.xml', bom+content)
  const zipInBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  return zipInBlob
}
