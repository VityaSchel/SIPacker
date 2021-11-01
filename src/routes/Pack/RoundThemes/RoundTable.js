import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'
import ButtonBase from '@mui/material/ButtonBase'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'

RoundTable.propTypes = { themes: PropTypes.array }
export default function RoundTable(props) {
  const { url } = useRouteMatch()

  return (
    <TableContainer
      component={Paper}
      className={styles.table}
    >
      <Table>
        <TableBody>
          {props.themes.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}
            >
              <TableCell component='th' scope='row' className={styles.rowName}>{row.name}</TableCell>
              {
                row.questions.length
                  ? row.questions.map((question, j) =>
                    <TableCell key={j} className={styles.tableCell}>
                      <Link to={`${url}/themes/${i+1}/questions/${question.price}`}>
                        <ButtonBase className={styles.buttonBase}>
                          {question.price}
                        </ButtonBase>
                      </Link>
                    </TableCell>)
                  : <TableCell align='right' colspan='1000'>
                    <Typography color='text.secondary' variant='caption'>Еще нет вопросов</Typography>
                  </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
