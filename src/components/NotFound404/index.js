import Typography from '@mui/material/Typography'
import styles from './styles.module.scss'

export default function NotFound404() {
  return (
    <div className={styles.centered}>
      <Typography variant='h1'>Страница не найдена</Typography>
    </div>
  )
}
