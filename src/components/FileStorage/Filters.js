import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { MdFilterList } from 'react-icons/md'
import Stack from '@mui/material/Stack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

Filters.propTypes = {
  packs: PropTypes.arrayOf(PropTypes.string),
}

export default function Filters(props) {
  return (
    <Stack spacing={2} className={styles.filters}>
      <div className={styles.text}>
        <MdFilterList />
        <Typography variant='overline' color='text.secondary'>
          Фильтры
        </Typography>
      </div>
      {props.packs.map((pack, i) =>
        <FormControlLabel control={<Checkbox defaultChecked />} label={pack.name} key={i} />
      )}
    </Stack>
  )
}
