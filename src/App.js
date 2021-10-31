import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'
import Dashboard from './routes/Dashboard'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Navigation from './components/Navigation/index.js'
import NewPack from './routes/NewPack'
import Pack from './routes/Pack'
import sipackerStore from './reducers'
import { Provider } from 'react-redux'
import Container from './components/Container'
import 'dayjs/locale/ru'
import { history } from './utils'
import NotFound404 from 'components/NotFound404'
import ContextMenuProvider from 'components/ContextMenu'
import { Helmet } from 'react-helmet'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4248fb'
    }
  },
})

function Head() {
  return (
    <Helmet>
      <meta charSet='utf-8' />
      <link rel='icon' href={`${window.location.origin}${process.env.PUBLIC_URL}/favicon.ico`} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#03053e' />
      <meta name='description' content='Простой и мощный онлайн-редактор паков к SIGame для всех платформ, работающий без сети и поддерживающий все типы вопросов, события сценария и паков' />
      <link rel='apple-touch-icon' href={`${window.location.origin}${process.env.PUBLIC_URL}/logo192.png`} />
      <link rel='manifest' href={`${window.location.origin}${process.env.PUBLIC_URL}/manifest.json`} />
      <meta property='og:type' content='website' />
      <meta property='og:image' content={`${window.location.origin}${process.env.PUBLIC_URL}/logo512.png`} />
      <title>SIPacker</title>
    </Helmet>
  )
}

export default function App() {
  return (
    <Provider store={sipackerStore}>
      <Head />
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter history={history} basename={process.env.PUBLIC_URL}>
          <ContextMenuProvider>
            <Container>
              <Navigation />
              <Switch>
                <Route exact path='/'>
                  <Dashboard />
                </Route>
                <Route path='/create'>
                  <NewPack />
                </Route>
                <Route path={['/pack/:packUUID', '/pack/:packUUID/*']}>
                  <Pack />
                </Route>
                <Route path='*'><NotFound404 /></Route>
              </Switch>
            </Container>
          </ContextMenuProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
