import PropTypes from 'prop-types'
import Item from 'components/ItemsList/Item'
import { connect } from 'react-redux'
import Typography from '@mui/material/Typography'
import { MdDragHandle, MdDelete, MdExpandMore } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import styles from './styles.module.scss'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Paper from '@mui/material/Paper'

import ButtonBase from '@mui/material/ButtonBase'

Theme.propTypes = {
  theme: PropTypes.object,
  pack: PropTypes.object,
  i: PropTypes.number,
  expand: PropTypes.bool,
  setExpand: PropTypes.func
}

function Theme(props) {
  const handleDelete = e => {
    e.stopPropagation()
  }

  return (
    <Item
      index={props.i}
      draggableId={props.theme.id.toString()}
    >
      {(provided) => <Accordion
        expanded={props.expand}
        onChange={(_, isExpand) => props.setExpand(isExpand ? props.theme.id : undefined)}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
        >
          <div className={styles.toolbar}>
            <Handle provided={provided} />
            <Typography className={styles.name} variant='body2' color='text.secondary'>
              {props.theme.name}
            </Typography>
            <IconButton
              onClick={handleDelete}
              className={styles.delete}
            >
              <MdDelete className={styles.delete} />
            </IconButton>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ItemContent {...props} />
        </AccordionDetails>
      </Accordion>}
    </Item>
  )
}

Handle.propTypes = { provided: PropTypes.object }
function Handle(props) {
  return (
    <div
      className={styles.handle}
      {...props.provided.dragHandleProps}
    >
      <MdDragHandle />
    </div>
  )
}

ItemContent.propTypes = {
  theme: PropTypes.object
}
function ItemContent(props) {
  const rows = [
    { name: 'Название темы', questions: [
      { cost: 100 }, { cost: 200 }, { cost: 300 }, { cost: 400 }
    ] },
    { name: 'Тема 2', questions: [
      { cost: 200 }, { cost: 400 }, { cost: 600 }, { cost: 800 }
    ] },
    { name: 'Тема 3', questions: [
      { cost: 300 }, { cost: 600 }, { cost: 900 }, { cost: 1200 }
    ] }
  ]

  return (
    <TableContainer
      component={Paper}
      className={styles.table}
    >
      <Table>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component='th' scope='row'>{row.name}</TableCell>
              {row.questions.map((question, j) =>
                <TableCell key={j} className={styles.tableCell}>
                  <ButtonBase className={styles.buttonBase}>
                    {question.cost}
                  </ButtonBase>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


export default connect(state => ({ pack: state.pack }))(Theme)
