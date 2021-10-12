import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes, uuidRegex } from '../../consts'
import { mapPackState } from '../../utils'

PackBreadcrumbs.propTypes = {
  pack: componentsPropTypes.pack
}

function PackBreadcrumbs(props) {
  const linkStyles = [styles.link, 'onHover', 'noDefaults'].join(' ')
  const route = useLocation()
  const [path, setPath] = React.useState([])

  React.useEffect(() => {
    const page = route.pathname.split(new RegExp(`/pack/${uuidRegex}`), 2)[1]

    const crumbs = {
      dashboard: { to: '/', name: 'Паки' },
      currentPack: { to: `/pack/${props.pack.uuid}`, name: props.pack.name },
      settings: { to: `/pack/${props.pack.uuid}/settings`, name: 'Настройки' },
      rounds: { to: `/pack/${props.pack.uuid}/rounds`, name: `Раунд ${page.split('/')[2]}` }
    }

    if(/^\/rounds\/\d\/?$/.test(page)){
      setPath([crumbs.dashboard, crumbs.currentPack, crumbs.rounds])
    } else if(/^\/settings\/?$/.test(page)) {
      setPath([crumbs.dashboard, crumbs.currentPack, crumbs.settings])
    } else {
      setPath([crumbs.dashboard, crumbs.currentPack])
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

export default connect(mapPackState)(PackBreadcrumbs)
