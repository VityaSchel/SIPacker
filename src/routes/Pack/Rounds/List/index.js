import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { useParams } from 'react-router-dom'
import Round from './Round'
import { MdEdit, MdAdd, MdCancel, MdDone, MdSave } from 'react-icons/md'
import cx from 'classnames'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export default function RoundsList() {
  const [rounds, setRounds] = React.useState([{ name: 'Привет, мир!' },{ name: 'Пока, мир!' }])
  const [editing, setEditing] = React.useState(false)
  const [addingRound, setAddingRound] = React.useState(false)
  const pack = useParams()

  const handleAddRound = name => setRounds(rounds.concat({ name }))
  const handleRemoveRound = index => setRounds(rounds.filter((_, i) => i !== index))

  const onDragEnd = result => {
    if (!result.destination) return
    const items = reorder(rounds, result.source.index, result.destination.index)
    setRounds(items)
  }

  const handleSwitchEditing = () => {
    setEditing(!editing)
  }

  return (
    <div className={styles.rounds}>
      <div className={styles.heading}>
        <Typography variant='h6' className={styles.text}>Раунды:</Typography>
        <IconButton onClick={handleSwitchEditing}>{ editing ? <MdSave /> : <MdEdit /> }</IconButton>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='rounds'>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {rounds.length
                ? rounds.map((round, i) =>
                  <Round
                    key={i.toString()}
                    round={round}
                    pack={pack}
                    index={i}
                    draggableId={i.toString()}
                    editing={editing}
                    handleRemoveRound={handleRemoveRound}
                  />)
                : <Typography
                  variant='body1'
                  gutterBottom
                  className={styles.noRounds}
                >Еще нет раундов</Typography>
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={styles.addRound}>
        <RoundName
          setAddingRound={setAddingRound}
          handleAddRound={handleAddRound}
          className={cx(styles.button, { [styles.expand]: addingRound })}
        />
        <div className={cx([styles.button, styles.addButtonOuter], { [styles.expand]: !addingRound })}>
          <Button
            variant='contained'
            startIcon={<MdAdd />}
            onClick={() => setAddingRound(true)}
            className={styles.addButton}
          >Добавить раунд</Button>
        </div>
      </div>
    </div>
  )
}

RoundName.propTypes = {
  setAddingRound: PropTypes.func,
  handleAddRound: PropTypes.func,
  className: PropTypes.string
}
function RoundName(props) {
  const [value, setValue] = React.useState('')

  const handleDone = () => {
    props.setAddingRound(false)
    if(value.length) {
      props.handleAddRound(value)
      setValue('')
    }
  }

  return (
    <FormControl variant='outlined' className={props.className}>
      <InputLabel size="small">Название раунда</InputLabel>
      <OutlinedInput
        label='Название раунда'
        size='small'
        type='text'
        value={value}
        onChange={e => setValue(e.target.value)}
        style={{ paddingRight: 0 }}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={handleDone}>
              {!value.length ? <MdCancel /> : <MdDone />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
