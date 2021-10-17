import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import { darkTheme } from '../../../../App'
import { Link } from 'react-router-dom'
import { MdDelete } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Item from 'components/ItemsList/Item'
import DeleteConfirmationDialog from 'components/ConfirmationDialog/DeleteConfirmationDialog'
import Typography from '@mui/material/Typography'
import Handle from 'components/ItemsList/Handle'
import { ContextMenuActions } from 'components/ContextMenu'

Round.propTypes = ItemContent.propTypes = {
  draggableId: PropTypes.string,
  item: PropTypes.object,
  pack: PropTypes.object,
  index: PropTypes.number,
  editing: PropTypes.bool,
  setEditing: PropTypes.func,
  handleRemoveRound: PropTypes.func,
  roundNamesTextInput: PropTypes.arrayOf(PropTypes.string),
  handleRoundNameChange: PropTypes.func
}

export default function Round(props) {
  const confirmationDialogRef = React.useRef()
  const contextMenuActions = React.useContext(ContextMenuActions)

  const handleRemoveRound = async () => {
    if(!await confirmationDialogRef.current.confirmRoundDeletion()) return
    props.handleRemoveRound(props.index)
  }

  const handleOpenMenu = e => {
    contextMenuActions.open(e, [
      { name: 'Удалить', icon: <MdDelete />, action: () => handleRemoveRound() }
    ])
  }

  return (
    <Item {...props} className={styles.cardOfRound}>
      {(provided) => <>
        {!props.editing
          ? <Link
            to={`/pack/${props.pack.uuid}/rounds/${props.index+1}`}
            className={styles.link}
            onContextMenu={handleOpenMenu}
          >
            <CardActionArea>
              <ItemContent {...props} />
            </CardActionArea>
          </Link>
          : <div className={styles.item}>
            <Handle provided={provided} />
            <ItemContent {...props} />
            <Toolbar handleRemoveRound={handleRemoveRound} />
          </div>
        }
        <DeleteConfirmationDialog ref={confirmationDialogRef} />
      </>}
    </Item>
  )
}

function ItemContent(props) {
  const round = props.item

  return (
    <CardContent style={{ paddingBottom: darkTheme.spacing(2) }} className={styles.flex1}>
      {
        props.editing
          ? <TextField
            value={props.roundNamesTextInput[props.index]}
            label='Название раунда'
            variant='outlined'
            onChange={e => props.handleRoundNameChange(e, props.index)}
            size='small'
            className={styles.inputField}
          />
          : <Typography variant='body2' color='text.secondary' className={styles.flex2}>
            Раунд {props.index+1}. {round.name}
          </Typography>
      }
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
