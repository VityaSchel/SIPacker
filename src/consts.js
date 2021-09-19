import PropTypes from 'prop-types'

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
  encoding: 'UTF-8',
  version: 4
}
