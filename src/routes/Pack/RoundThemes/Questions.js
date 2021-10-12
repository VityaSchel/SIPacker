import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { MdImage, MdDone, MdMusicNote, MdVideocam, MdAdd } from 'react-icons/md'
import { useHistory, useRouteMatch } from 'react-router'
import Button from '@mui/material/Button'
import { connect } from 'react-redux'
import { mapPackState } from '../../../utils'


ItemContent.propTypes = {
  themeIndex: PropTypes.number,
  theme: PropTypes.object,
  pack: PropTypes.object
}

function ItemContent(props) {
  const history = useHistory()
  const route = useRouteMatch()

  const sortedQuestions = props.theme.questions.sort((a,b) => a.price - b.price)

  const questionType = type => {
    return {
      'simple': 'Обычный',
      'auction': 'Аукцион',
      'cat': 'С секретом',
      'bagcat': 'Кот в мешке',
      'sponsored': 'Без риска'
    }[type] || type
  }

  const handleOpenQuestion = price => () => {
    history.push(`${route.url}/themes/${props.themeIndex+1}/questions/${price}`)
  }

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Цена</TableCell>
              <Cell wp={10}>Текст</Cell>
              <Cell wp={9}>Ответ</Cell>
              <Cell wp={4}>Вид вопроса</Cell>
              <Cell wp={1}><MdImage /></Cell>
              <Cell wp={1}><MdMusicNote /></Cell>
              <Cell wp={1}><MdVideocam /></Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedQuestions.map((question, i) => (
              <TableRow
                key={i}
                className={styles.tableRow}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
                onClick={handleOpenQuestion(question.price)}
              >
                <TableCell component='th' scope='row'>{question.price}</TableCell>
                <Cell wp={10}>{question.text}</Cell>
                <Cell wp={10}>{question.answer}</Cell>
                <Cell wp={3}>{questionType(question.type)}</Cell>
                <Cell wp={1}>{question.image && <MdDone />}</Cell>
                <Cell wp={1}>{question.audio && <MdDone />}</Cell>
                <Cell wp={1}>{question.movie && <MdDone />}</Cell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        color='primary'
        startIcon={<MdAdd />}
      >Создать вопрос</Button>
    </>
  )
}

Cell.propTypes = { wp: PropTypes.number, children: PropTypes.node }
function Cell(props) {
  return (
    <TableCell align='right' style={{ width: props.wp/26*100+'%' }}>{props.children}</TableCell>
  )
}

export default connect(mapPackState)(ItemContent)