import JSZip from 'jszip'
import { saveLocalPack, loadLocalPack } from 'localStorage/localPacks'
import { removeUndefined } from 'utils'
import xmlJS from 'xml-js'
import FileResolver from './fileResolver'

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
      if(!array?.elements) { return [] }
      return array.elements.map(t => t.elements[0].text)
    }

    const packageTag = n(content, 'package')
    const { id, name, version, difficulty, restriction, date, publisher, logo, language } = packageTag.attributes

    if(await loadLocalPack(id) !== null) return { error: 'packExist' }

    const files = new FileResolver(zip, id)

    const infoTag = n(packageTag, 'info')
    const rounds = await Promise.all(n(packageTag, 'rounds').elements.map(async round => ({
      name: round.attributes.name,
      themes: await Promise.all(n(round, 'themes').elements.map(async theme => ({
        name: theme.attributes.name,
        questions: await Promise.all(n(theme, 'questions').elements.map(async question => {
          const type = n(question, 'type')?.attributes.name ?? 'simple'

          const typeParam = name => {
            const type = n(question, 'type')
            const param = type.elements.find(({ attributes }) => attributes.name === name)
            return param.elements[0].text
          }

          const questionPriceType = ['bagcat', 'cat'].includes(type) && (isNaN(typeParam('cost'))
            ? 'byPlayer' : Number(typeParam('cost')) > 0 ? 'fixed' : 'minMax')

          var realpriceFrom, realpriceStep, realpriceTo, playerSelectingPrice = false
          if(type === 'bagcat' && questionPriceType === 'byPlayer') {
            playerSelectingPrice = true
            var [,realpriceFrom,realpriceTo,realpriceStep] = typeParam('cost').match(/^[\\d+;\\d+]\/\\d*$/)
          }

          return {
            correctAnswers: mapText(n(question, 'right')),
            detailsDisclosure: type === 'bagcat' ? typeParam('knows') : undefined,
            incorrectAnswers: mapText(n(question, 'wrong')),
            price: Number(question.attributes.price),
            realprice: type === 'cat' || (type === 'bagcat' && questionPriceType === 'fixed')
              ? Number(typeParam('cost')) || 100 : undefined,
            realpriceFrom: playerSelectingPrice ? Number(realpriceFrom) || 0 : undefined,
            realpriceStep: playerSelectingPrice ? Number(realpriceStep) || 0 : undefined,
            realpriceTo: playerSelectingPrice ? Number(realpriceTo) || 0 : undefined,
            realtheme: ['bagcat', 'cat'].includes(type) ? typeParam('theme') : undefined,
            scenario: await Promise.all(
              n(question, 'scenario').elements.map(
                async atom => ({
                  type: atom.attributes.type,
                  duration: Number(atom.attributes.time) || 3,
                  data: await (async () => {
                    const atomType = atom.attributes.type
                    const atomContent = atom.elements?.[0]?.text
                    switch(atomType) {
                      case 'text':
                        return { text: atomContent }

                      case 'say':
                        return { say: atomContent }

                      case 'image':
                        return { imageField: await files.connect(atomContent) }

                      case 'marker':
                        return {}
                    }
                  })()
                })
              )
            ),
            transferToSelf: type === 'bagcat' ? typeParam('self') : undefined,
            type
          }
        }))
      })))
    })))

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
      authors,
      publisher,
      tags,
      logo: await files.connect(logo),
      language: language || '',
      rounds
    })
    await saveLocalPack(pack)
    return true
  } catch(e) {
    console.error(e)
    return { error: e }
  }
}
