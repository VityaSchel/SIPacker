import PropTypes from 'prop-types'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

FormikField.propTypes = {
  name: PropTypes.string,
  formik: PropTypes.object
}

export default function FormikField(props) {
  const { name, formik, ...fieldProps } = props

  return (
    <TextField
      name={name}
      value={formik.values[props.name]}
      onChange={formik.handleChange}
      error={formik.touched[props.name] && Boolean(formik.errors[props.name])}
      helperText={formik.touched[props.name] && formik.errors[props.name]}
      {...fieldProps}
    />
  )
}


export function FormikAutocomplete(props) {
  const { formik, name, ...field } = props

  const handleChange = (_, value) => {
    formik.setFieldValue(name, value.join(','))
  }

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
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name]}
          placeholder='Нажмите Enter, чтобы добавить'
        />
      )}
    />
  )
}

FormikAutocomplete.propTypes = {
  formik: PropTypes.any,
  form: PropTypes.any,
  error: PropTypes.any,
  helperText: PropTypes.any
}
