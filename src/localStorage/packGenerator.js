import JSZip from 'jszip'
import { format, formatDefaults } from '../consts'
import xmlJS from 'xml-js'

export default async function generate(pack) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', formatDefaults.contentTypes)
  // zip.folder('Audio')
  // zip.folder('Images')
  // zip.folder('Texts')
  const packContent = {
    _declaration: {
      _attributes: {
        version: format.xmlVersion,
        encoding: format.encoding
      }
    },
    package: {
      _attributes: {
        xmlns: 'http://vladimirkhil.com/ygpackage3.0.xsd',
        name: pack.name
      }
    }
  }
  zip.file('content.xml', xmlJS.js2xml(packContent, { compact: true }))
  const zipInBlob = await zip.generateAsync({ type: 'blob' })
  return zipInBlob
}
