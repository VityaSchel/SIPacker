import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import IconButton from '@mui/material/IconButton'
import { MdEdit, MdDone } from 'react-icons/md'
import Typography from '@mui/material/Typography'

EditingToolbar.propTypes = {
  showButton: PropTypes.boolean,
  editing: PropTypes.boolean,
  onSwitch: PropTypes.func,
  heading: PropTypes.string
}
export default function EditingToolbar(props) {
  return (
    <div className={styles.toolbar}>
      <h2 className={styles.text}>{props.heading}</h2>
      {props.showButton && props.editing && <>
        <Typography color='text.secondary' className={styles.hint}>
          Все изменения сохраняются автоматически
        </Typography>
      </>}
      {props.showButton && <IconButton onClick={props.onSwitch}>{props.editing ? <MdDone /> : <MdEdit />}</IconButton>}
    </div>
  )
}
