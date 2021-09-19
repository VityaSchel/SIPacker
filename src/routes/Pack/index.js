import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import PackBreadcrumbs from './PackBreadcrumbs'
import Main from './Main'
import Settings from './Settings/'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { MdSettings } from 'react-icons/md'

_PackPageContainer.propTypes = {
  children: PropTypes.node,
  pack: PropTypes.shape(componentsPropTypes.pack),
  toolbar: PropTypes.string
}

function _PackPageContainer(props) {
  const buttons = props.pack && {
    main: <>
      <Link to={`${props.pack.uuid}/settings`}>
        <IconButton>
          <MdSettings />
        </IconButton>
      </Link>
    </>
  }

  return (
    props.pack &&
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <PackBreadcrumbs />
        <div className={styles.buttons}>
          {buttons[props.toolbar]}
        </div>
      </div>
      {props.children}
    </div>
  )
}

export const PackPageContainer = connect(state => ({ pack: state.pack }))(_PackPageContainer)

export function PackPageMain() {
  return (<PackPageContainer toolbar='main'><Main /></PackPageContainer>)
}

export function PackPageSettings() {
  return (<PackPageContainer><Settings /></PackPageContainer>)
}
