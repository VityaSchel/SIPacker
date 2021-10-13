import React from 'react'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import ItemsList from 'components/ItemsList'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import ScenarioEvent from './ScenarioEvent'
import { MdAdd } from 'react-icons/md'
import { scenarioHint } from './hints'
import WithHint from './WithHint'

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
    setScenario([...scenario, { type: newEventValue, duration: 3 }])
  }

  const handleDelete = index => {
    const newScenario = [...scenario]
    newScenario.splice(index, 1)
    setScenario(newScenario)
  }

  return (
    <div className={styles.scenario}>
      <WithHint hint={scenarioHint}>
        <Typography variant='h6'>Сценарий</Typography>
      </WithHint>
      <ItemsList
        droppableId='scenario'
        onDragEnd={onDragEnd}
        list={scenario}
        draggableProps={{
          onDelete: handleDelete
        }}
        noItemsLabel='Сценарий пуст'
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
        <IconButton onClick={handleAddEvent} disabled={!newEventValue}>
          <MdAdd />
        </IconButton>
      </div>
    </div>
  )
}
