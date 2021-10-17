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
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import { connect } from 'react-redux'
import { mapPackState, questionTypes } from '../../../utils'
import Typography from '@mui/material/Typography'


ItemContent.propTypes = {
  themeIndex: PropTypes.number,
  theme: PropTypes.object,
  pack: PropTypes.object
}

function ItemContent(props) {
  const history = useHistory()
  const route = useRouteMatch()

  const sortedQuestions = props.theme.questions.sort((a,b) => a.price - b.price)

  const questionType = type => questionTypes[type] || type

  const questionURL = `${route.url}/themes/${props.themeIndex+1}/questions`
  const handleOpenQuestion = price => () => history.push(`${questionURL}/${price}`)
  const row = { sx: { '&:last-child td, &:last-child th': { border: 0 } } }
  const cell1 = { component: 'th', scope: 'row' }

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Цена</TableCell>
              <Cell wp={10}>Текст</Cell>
              <Cell wp={9}>Ответы</Cell>
              <Cell wp={4}>Вид вопроса</Cell>
              <Cell wp={1}><MdImage /></Cell>
              <Cell wp={1}><MdMusicNote /></Cell>
              <Cell wp={1}><MdVideocam /></Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedQuestions.length
              ? sortedQuestions.map((question, i) => (
                <TableRow
                  key={i}
                  hover
                  onClick={handleOpenQuestion(question.price)}
                  className={styles.tableRow}
                  {...row}
                >
                  <TableCell {...cell1}>{question.price}</TableCell>
                  <Cell wp={10}>
                    {question.scenario.filter(({ type }) => type === 'text').map(({ data }) => data.text).join(', ')}
                  </Cell>
                  <Cell wp={10}>
                    {question.correctAnswers?.map((answer, i, a) =>
                      <span key={i}>{answer}{i !== a.length - 1 && ', '}</span>)}
                    {question.incorrectAnswers?.length && ', '}
                    {question.incorrectAnswers?.map((answer, i, a) => <>
                      <span className={styles.strikethrough} key={i}>{answer}</span>
                      {i !== a.length - 1 && ', '}
                    </>)}
                  </Cell>
                  <Cell wp={3}>{questionType(question.type)}</Cell>
                  <Cell wp={1}>{question.scenario.some(({ type }) => type === 'image') && <MdDone />}</Cell>
                  <Cell wp={1}>{question.scenario.some(({ type }) => type === 'audio') && <MdDone />}</Cell>
                  <Cell wp={1}>{question.scenario.some(({ type }) => type === 'movie') && <MdDone />}</Cell>
                </TableRow>
              ))
              : <TableRow {...row}>
                <TableCell {...cell1} colSpan={7}>
                  <Typography color='text.secondary' variant='caption'>Еще нет вопросов</Typography>
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
      <Link to={`${questionURL}/add`}>
        <Button
          color='primary'
          startIcon={<MdAdd />}
        >Создать вопрос</Button>
      </Link>
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
