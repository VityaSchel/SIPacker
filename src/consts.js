import PropTypes from 'prop-types'
import xmlJS from 'xml-js'

export const componentsPropTypes = {
  pack: {
    uuid: PropTypes.string,
    name: PropTypes.string,
    creationTime: PropTypes.number,
    date: PropTypes.string,
    thumbnail: PropTypes.string
  }
}

export const format = {
  xmlVersion: '1.0',
  encoding: 'utf-8',
  version: 4
}

export const formatDefaults = {
  contentTypes: xmlJS.js2xml({
    _declaration: {
      _attributes: {
        version: format.xmlVersion,
        encoding: format.encoding
      }
    },
    Types: {
      _attributes: {
        xmlns: 'http://schemas.openxmlformats.org/package/2006/content-types',
      },
      Default: {
        _attributes: {
          Extension: 'xml',
          ContentType: 'si/xml'
        }
      }
    }
  }, { compact: true })
}