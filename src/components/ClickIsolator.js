import PropTypes from 'prop-types'

const ClickIsolator = props => (
  <div onClick={e => e.stopPropagation()} {...props}>{props.children}</div>
)

ClickIsolator.propTypes = { children: PropTypes.any }
ClickIsolator.displayName = 'ClickIsolator'
export default ClickIsolator
