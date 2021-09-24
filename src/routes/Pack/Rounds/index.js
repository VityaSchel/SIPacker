import React from 'react'
import styles from './styles.module.scss'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { darkTheme } from '../../../App'
import { Link, useParams } from 'react-router-dom'
import { MdEdit, MdAdd } from 'react-icons/md'

export default function Rounds() {
  const [rounds, setRounds] = React.useState([{ name: 'Привет, мир!' },{ name: 'Пока, мир!' }])
  const pack = useParams()

  return (
    <div className={styles.rounds}>
      <div className={styles.heading}>
        <Typography variant='h6' className={styles.text}>Раунды:</Typography>
        <IconButton><MdEdit /></IconButton>
      </div>
      {rounds.map((round, i) =>
        <Card className={styles.cardOfRound} key={i}>
          <Link to={`/pack/${pack.packUUID}/rounds/${i+1}`}>
            <CardActionArea>
              <CardContent style={{ paddingBottom: darkTheme.spacing(2) }}>
                <Typography variant='body2' color='text.secondary'>
                  Раунд {i+1}. {round.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      )}
      <Button variant='contained' startIcon={<MdAdd />}>Добавить раунд</Button>
    </div>
  )
}
