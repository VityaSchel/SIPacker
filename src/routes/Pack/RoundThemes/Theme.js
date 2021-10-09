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

Theme.propTypes = {
  item: PropTypes.object,
  pack: PropTypes.object,
  index: PropTypes.number,
  expandId: PropTypes.number,
  setExpand: PropTypes.func,
  draggableId: PropTypes.string,
  handleRemoveTheme: PropTypes.func,
}

function Theme(props) {
  const handleDelete = e => {
    e.stopPropagation()
    props.handleRemoveTheme(props.index)
  }

  const theme = props.item
  const expand = props.draggableId === props.expandId

  return (
    <Item
      index={props.index}
      draggableId={theme.id.toString()}
    >
      {(provided) => <Accordion
        expanded={expand}
        onChange={(_, isExpand) => props.setExpand(isExpand ? theme.id : undefined)}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
        >
          <div className={styles.toolbar}>
            <Handle provided={provided} />
            <Typography className={styles.name} variant='body2' color='text.secondary'>
              {theme.name}
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
  return (
    <span>1</span>
  )
}


export default connect(state => ({ pack: state.pack }))(Theme)
