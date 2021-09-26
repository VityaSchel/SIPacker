import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'

PackBreadcrumbs.propTypes = {
  pack: PropTypes.shape(componentsPropTypes.pack)
}

function PackBreadcrumbs(props) {
  const linkStyles = [styles.link, 'onHover', 'noDefaults'].join(' ')
  const route = useLocation()
  const [path, setPath] = React.useState([])

  React.useEffect(() => {
    const pathParts = route.pathname.split('/').filter(String)
    const crumbs = {
      dashboard: { to: '/', name: 'Паки' },
      currentPack: { to: `/pack/${props.pack.uuid}`, name: props.pack.name },
      settings: { to: `/pack/${props.pack.uuid}/settings`, name: 'Настройки' }
    }
    switch(pathParts[2]) {
      case 'settings':
        setPath([crumbs.dashboard, crumbs.currentPack, crumbs.settings])
        break

      case undefined:
        setPath([crumbs.dashboard, crumbs.currentPack])
        break
    }
  }, [route, props.pack])

  return (
    <Breadcrumbs>
      {path.map(({ to, name }, i) => {
        if(to && i !== path.length-1) {
          return <Link to={to} className={linkStyles} key={i}>
            {name}
          </Link>
        } else {
          return <Typography color="text.primary" key={i}>{name}</Typography>
        }
      })}
    </Breadcrumbs>
  )
}

export default connect(state => ({ pack: state.pack }))(PackBreadcrumbs)
