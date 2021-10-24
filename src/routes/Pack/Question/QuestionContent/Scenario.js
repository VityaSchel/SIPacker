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
import ScenarioEvent from './ScenarioEvent'
import { MdAdd } from 'react-icons/md'
import { scenarioHint } from './hints'
import WithHint from './WithHint'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { saveLocalPack } from 'localStorage/localPacks'
import { mapPackState } from 'utils'
import sipackerStore from 'reducers'

const Scenario = React.forwardRef(({ formik, ...props }, ref) => {
  const [scenario, setScenario] = React.useState([])
  const [newEventValue, setNewEventValue] = React.useState('')
  const [scenarioUpdateTimeout, setScenarioUpdateTimeout] = React.useState()
  const params = useParams()
  const round = params.roundIndex
  const questionPrice = params.questionPrice
  const questions = props.pack.rounds[round-1].themes[params.themeIndex-1].questions
  const question = questions[questions.findIndex(({ price }) => price === Number(questionPrice))]
  React.useEffect(() => question.scenario && setScenario(question.scenario), [])

  React.useEffect(() => {
    clearTimeout(scenarioUpdateTimeout)
    const scenarioUpdateQueue = setTimeout(() => updateQuestionScenario(scenario), 1000)
    setScenarioUpdateTimeout(scenarioUpdateQueue)
  }, [scenario])

  React.useImperativeHandle(ref, () => ({
    getScenario() {
      clearTimeout(scenarioUpdateTimeout)
      return scenario
    }
  }))

  const updateQuestionScenario = async scenario => {
    const pack = { ...sipackerStore.getState().pack }
    const round = params.roundIndex-1
    const questions = pack.rounds[round].themes[params.themeIndex-1].questions
    const question = questions[questions.findIndex(({ price }) => price === Number(questionPrice))]
    question.scenario = scenario
    await saveLocalPack(pack)
    sipackerStore.dispatch({ type: 'pack/load', pack })
  }

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
    setNewEventValue('')
    setScenario([...scenario, { type: newEventValue, duration: 3, data: {} }])
  }

  const handleDelete = index => {
    const newScenario = [...scenario]
    newScenario.splice(index, 1)
    setScenario(newScenario)
  }

  const handleChangeDuration = (index, value) => {
    const newScenario = [...scenario]
    newScenario[index].duration = value
    setScenario(newScenario)
  }

  const handleChangeData = (index, data) => {
    const newScenario = [...scenario]
    newScenario[index].data = data
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
          onDelete: handleDelete, formik,
          onChangeDuration: handleChangeDuration,
          onChangeData: handleChangeData,
          scenario
        }}
        noItemsLabel='Сценарий пуст'
        itemComponent={ScenarioEvent}
      />
      {scenario.length < 100 &&
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
              <MenuItem value='marker'><i>[Игроки отвечают]</i></MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleAddEvent} disabled={!newEventValue}>
            <MdAdd />
          </IconButton>
        </div>}
      <Typography variant='body2' color='text.secondary'>
        Все изменения в сценарии сохраняются автоматически
      </Typography>
    </div>
  )
})

Scenario.propTypes = {
  formik: PropTypes.object,
  pack: PropTypes.object,
  dispatch: PropTypes.func
}
Scenario.displayName = 'Scenario'
export default connect(mapPackState, null, null, { forwardRef: true })(Scenario)
