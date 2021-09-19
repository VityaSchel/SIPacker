import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'

PackBreadcrumbs.propTypes = {
  pack: PropTypes.shape(componentsPropTypes.pack)
}

function PackBreadcrumbs(props) {
  const linkStyles = [styles.link, 'onHover', 'noDefaults'].join(' ')

  return (
    props.pack &&
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        className={linkStyles}
        to='/'
      >
        Паки
      </Link>
      <Typography color="text.primary">{props.pack.name}</Typography>
    </Breadcrumbs>
  )
}

export default connect(state => ({ pack: state.pack }))(PackBreadcrumbs)
