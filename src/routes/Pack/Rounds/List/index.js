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
import { connect } from 'react-redux'
import { saveLocalPack } from 'localStorage/localPacks'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export default connect(state => ({ pack: state.pack }))(function RoundsList(props) {
  const [rounds, setRounds] = React.useState(props.pack.rounds)
  const [editing, setEditing] = React.useState(false)
  const [addingRound, setAddingRound] = React.useState(false)
  const [names, setNames] = React.useState()
  const pack = useParams()

  const handleAddRound = async name => {
    let packRounds = [...props.pack.rounds]
    packRounds.push({ name })
    let newPack = { ...props.pack, rounds: packRounds }
    await saveLocalPack(newPack)
    props.dispatch({
      type: 'pack/load',
      pack: newPack
    })
    setRounds(packRounds)
  }

  const handleRemoveRound = async index => {
    let packRounds = [...props.pack.rounds]
    packRounds.splice(index, 1)
    let newPack = { ...props.pack, rounds: packRounds }
    await saveLocalPack(newPack)
    props.dispatch({ type: 'pack/load', pack: newPack })
    setRounds(packRounds)
  }

  const onDragEnd = async result => {
    if (!result.destination) return
    const items = reorder(rounds, result.source.index, result.destination.index)
    setRounds(items)
    let newPack = { ...props.pack, rounds: items }
    await saveLocalPack(newPack)
    props.dispatch({ type: 'pack/load', pack: newPack })
  }

  const handleSwitchEditing = () => {
    setEditing(!editing)
    setNames(props.pack.rounds.map(pack => pack.name))
  }

  const handleRoundNameChange = (e, index) => {
    names[index] = e.target.value
    setNames(names)
    console.log(names)
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
                    handleRoundNameChange={handleRoundNameChange}
                    roundNameTextInput={names[i]}
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
})

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
