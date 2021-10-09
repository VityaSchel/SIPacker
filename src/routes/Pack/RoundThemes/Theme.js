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
  theme: PropTypes.object,
  pack: PropTypes.object,
  index: PropTypes.number,
  expand: PropTypes.bool,
  setExpand: PropTypes.func,
  draggableId: PropTypes.string,
}

function Theme(props) {
  const handleDelete = e => {
    e.stopPropagation()
    // props.
  }

  return (
    <Item
      index={props.index}
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
  return (
    <span>1</span>
  )
}


export default connect(state => ({ pack: state.pack }))(Theme)
