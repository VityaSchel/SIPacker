import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { MdCancel, MdAdd, MdDone } from 'react-icons/md'
import cx from 'classnames'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

AddItem.propTypes = {
  onAdd: PropTypes.func,
  inputLabel: PropTypes.string,
  buttonLabel: PropTypes.string,
  className: PropTypes.string
}
export default function AddItem(props) {
  const [addingItem, setAddingItem] = React.useState(false)

  return (
    <div className={[styles.addItem, props.className].join(' ')}>
      <ItemName
        setAddingItem={setAddingItem}
        handleAddItem={props.onAdd}
        className={cx(styles.button, { [styles.expand]: addingItem })}
        addingItem={addingItem}
        label={props.inputLabel}
      />
      <div className={cx([styles.button, styles.addButtonOuter], { [styles.expand]: !addingItem })}>
        <Button
          variant='contained'
          startIcon={<MdAdd />}
          onClick={() => setAddingItem(true)}
          className={styles.addButton}
        >{props.buttonLabel}</Button>
      </div>
    </div>
  )
}

ItemName.propTypes = {
  setAddingItem: PropTypes.func,
  handleAddItem: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
  addingItem: PropTypes.bool,
  label: PropTypes.string
}

function ItemName(props) {
  const [value, setValue] = React.useState('')
  const outlinedInput = React.useRef()

  const handleDone = () => {
    props.setAddingItem(false)
    if(value.length) {
      props.handleAddItem(value)
      setValue('')
    }
  }

  React.useEffect(() => {
    props.addingItem && outlinedInput.current.focus()
  }, [props.addingItem])

  return (
    <FormControl variant='outlined' className={props.className}>
      <InputLabel size="small">{props.label}</InputLabel>
      <OutlinedInput
        label={props.label}
        size='small'
        type='text'
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleDone()}
        style={{ paddingRight: 0 }}
        inputRef={outlinedInput}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton onClick={handleDone}>
              {!value.length ? <MdCancel /> : <MdDone />}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
