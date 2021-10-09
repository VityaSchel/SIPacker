import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'
import ButtonBase from '@mui/material/ButtonBase'

RoundTable.propTypes = { themes: PropTypes.array }
export default function RoundTable(props) {
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
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>{row.name}</TableCell>
              {
                row.questions.length
                  ? row.questions.map((question, j) =>
                    <TableCell key={j} className={styles.tableCell}>
                      <ButtonBase className={styles.buttonBase}>
                        {question.cost}
                      </ButtonBase>
                    </TableCell>)
                  : <TableCell align='right'>
                    <span className={styles.noItemsYet}>Еще нет вопросов</span>
                  </TableCell>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
