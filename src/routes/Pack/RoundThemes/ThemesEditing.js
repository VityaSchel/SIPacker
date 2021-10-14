import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import AddItem from 'components/ItemsList/AddItem'
import ItemsList from 'components/ItemsList'
import Theme from './Theme'

ThemesEditing.propTypes = {
  onDragEnd: PropTypes.func,
  themes: PropTypes.array,
  expand: PropTypes.bool,
  setExpand: PropTypes.func,
  setEditing: PropTypes.func,
  handleAddTheme: PropTypes.func,
  handleRemoveTheme: PropTypes.func,
  handleChangeThemeName: PropTypes.func
}
export default function ThemesEditing(props) {
  return (
    <>
      <ItemsList
        droppableId='themes'
        onDragEnd={props.onDragEnd}
        list={props.themes}
        draggableProps={{
          setExpand: props.setExpand,
          handleRemoveTheme: props.handleRemoveTheme,
          handleChangeThemeName: props.handleChangeThemeName,
          expandId: props.expand
        }}
        noItemsLabel='Еще нет созданных тем'
        itemComponent={Theme}
        useIdAsKey={true}
      />
      <AddItem
        onAdd={props.handleAddTheme}
        inputLabel='Название темы'
        buttonLabel='Добавить тему'
        className={styles.addTheme}
      />
    </>
  )
}
