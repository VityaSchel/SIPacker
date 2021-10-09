import PropTypes from 'prop-types'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Typography from '@mui/material/Typography'
import listStyles from './styles.module.scss'

ItemsList.propTypes = {
  droppableId: PropTypes.string,
  droppableClassName: PropTypes.string,
  draggableProps: PropTypes.object,
  list: PropTypes.array,
  itemComponent: PropTypes.func,
  useIdAsKey: PropTypes.bool,
  noItemsLabel: PropTypes.string,
  onDragEnd: PropTypes.func
}

export default function ItemsList(props) {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <Droppable droppableId='themes'>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.list.length
              ? props.list.map((item, i) => <props.itemComponent
                key={props.useIdAsKey ? item.id : i}
                index={i}
                draggableId={props.useIdAsKey ? item.id : i}
                item={item}
                {...props.draggableProps}
              />)
              : <Typography
                variant='body1'
                gutterBottom
                className={listStyles.noItems}
              >{props.noItemsLabel}</Typography>
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
