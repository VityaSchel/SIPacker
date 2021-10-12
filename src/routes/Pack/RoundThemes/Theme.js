import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import ItemContent from './Questions'
import Item from 'components/ItemsList/Item'
import { connect } from 'react-redux'
import { MdDragHandle, MdDelete, MdExpandMore } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import TextField from '@mui/material/TextField'
import ClickIsolator from 'components/ClickIsolator'
import { mapPackState } from '../../../utils'

Theme.propTypes = {
  item: PropTypes.object,
  pack: PropTypes.object,
  index: PropTypes.number,
  expandId: PropTypes.number,
  setExpand: PropTypes.func,
  draggableId: PropTypes.string,
  handleRemoveTheme: PropTypes.func,
  handleChangeThemeName: PropTypes.string,
}

function Theme(props) {
  const theme = props.item
  const expand = props.draggableId === props.expandId
  const [themeName, setThemeName] = React.useState(theme.name)

  const handleDelete = e => {
    e.stopPropagation()
    props.handleRemoveTheme(props.index)
  }

  const handleChangeThemeName = e => {
    const newThemeName = e.target.value
    setThemeName(newThemeName)
    props.handleChangeThemeName(props.index, newThemeName)
  }

  return (
    <Item
      index={props.index}
      draggableId={theme.id.toString()}
    >
      {(provided) => <Accordion
        expanded={expand}
        onChange={(_, isExpand) => props.setExpand(isExpand ? theme.id : undefined)}
      >
        <AccordionSummary
          expandIcon={<MdExpandMore />}
        >
          <div className={styles.toolbar}>
            <Handle provided={provided} />
            <ClickIsolator className={styles.name}>
              <TextField
                value={themeName}
                label='Название раунда'
                variant='outlined'
                onChange={handleChangeThemeName}
                size='small'
                fullWidth
              />
            </ClickIsolator>
            <IconButton
              onClick={handleDelete}
              className={styles.delete}
            >
              <MdDelete className={styles.delete} />
            </IconButton>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <ItemContent theme={theme} themeIndex={props.index} />
        </AccordionDetails>
      </Accordion>}
    </Item>
  )
}

Handle.propTypes = { provided: PropTypes.object }
function Handle(props) {
  return (
    <div
      className={styles.handle}
      {...props.provided.dragHandleProps}
    >
      <MdDragHandle />
    </div>
  )
}

export default connect(mapPackState)(Theme)
