import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { GrCircleQuestion } from 'react-icons/gr'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'

WithHint.propTypes = { hint: PropTypes.node, children: PropTypes.node }
export default function WithHint(props) {
  return (
    <div className={styles.hint}>
      {props.children}
      <Tooltip title={props.hint}>
        <IconButton>
          <GrCircleQuestion />
        </IconButton>
      </Tooltip>
    </div>
  )
}
