import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Typography from '@mui/material/Typography'
import listStyles from '../dragNDrop.module.scss'
import AddItem from 'components/ItemsList/AddItem'
import Theme from './Theme'

ThemesEditing.propTypes = {
  onDragEnd: PropTypes.func,
  themes: PropTypes.array,
  expand: PropTypes.bool,
  setExpand: PropTypes.func,
  handleAddRound: PropTypes.func
}
export default function ThemesEditing(props) {
  return (
    <>
      <DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId='themes'>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.themes.length
                ? props.themes.map((theme, i) => <Theme
                  key={theme.id}
                  index={i}
                  draggableId={theme.id}
                  theme={theme}
                  expand={props.expand === theme.id}
                  setExpand={props.setExpand}
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
        onAdd={props.handleAddRound}
        inputLabel='Название темы'
        buttonLabel='Добавить тему'
        className={styles.addTheme}
      />
    </>
  )
}
