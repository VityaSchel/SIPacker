import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { darkTheme } from '../../../../App'
import { Link } from 'react-router-dom'
import { Draggable } from 'react-beautiful-dnd'
import { MdDragHandle, MdDelete } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'

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

Round.propTypes = ItemContent.propTypes = {
  draggableId: PropTypes.string,
  round: PropTypes.object,
  index: PropTypes.number,
  pack: PropTypes.object,
  editing: PropTypes.bool,
  handleRemoveRound: PropTypes.func
}

export default function Round(props) {
  return (
    <Draggable
      draggableId={props.draggableId}
      index={props.index}
    >
      {provided =>
        <Card
          className={styles.cardOfRound}
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={getStyle(provided.draggableProps.style)}
        >
          {!props.editing
            ? <Link to={`/pack/${props.pack.packUUID}/rounds/${props.index+1}`} className={styles.link}>
              <CardActionArea>
                <ItemContent {...props} />
              </CardActionArea>
            </Link>
            : <div className={styles.item}>
              <Handle provided={provided} />
              <ItemContent {...props} />
              <Toolbar handleRemoveRound={() => props.handleRemoveRound(props.index)} />
            </div>
          }
        </Card>
      }
    </Draggable>
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

function ItemContent(props) {
  return (
    <CardContent style={{ paddingBottom: darkTheme.spacing(2) }} className={styles.flex1}>
      <Typography variant='body2' color='text.secondary'>
        Раунд {props.index+1}. {props.round.name}
      </Typography>
    </CardContent>
  )
}

Toolbar.propTypes = { handleRemoveRound: PropTypes.func }
function Toolbar(props) {
  return (
    <IconButton onClick={props.handleRemoveRound}>
      <MdDelete />
    </IconButton>
  )
}
