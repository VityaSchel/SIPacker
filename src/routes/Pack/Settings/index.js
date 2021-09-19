import PropTypes from 'prop-types'
import { Field, useFormik } from 'formik'
import * as yup from 'yup'
import { componentsPropTypes } from '../../../consts'
import FormikField, { FormikAutocomplete } from '../../../components/FormikField'
import { connect } from 'react-redux'
import Button from '@mui/material/Button'
import styles from './styles.module.scss'
import { format } from '../../../consts'

const schema = {
  name: yup
    .string('Введите название пака')
    .required('Заполните поле названия'),
  authors: yup
    .string('Введите ваш никнейм')
    .required('Заполните поле автора'),
  difficulty: yup
    .number('Выберете сложность пака')
    .positive()
    .min(0)
    .integer('Число должно быть целым')
    .required('Заполните поле сложности'),
  comment: yup.
    string('Введите комментарий'),
  tags: yup
    .string('Введите теги'),
  lang: yup
    .string('Введите язык пака')
    .required('Заполните поле язык')
}
const validationSchema = yup.object(schema)

Settings.propTypes = {
  pack: PropTypes.shape(componentsPropTypes)
}

function Settings(props) {
  const initialValues = {}
  Object.keys(schema).forEach(key => initialValues[key] = props.pack[key] || '')

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2))
    },
  })

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <FormikField
          name='name'
          formik={formik}
          label='Название'
        />
        <FormikAutocomplete
          name='authors'
          formik={formik}
          label='Авторы'
        />
        <FormikField
          name='difficulty'
          label='Сложность'
          formik={formik}
          type='number'
          min={0}
        />
        <FormikField
          name='comment'
          formik={formik}
          label='Описание (необязательно)'
        />
        <FormikAutocomplete
          name='tags'
          formik={formik}
          label='Теги (необязательно)'
        />
        <Button color='primary' variant='contained' type='submit'>
          Сохранить
        </Button>
      </form>
      <div className={styles.info}>
        <ul>
          <li>Версия XML для описания формата: <span>{format.xmlVersion}</span></li>
          <li>Кодировка текста в формате: <span>{format.encoding}</span></li>
          <li>Версия формата: <span>{format.version}</span></li>
          <li>UUID: <span>{props.pack.uuid}</span></li>
          <li>Дата создания: <span>{props.pack.date}</span></li>
        </ul>
      </div>
    </div>
  )
}

export default connect(state => ({ pack: state.pack }))(Settings)
