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
              <MdDelete />
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
    <Typography>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      malesuada lacus ex, sit amet blandit leo lobortis eget.
    </Typography>
  )
}


export default connect(state => ({ pack: state.pack }))(Theme)
