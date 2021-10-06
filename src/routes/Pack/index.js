import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import PackBreadcrumbs from './PackBreadcrumbs'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'
import PackToolbar from './PackToolbar/'
import Rounds from './Rounds'
import Settings from './Settings/'
import {
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import RoundThemes from './RoundThemes'

PackPageContainer.propTypes = {
  children: PropTypes.node,
  pack: PropTypes.shape(componentsPropTypes.pack),
  toolbar: PropTypes.string
}

function PackPageContainer(props) {
  const { path } = useRouteMatch()

  return (
    props.pack &&
    <div className={styles.container}>
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
        <Route path={`${path}/rounds/:roundIndex`}>
          <RoundThemes />
        </Route>
      </Switch>
    </div>
  )
}

export default connect(state => ({ pack: state.pack }))(PackPageContainer)
