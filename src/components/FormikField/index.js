import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Slider from '@mui/material/Slider'
import styles from './styles.module.scss'
import ImageField from 'components/ImageField'

const formikMuiErrors = (formik, name) => ({
  error: Boolean(formik.errors[name]),
  helperText: formik.errors[name]
})

FormikTextField.propTypes =
FormikAutocomplete.propTypes =
FormikCheckbox.propTypes =
FormikImageField.propTypes =
{
  name: PropTypes.string,
  formik: PropTypes.object
}

export function FormikTextField(props) {
  const { name, formik, ...fieldProps } = props

  const handleChange = e => {
    formik.handleChange(e)
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  return (
    <TextField
      name={name}
      value={formik.values[name]}
      onChange={handleChange}
      {...formikMuiErrors(formik, name)}
      {...fieldProps}
    />
  )
}


export function FormikAutocomplete(props) {
  const { formik, name, ...field } = props

  const handleChange = (_, value) => {
    formik.setFieldValue(name, value.map(v => v.replaceAll(',', '') || '.').join(','))
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  let value = formik.values[name]?.split(',') ?? []
  if(value.length === 1 && value[0] === '') value = []

  const handleKeyDown = e => {
    if(e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <Autocomplete
      {...field}
      multiple
      options={[]}
      value={value}
      getOptionLabel={(option) => option}
      freeSolo clearOnBlur={true}
      onChange={handleChange}
      renderInput={props => (
        <TextField
          {...field}
          {...props}
          {...formikMuiErrors(formik, name)}
          placeholder='Нажмите Enter, чтобы добавить'
          onKeyDown={handleKeyDown}
        />
      )}
    />
  )
}

FormikSelect.propTypes = { ...FormikTextField.propTypes, options: PropTypes.object }
export function FormikSelect(props) {
  const { formik, name, options, ...field } = props
  const error = { error: Boolean(formik.errors[name]) }

  const handleChange = e => {
    formik.handleChange(e)
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  return (
    <FormControl fullWidth>
      <InputLabel {...error}>{props.label}</InputLabel>
      <Select
        {...field}
        name={name}
        value={formik.values[name]}
        onChange={handleChange}
        {...error}
      >
        {Object.entries(options).map(([id, label]) => <MenuItem value={id} key={id}>{label}</MenuItem>)}
      </Select>
      <FormHelperText error>{formik.errors[name] && formik.errors[name]}</FormHelperText>
    </FormControl>
  )
}

export function FormikCheckbox(props) {
  const { formik, name, ...field } = props

  const handleChange = e => {
    formik.handleChange(e)
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={formik.values[name]}
          onChange={handleChange}
        />
      }
      {...field}
    />
  )
}

FormikSlider.propTypes = {
  ...FormikTextField.propTypes,
  defaultValue: PropTypes.number,
}
export function FormikSlider(props) {
  const { formik, name, ...field } = props
  const [value, setValue] = React.useState(formik.values[name])

  const handleChange = e => {
    setValue(e.target.value)
    formik.setTouched({ ...formik.touched, [name]: true })
  }

  React.useEffect(() => formik.setFieldValue(name, value), [value])

  return (
    <div className={styles.slider}>
      <span>{field.label}</span>
      <Slider
        name={name}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        marks
        {...field}
      />
    </div>
  )
}

export function FormikImageField(props) {
  const { formik, name, ...field } = props

  const handleChange = fileURI => {
    formik.setFieldValue(name, fileURI)
    let touched
    if(fileURI !== undefined) {
      touched = { ...formik.touched, [name]: true }
    } else {
      const formikTouched = { ...formik.touched }
      delete formikTouched[name]
      touched = formikTouched
    }
    formik.setTouched(touched)
  }

  return (
    <ImageField
      {...field}
      value={formik.values[name]}
      onChange={handleChange}
    />
  )
}
