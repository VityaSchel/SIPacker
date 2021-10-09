import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { darkTheme } from '../../../../App'
import { Link } from 'react-router-dom'
import { MdDragHandle, MdDelete } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Item from 'components/ItemsList/Item'

Round.propTypes = ItemContent.propTypes = {
  draggableId: PropTypes.string,
  item: PropTypes.object,
  pack: PropTypes.object,
  index: PropTypes.number,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  handleRemoveRound: PropTypes.func,
  roundNamesTextInput: PropTypes.string,
  handleRoundNameChange: PropTypes.func
}

export default function Round(props) {
  return (
    <Item {...props} className={styles.cardOfRound}>
      {(provided) => !props.editing
        ? <Link to={`/pack/${props.pack.uuid}/rounds/${props.index+1}`} className={styles.link}>
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

function ItemContent(props) {
  const round = props.item

  return (
    <CardContent style={{ paddingBottom: darkTheme.spacing(2) }} className={styles.flex1}>
      <Typography variant='body2' color='text.secondary' className={styles.flex2}>
        <span>Раунд {props.index+1}.</span> {
          props.editing
            ? <TextField
              value={props.roundNamesTextInput[props.index]}
              label='Название раунда'
              variant='outlined'
              onChange={e => props.handleRoundNameChange(e, props.index)}
              size='small'
              className={styles.inputField}
            />
            : round.name
        }
      </Typography>
    </CardContent>
  )
}

Toolbar.propTypes = { handleRemoveRound: PropTypes.func }
function Toolbar(props) {
  return (
    <IconButton onClick={props.handleRemoveRound} className={styles.delete}>
      <MdDelete />
    </IconButton>
  )
}
