import React from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { loadLocalPack } from '../../localStorage/localPacks'

Container.propTypes = {
  children: PropTypes.node
}
function Container(props) {
  // const route = useLocation()

  // React.useEffect(() => {
  //   routeChanged(route.split('/').filter(String))
  // }, [route])

  // const routeChanged = pathParts => {
  //   if(pathParts[0] === 'pack') {
  //     const packUUID = pathParts[1]
  //     props.dispatch({ type: 'pack/load', pack: loadLocalPack(packUUID) })
  //   }
  // }

  return (
    <div className={styles.container}>
      {props.children}
    </div>
  )
}

export default connect(null)(Container)
