import {
  Router,
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

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4248fb'
    }
  },
})

export default function App() {
  return (
    <Provider store={sipackerStore}>
      <ThemeProvider theme={darkTheme}>
        <Router history={history}>
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
        </Router>
      </ThemeProvider>
    </Provider>
  )
}
