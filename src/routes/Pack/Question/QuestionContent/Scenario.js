import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import ItemsList from 'components/ItemsList'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import { MdDelete, MdAdd } from 'react-icons/md'
import Item from 'components/ItemsList/Item'
import Handle from 'components/ItemsList/Handle'

export default function Scenario({ formik }) {
  const [scenario, setScenario] = React.useState([])
  const [newEventValue, setNewEventValue] = React.useState('')

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  const onDragEnd = result => {
    if (!result.destination) return
    const items = reorder(scenario, result.source.index, result.destination.index)
    setScenario(items)
  }

  const handleAddEvent = () => {
    setNewEventValue()
    setScenario([...scenario, { type: newEventValue }])
  }

  const handleDelete = index => {
    const newScenario = [...scenario]
    newScenario.splice(index, 1)
    setScenario(newScenario)
  }

  console.log(newEventValue);

  return (
    <div className={styles.scenario}>
      <Typography variant='h6'>Сценарий</Typography>
      <ItemsList
        droppableId='scenario'
        onDragEnd={onDragEnd}
        list={scenario}
        draggableProps={{
          onDelete: handleDelete
        }}
        noItemsLabel='Еще нет созданных тем'
        itemComponent={ScenarioEvent}
      />
      <div className={styles.addEvent}>
        <FormControl fullWidth>
          <InputLabel>Добавить событие</InputLabel>
          <Select
            name={name}
            value={newEventValue}
            onChange={e => setNewEventValue(e.target.value)}
            label='Добавить событие'
            displayEmpty={true}
          >
            <MenuItem value='text'>Текст на экране</MenuItem>
            <MenuItem value='say'>Слово ведущего</MenuItem>
            <MenuItem value='image'>Изображение</MenuItem>
            <MenuItem value='voice'>Аудио</MenuItem>
            <MenuItem value='video'>Видео</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={handleAddEvent} disabled={newEventValue === 'none'}>
          <MdAdd />
        </IconButton>
      </div>
    </div>
  )
}


/*
<AddItem
  onAdd={() => console.log(1)}
  inputLabel='Тип события'
  inputProps={{  }}
  buttonLabel='Добавить событие'
  className={styles.addTheme}
/>
*/

ScenarioEvent.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  onDelete: PropTypes.func
}
function ScenarioEvent(props) {
  return (
    <Item
      index={props.index}
      draggableId={props.index.toString()}
    >
      {(provided) => <div className={styles.item}>
        <Handle provided={provided} />
        <Typography variant='body1' className={styles.itemType}>{JSON.stringify(props.item)}</Typography>
        <IconButton
          onClick={() => props.onDelete(props.index)}
          className={styles.delete}
        >
          <MdDelete className={styles.delete} />
        </IconButton>
      </div>}
    </Item>
  )
}
