import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import PackBreadcrumbs from './PackBreadcrumbs/'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'
import PackToolbar from './PackToolbar/'
import Rounds from './Rounds'
import Settings from './Settings/'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import RoundThemes from './RoundThemes'
import NotFound404 from 'components/NotFound404'
import Question from './Question'
import { mapPackState } from 'utils'

PackPageContainer.propTypes = {
  children: PropTypes.node,
  pack: componentsPropTypes.pack,
  toolbar: PropTypes.string
}

export const questionPath = '/rounds/:roundIndex/themes/:themeIndex/questions/:questionPrice'

function PackPageContainer(props) {
  const { path } = useRouteMatch()

  return (
    props.pack
    && (props.pack === 'notFound'
      ? <NotFound404 />
      : <div className={styles.container}>
        <div className={styles.toolbar}>
          <PackBreadcrumbs />
          <PackToolbar />
        </div>
        <Switch>
          <Route exact path={path}>
            <Rounds />
          </Route>
          <Route path={`${path}/settings`}>
            <Settings />
          </Route>
          <Route path={`${path}${questionPath}`}>
            <Question />
          </Route>
          <Route path={`${path}/rounds/:roundIndex`}>
            <RoundThemes />
          </Route>
          <Route path='*'><NotFound404 /></Route>
        </Switch>
      </div>)
  )
}

export default connect(mapPackState)(PackPageContainer)
