import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import styles from './styles.module.scss'
import { connect } from 'react-redux'

function PackBreadcrumbs(props) {
  const linkStyles = [styles.link, 'onHover', 'noDefaults'].join(' ')
  // const pack = useSelector(packReducer)
  console.log(props);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link
        className={linkStyles}
        to='/'
      >
        Паки
      </Link>
      <Typography color="text.primary">{props.pack?.name}</Typography>
    </Breadcrumbs>
  )
}

export default connect(state => ({ pack: state.pack }))(PackBreadcrumbs)
