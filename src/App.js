import {
  BrowserRouter as Router,
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

const darkTheme = createTheme({
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
        <Router>
          <Container>
            <Navigation />
            <Switch>
              <Route path='/create'>
                <NewPack />
              </Route>
              <Route path='/pack/:packUUID'>
                <Pack />
              </Route>
              <Route path='/'>
                <Dashboard />
              </Route>
            </Switch>
          </Container>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}
