import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes, uuidRegex } from '../../consts'
import { mapPackState } from '../../utils'
import { settings, rounds, question } from './pathRegexps.json'

PackBreadcrumbs.propTypes = {
  pack: componentsPropTypes.pack
}

function PackBreadcrumbs(props) {
  const linkStyles = [styles.link, 'onHover', 'noDefaults'].join(' ')
  const route = useLocation()
  const [path, setPath] = React.useState([])

  React.useEffect(() => {
    const page = route.pathname.split(new RegExp(`/pack/${uuidRegex}`), 2)[1]
    const parts = page.split('/')

    const crumbs = {
      dashboard: { to: '/', name: 'Паки' },
      currentPack: { to: `/pack/${props.pack.uuid}`, name: props.pack.name },
      settings: { to: `/pack/${props.pack.uuid}/settings`, name: 'Настройки' },
      rounds: { to: `/pack/${props.pack.uuid}/rounds/${parts[2]}`, name: `Раунд ${parts[2]}` },
      theme: { name: `Тема ${parts[4]}` },
      questions: { to: `/pack/${props.pack.uuid}/rounds/${parts[2]}/themes/${parts[4]}/questions/${parts[6]}`, name: `Вопрос за ${parts[6]}` }
    }

    const paths = {
      default: [crumbs.dashboard, crumbs.currentPack],
      [settings]: [crumbs.dashboard, crumbs.currentPack, crumbs.settings],
      [rounds]: [crumbs.dashboard, crumbs.currentPack, crumbs.rounds],
      [question]: [crumbs.dashboard, crumbs.currentPack, crumbs.rounds, crumbs.theme, crumbs.questions],
    }

    for(let [pathRegex, path] of Object.entries(paths)){
      if(new RegExp(`^${pathRegex}/?$`).test(page)){
        return setPath(path)
      }
    }
    return setPath(paths.default)
  }, [route, props.pack])

  return (
    <Breadcrumbs>
      {path.map(({ to, name }, i) => {
        if(to && i !== path.length-1) {
          return <Link to={to} className={linkStyles} key={i}>
            {name}
          </Link>
        } else {
          return <Typography color={i === path.length-1 ? 'text.primary' : 'text.secondary'} key={i}>{name}</Typography>
        }
      })}
    </Breadcrumbs>
  )
}

export default connect(mapPackState)(PackBreadcrumbs)
