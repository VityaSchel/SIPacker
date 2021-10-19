import styles from './styles.module.scss'
import WithHint from './WithHint'
import Typography from '@mui/material/Typography'
import { scenarioHint } from './hints'

export default function NoScenario() {
  return (
    <div className={styles.scenario}>
      <WithHint hint={scenarioHint}>
        <Typography variant='h6'>Сценарий</Typography>
      </WithHint>
      <Typography variant='body2' color='text.secondary'>
        Вы сможете редактировать сценарий после того, как добавите вопрос
      </Typography>
    </div>
  )
}
