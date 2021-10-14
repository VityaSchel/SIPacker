import React from 'react'
import styles from './styles.module.scss'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { ImGithub } from 'react-icons/im'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

export default function Navigation() {
  const [infoShown, setInfoShown] = React.useState(false)

  return (
    <AppBar position='static' style={{ zIndex: 4 }}>
      <Toolbar color='primary'>
        <div className={styles.logoContainer}>
          <Link to='/' className={styles.logo}>
            <Typography variant='h6' component='div'>
              SIPacker
            </Typography>
          </Link>
        </div>
        <div>
          <a href='https://github.com/VityaSchel/SIPacker' target='_blank' rel='noreferrer'>
            <IconButton>
              <ImGithub />
            </IconButton>
          </a>
          <IconButton onClick={() => setInfoShown(true)}>
            <AiOutlineInfoCircle />
          </IconButton>
        </div>
        <Dialog
          open={infoShown}
          onClose={() => setInfoShown(false)}
        >
          <DialogTitle>
            Автор приложения
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p>Веб-приложение создано VityaSchel в 2021 году для игры SiGame как кроссплатформенная замена SIQuester.</p>
              <p>Все свои идеи и предложения излагайте в пул-реквестах или хотя бы во вкладке Issues, а не в моих лс.</p>
              <p>
                <a
                  href='https://github.com/VladimirKhil/SI/wiki/%D0%A1%D0%BF%D0%B5%D1%86%D0%B8%D1%84%D0%B8%D0%BA%D0%B0%D1%86%D0%B8%D1%8F-%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%D0%B0-.siq'
                  className='onHover'
                >
                  Спецификация формата .siq
                </a>
              </p>
              <p>
                Большая благодарность Владимиру Хилю за то, что не игнорил мои вопросы во время разработки этого сайта
                (привет разработчикам мафии онлайн и мафии го)
              </p>
              <p>
                Также хочу пожелать удачи и легкой
                службы <a
                  href='https://vk.com/id245297843'
                  target='_blank'
                  rel="noreferrer"
                  className='onHover'
                >Роме Кучину</a>, который своим комментарием натолкнул меня на идею создания этого сайта, но не может
                работать со мной по причине Я в армии.
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInfoShown(false)}>ОК</Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  )
}
