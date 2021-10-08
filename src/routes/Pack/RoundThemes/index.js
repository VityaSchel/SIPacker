import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { uuidRegex } from '../../../consts'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { saveLocalPack } from 'localStorage/localPacks'
import Typography from '@mui/material/Typography'
import listStyles from '../dragNDrop.module.scss'

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
  const route = useLocation()
  const roundIndex = route.pathname.split(new RegExp(`/pack/${uuidRegex}/rounds/`), 2)[1]

  const onDragEnd = result => {
    if (!result.destination) return
    const items = reorder(themes, result.source.index, result.destination.index)
    updateThemes(items)
  }

  const updateThemes = async items => {
    setThemes(items)
    let newPack = { ...props.pack, rounds: items }
    await saveLocalPack(newPack)
    props.dispatch({ type: 'pack/load', pack: newPack })
  }

  return (
    <div>
      <h2>Вопросы раунда {props.pack.rounds[roundIndex-1].name}</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='themes'>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {themes.length
                ? themes.map((round, i) =>
                  <div
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
    </div>
  )
}

export default connect(state => ({ pack: state.pack }))(RoundThemes)
