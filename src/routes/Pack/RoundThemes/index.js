import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { uuidRegex } from '../../../consts'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { saveLocalPack } from 'localStorage/localPacks'
import Typography from '@mui/material/Typography'
import listStyles from '../dragNDrop.module.scss'
import AddItem from 'components/ItemsList/AddItem'
import clone from 'just-clone'
import NotFound404 from 'components/NotFound404'
import Theme from './Theme'
import styles from './styles.module.scss'

RoundThemes.propTypes = {
  pack: PropTypes.object,
  dispatch: PropTypes.func
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function RoundThemes(props) {
  const [themes, setThemes] = React.useState([])
  const [found, setFound] = React.useState()
  const route = useLocation()
  const roundIndex = route.pathname.split(new RegExp(`/pack/${uuidRegex}/rounds/`), 2)[1]

  const round = props.pack.rounds[roundIndex-1]
  React.useEffect(() => {
    if(round) setFound(true)
    else setFound(false)
  }, [])

  const handleAddRound = async name => {
    let roundThemes = [...themes]
    roundThemes.push({ name, questions: [] })
    updateThemes(roundThemes)
  }

  const onDragEnd = result => {
    if (!result.destination) return
    const items = reorder(themes, result.source.index, result.destination.index)
    updateThemes(items)
  }

  const updateThemes = async items => {
    setThemes(items)
    const newPack = clone(props.pack)
    newPack.rounds[roundIndex-1].themes = items
    await saveLocalPack(newPack)
    props.dispatch({ type: 'pack/load', pack: newPack })
  }

  React.useEffect(() => {
    round && setThemes(round.themes)
  }, [])

  return (
    found !== undefined && (
      found
        ? <div>
          <h2>Вопросы раунда {round.name}</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='themes'>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {themes.length
                    ? themes.map((theme, i) => <Theme
                      i={i}
                      theme={theme}
                      key={i}
                    />)
                    : <Typography
                      variant='body1'
                      gutterBottom
                      className={listStyles.noItems}
                    >Еще нет созданных тем</Typography>
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <AddItem
            onAdd={handleAddRound}
            inputLabel='Название темы'
            buttonLabel='Добавить тему'
            className={styles.addTheme}
          />
        </div>
        : <NotFound404 />
    )
  )
}

export default connect(state => ({ pack: state.pack }))(RoundThemes)
