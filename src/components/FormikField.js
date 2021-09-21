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

const formikMuiErrors = (formik, name) => ({
  error: formik.touched[name] && Boolean(formik.errors[name]),
  helperText: formik.touched[name] && formik.errors[name]
})

FormikTextField.propTypes =
FormikAutocomplete.propTypes =
FormikCheckbox.propTypes =
{
  name: PropTypes.string,
  formik: PropTypes.object
}

export function FormikTextField(props) {
  const { name, formik, ...fieldProps } = props

  return (
    <TextField
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      {...formikMuiErrors(formik, name)}
      {...fieldProps}
    />
  )
}


export function FormikAutocomplete(props) {
  const { formik, name, ...field } = props
  const handleChange = (_, value) => formik.setFieldValue(name, value.join(','))

  return (
    <Autocomplete
      {...props}
      {...field}
      multiple
      options={[]}
      getOptionLabel={(option) => option.replaceAll(',', '') || '.'}
      freeSolo clearOnBlur={true}
      onChange={handleChange}
      onBlur={() => formik.setTouched({ [name]: true })}
      renderInput={props => (
        <TextField
          {...field}
          {...props}
          {...formikMuiErrors(formik, name)}
          placeholder='Нажмите Enter, чтобы добавить'
        />
      )}
    />
  )
}

FormikSelect.propTypes = { ...FormikTextField.propTypes, options: PropTypes.object }
export function FormikSelect(props) {
  const { formik, name, options, ...field } = props
  const error = { error: formik.touched[name] && Boolean(formik.errors[name]) }

  return (
    <FormControl fullWidth>
      <InputLabel {...error}>{props.label}</InputLabel>
      <Select
        {...field}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        {...error}
      >
        {Object.entries(options).map(([id, label]) => <MenuItem value={id} key={id}>{label}</MenuItem>)}
      </Select>
      <FormHelperText error>{formik.touched[name] && formik.errors[name]}</FormHelperText>
    </FormControl>
  )
}

export function FormikCheckbox(props) {
  const { formik, name, ...field } = props

  return (
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
        />
      }
      {...field}
    />
  )
}
