import styles from './styles.module.scss'
import RoundsList from './List/'
import CheckList from './CheckList/'

export default function Rounds() {
  return (
    <div className={styles.roundsPage}>
      <RoundsList />
      <CheckList />
    </div>
  )
}
