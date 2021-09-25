import styles from './styles.module.scss'
import RoundsList from './List/'

export default function Rounds() {
  return (
    <div className={styles.roundsPage}>
      <RoundsList />
    </div>
  )
}
