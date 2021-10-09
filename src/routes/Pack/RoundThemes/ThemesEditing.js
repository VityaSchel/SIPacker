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
  handleAddRound: PropTypes.func
}
export default function ThemesEditing(props) {
  return (
    <>
      <ItemsList
        onDragEnd={props.onDragEnd}
        list={props.themes}
        draggableProps={{
          setExpand: props.setExpand,
          expandId: props.expand
        }}
        noItemsLabel='Еще нет созданных тем'
        itemComponent={Theme}
        useIdAsKey={true}
      />
      <AddItem
        onAdd={props.handleAddRound}
        inputLabel='Название темы'
        buttonLabel='Добавить тему'
        className={styles.addTheme}
      />
    </>
  )
}
