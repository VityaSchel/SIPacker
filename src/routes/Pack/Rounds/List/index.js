import React from 'react'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useParams } from 'react-router-dom'
import Round from './Round'
import AddItem from 'components/AddItem'
import { MdEdit, MdDone } from 'react-icons/md'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { saveLocalPack } from 'localStorage/localPacks'
import listStyles from '../../dragNDrop.module.scss'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export default connect(state => ({ pack: state.pack }))(function RoundsList(props) {
  const [rounds, setRounds] = React.useState(props.pack.rounds)
  const [editing, setEditing] = React.useState(false)
  const pack = useParams()

  const handleAddRound = async name => {
    let packRounds = [...props.pack.rounds]
    packRounds.push({ name, themes: [] })
    updateRounds(packRounds)
  }

  const handleRemoveRound = index => {
    let packRounds = [...props.pack.rounds]
    packRounds.splice(index, 1)
    updateRounds(packRounds)
  }

  const onDragEnd = result => {
    if (!result.destination) return
    const items = reorder(rounds, result.source.index, result.destination.index)
    updateRounds(items)
  }

  const handleSwitchEditing = () => {
    setEditing(!editing)
  }

  const updateRounds = async items => {
    setRounds(items)
    let newPack = { ...props.pack, rounds: items }
    await saveLocalPack(newPack)
    props.dispatch({ type: 'pack/load', pack: newPack })
  }

  const names = rounds.map(pack => pack.name)

  const handleRoundNameChange = (e, index) => {
    const namesList = [...rounds]
    namesList[index].name = e.target.value
    updateRounds(namesList)
  }

  return (
    <div className={styles.rounds}>
      <div className={styles.heading}>
        <h2 className={styles.text}>Раунды пака</h2>
        {Boolean(rounds.length) && <IconButton onClick={handleSwitchEditing}>{ editing ? <MdDone /> : <MdEdit /> }</IconButton>}
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
                  className={listStyles.noItems}
                >Еще нет раундов</Typography>
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddItem
        onAdd={handleAddRound}
        inputLabel='Название раунда'
        buttonLabel='Добавить раунд'
      />
    </div>
  )
})
