import JSZip from 'jszip'
import { format, formatDefaults } from 'consts'
import xmlJS from 'xml-js'
import FileResolver from './fileResolver'
export { default as parse } from './parser'
import { hasQuestionInEachTheme, hasThemeInEachRound, hasScenarioInEachQuestion } from 'utils'
import xmlescape from 'xml-escape'

const bom = '\uFEFF'

const packErrors = {
  noAuthor: 'Добавьте как минимум одного автора в настройках пака',
  noLanguage: 'Установите язык вопросов в настройках пака',
  noRounds: 'Добавьте как минимум один раунд',
  noTheme: 'Добавьте как минимум одну тему в каждом раунде',
  noQuestion: 'Добавьте как минимум один вопрос в каждой теме в каждом раунде',
  noScenario: 'Добавьте как минимум одно событие в каждом сценарии каждого вопроса в каждом теме каждого раунда',
}
export async function check(pack) {
  let errors = []
  if(!pack.authors) errors.push(packErrors.noAuthor)
  if(!pack.language) errors.push(packErrors.noLanguage)
  if(!pack.rounds.length) errors.push(packErrors.noRounds)
  else if(!hasThemeInEachRound(pack)) errors.push(packErrors.noTheme)
  else if(!hasQuestionInEachTheme(pack)) errors.push(packErrors.noQuestion)
  else if(!hasScenarioInEachQuestion(pack)) errors.push(packErrors.noScenario)

  return errors
}

function questionType(question) {
  if(question.type !== 'simple') {
    return [{
      type: 'element',
      name: 'type',
      attributes: {
        name: question.type
      },
      elements: questionParams(question)
    }]
  } else { return [] }
}

function questionParams(question){
  const params = {
    cat: ['theme', 'cost'],
    auction: [],
    bagcat: ['theme', 'cost', 'self', 'knows'],
    sponsored: []
  }
  const properties = {
    theme: 'realtheme',
    cost: 'realprice',
    self: 'transferToSelf',
    knows: 'detailsDisclosure'
  }
  const paramsName = params[question.type]
  return paramsName.map(param => {
    let text = question[properties[param]]
    if(param === 'cost' && question.type === 'bagcat') {
      switch(question.questionPriceType) {
        case 'minMax':
          text = 0
          break

        case 'byPlayer':
          text = `[${question.realpriceFrom};${question.realpriceTo}]/${question.realpriceStep}`
          break
      }
    }
    if(param === 'theme') text = xmlescape(text)
    if(param === 'self') text = String(Boolean(text))
    return (
      {
        type: 'element',
        name: 'param',
        attributes: {
          name: param
        },
        elements: [{ type: 'text', text }]
      }
    )
  })
}

export async function generate(pack) {
  const zip = new JSZip()

  const texts = zip.folder('Texts')
  texts.file('authors.xml', bom+'<?xml version="1.0" encoding="utf-8"?><Authors />')
  texts.file('sources.xml', bom+'<?xml version="1.0" encoding="utf-8"?><Sources />')

  zip.file('[Content_Types].xml', bom+formatDefaults.contentTypes)

  const files = new FileResolver(zip)

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
          name: xmlescape(pack.name),
          version: pack.version,
          restriction: pack.over18 ? '18+' : undefined,
          date: pack.date,
          publisher: xmlescape(pack.publisher),
          difficulty: pack.difficulty,
          logo: await files.resolve(pack.logo, 'логотип пака'),
          language: pack.language,
          generator: 'sipacker'
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
                  elements: [{ type: 'text', text: xmlescape(tag) }]
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
                    elements: [{ type: 'text', text: xmlescape(author) }]
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
                      text: xmlescape(pack.comment)
                    }
                  ]
                }
              ] : []
            ]
          },
          {
            type: 'element',
            name: 'rounds',
            elements: await Promise.all(pack.rounds.map(async round => (
              {
                type: 'element',
                name: 'round',
                attributes: {
                  name: xmlescape(round.name)
                },
                elements: [
                  {
                    type: 'element',
                    name: 'themes',
                    elements: await Promise.all(round.themes.map(async theme => (
                      {
                        type: 'element',
                        name: 'theme',
                        attributes: {
                          name: xmlescape(theme.name)
                        },
                        elements: [
                          {
                            type: 'element',
                            name: 'questions',
                            elements: await Promise.all(theme.questions.map(async question => (
                              {
                                type: 'element',
                                name: 'question',
                                attributes: {
                                  price: question.price
                                },
                                elements: [
                                  ...questionType(question),
                                  {
                                    type: 'element',
                                    name: 'scenario',
                                    elements: await Promise.all(question.scenario.map(async scenarioEvent => (
                                      {
                                        type: 'element',
                                        name: 'atom',
                                        attributes: {
                                          type: scenarioEvent.type,
                                          time: scenarioEvent.duration
                                        },
                                        elements: !['say', 'marker'].includes(scenarioEvent.type) ? [
                                          {
                                            type: 'text',
                                            text: {
                                              text: xmlescape(scenarioEvent.data.text ?? '').replaceAll('\n', '\\n'),
                                              image: await files.resolve(
                                                scenarioEvent.data.imageField,
                                                `сценарий вопроса за ${question.price} в теме «${theme.name}» в раунде «${round.name}»`
                                              ),
                                            }[scenarioEvent.type]
                                          }
                                        ] : []
                                      }
                                    )))
                                  },
                                  {
                                    type: 'element',
                                    name: 'right',
                                    elements: question.correctAnswers.map(answer => (
                                      {
                                        type: 'element',
                                        name: 'answer',
                                        elements: [{ type: 'text', text: xmlescape(answer) }]
                                      }
                                    ))
                                  },
                                  {
                                    type: 'element',
                                    name: 'wrong',
                                    elements: question.incorrectAnswers.map(answer => (
                                      {
                                        type: 'element',
                                        name: 'answer',
                                        elements: [{ type: 'text', text: xmlescape(answer) }]
                                      }
                                    ))
                                  }
                                ]
                              }
                            )))
                          }
                        ]
                      }
                    )))
                  }
                ]
              }
            )))
          }
        ]
      }
    ]
  }
  const content = xmlJS.js2xml(packContent)
  zip.file('content.xml', bom+content)

  const warnings = files.warnings

  const zipInBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  return { result: zipInBlob, warnings }
}
