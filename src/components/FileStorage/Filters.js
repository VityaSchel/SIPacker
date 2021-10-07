import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { MdFilterList } from 'react-icons/md'
import Stack from '@mui/material/Stack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

Filters.propTypes = {
  packs: PropTypes.arrayOf(PropTypes.string),
  checkboxes: PropTypes.arrayOf(PropTypes.bool),
  onChange: PropTypes.func
}

export default function Filters(props) {
  const handleChange = (e, i) => {
    const checkboxes = [...props.checkboxes]
    checkboxes[i] = { ...checkboxes[i], checked: e.target.checked }
    props.onChange(checkboxes)
  }

  return (
    <Stack className={styles.filters}>
      <div className={styles.text}>
        <MdFilterList />
        <Typography variant='overline' color='text.secondary'>
          Фильтры
        </Typography>
      </div>
      {props.packs.map((pack, i) =>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(props.checkboxes[i]?.checked)}
              onChange={e => handleChange(e, i)}
            />
          }
          className={styles.checkbox}
          label={pack.name}
          key={i}
        />
      )}
    </Stack>
  )
}
