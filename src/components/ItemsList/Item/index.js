import PropTypes from 'prop-types'
import { Draggable } from 'react-beautiful-dnd'
import Card from '@mui/material/Card'
import styles from './styles.module.scss'

function getStyle(style) {
  if (style.transform) {
    const axisLockY =
      'translate(0px' +
      style.transform.slice(
        style.transform.indexOf(','),
        style.transform.length
      )
    return {
      ...style,
      transform: axisLockY
    }
  }
  return style
}

Item.propTypes = {
  index: PropTypes.number,
  draggableId: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  tag: PropTypes.string,
}

export default function Item(props) {
  return (
    <Draggable
      draggableId={props.draggableId}
      index={props.index}
    >
      {provided =>
        <Card
          className={[props.className, styles.item]}
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={getStyle(provided.draggableProps.style)}
        >
          {props.children(provided)}
        </Card>
      }
    </Draggable>
  )
}
