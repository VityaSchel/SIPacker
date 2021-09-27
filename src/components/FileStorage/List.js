import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'

export default function List() {
  return (
    <div className={styles.list}>
      <div className={styles.content}>
        {new Array(20).fill().map((_,i) => <div key={i}>
          <div className={styles.packDivider}>название пака</div>
          <Grid container spacing={2} className={styles.grid}>
            {
              new Array(20).fill().map((_,i) =>
                <Grid
                  key={i}
                  item
                  xs={4}
                  md={6}
                  sm={12}
                  className={styles.item}
                >
                placeholder
                </Grid>)
            }
          </Grid>
        </div>
        )}
      </div>
    </div>
  )
}
