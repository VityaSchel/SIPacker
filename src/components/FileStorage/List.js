import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Grid from '@mui/material/Grid'
import { getRecent } from 'localStorage/fileStorage.js'

List.propTypes = {
  packs: PropTypes.array
}

export default function List(props) {
  const [files, setFiles] = React.useState([])

  React.useEffect(() => {
    getRecent(props.packs.map(pack => pack.uuid)).then(setFiles)
  }, [])

  console.log(files);

  return (
    <div className={styles.list}>
      <div className={styles.content}>
        {
          // props.packs.map((pack, i) => <div key={i}>
        //   <div className={styles.packDivider}>Пак <b>{pack.name}</b></div>
        //   <Grid container spacing={2} className={styles.grid}>
        //     <Grid
        //       key={i}
        //       item
        //       xs={4}
        //       md={6}
        //       sm={12}
        //       className={styles.item}
        //     >
        //       {}
        //     </Grid>
        //   </Grid>
        // </div>
        // )
      }
      </div>
    </div>
  )
}
