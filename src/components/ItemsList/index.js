import React from 'react'
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
  const [itemsMap, setItemsMap] = React.useState({ map: new WeakMap(), length: 0 })

  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <Droppable droppableId={props.droppableId}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={props.droppableClassName}
          >
            {(() => {
              const children = props.list.length
                ? props.list.map((item, i) => {
                  const oid = object => {
                    if(!itemsMap.map.has(object)) itemsMap.map.set(object, ++itemsMap.length)
                    return itemsMap.map.get(object)
                  }

                  return (
                    <props.itemComponent
                      key={props.useIdAsKey ? item.id : oid(item)}
                      index={i}
                      draggableId={props.useIdAsKey ? item.id : oid(item)}
                      item={item}
                      {...props.draggableProps}
                    />
                  )
                })
                : <Typography
                  variant='body1'
                  gutterBottom
                  className={listStyles.noItems}
                >{props.noItemsLabel}</Typography>
              setItemsMap(itemsMap)
              return children
            })()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
