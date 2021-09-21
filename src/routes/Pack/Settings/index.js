import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { componentsPropTypes } from '../../../consts'
import { FormikTextField, FormikAutocomplete, FormikSelect, FormikCheckbox } from '../../../components/FormikField'
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
  comment: yup
    .string('Введите комментарий'),
  tags: yup
    .string('Введите теги'),
  language: yup
    .string('Введите язык пака')
    .required('Заполните поле язык'),
  over18: yup
    .bool('Введите ограничения пакета')
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
      console.log(values)
    },
  })

  return (
    <div className={styles.container}>
      <form onSubmit={e => {console.log(e); formik.handleSubmit(e)}} className={styles.form}>
        <FormikTextField
          name='name'
          formik={formik}
          label='Название'
        />
        <FormikAutocomplete
          name='authors'
          formik={formik}
          label='Авторы'
        />
        <FormikTextField
          name='difficulty'
          label='Сложность'
          formik={formik}
          type='number'
          min={0}
        />
        <FormikSelect
          name='language'
          formik={formik}
          label='Язык пакета'
          options={{
            '': 'Не указано',
            'ru-RU': 'Русский (ru-RU)',
            'en-US': 'Английский (en-US)'
          }}
        />
        <FormikTextField
          name='comment'
          formik={formik}
          label='Описание (необязательно)'
        />
        <FormikAutocomplete
          name='tags'
          formik={formik}
          label='Теги (необязательно)'
        />
        <FormikCheckbox
          name='restrictions'
          formik={formik}
          label='Добавить метку 18+'
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
