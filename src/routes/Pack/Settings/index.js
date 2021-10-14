import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { componentsPropTypes, format } from '../../../consts'
import {
  FormikTextField,
  FormikAutocomplete,
  FormikSelect,
  FormikCheckbox,
  FormikSlider,
  FormikImageField
} from 'components/FormikField'
import { connect } from 'react-redux'
import Button from '@mui/material/Button'
import { useBeforeunload } from 'react-beforeunload'
import { useHistory, Prompt } from 'react-router-dom'
import { saveLocalPack } from 'localStorage/localPacks'
import { initValues, mapPackState } from '../../../utils'

const validationSchema = yup.object({
  logo: yup
    .string('Добавьте логотип пака'),
  name: yup
    .string('Введите название пака')
    .required('Заполните поле названия'),
  authors: yup
    .string('Введите ваш никнейм')
    .required('Заполните поле автора'),
  publisher: yup
    .string('Введите издателя'),
  difficulty: yup
    .number('Выберете сложность пака')
    .positive()
    .min(1)
    .max(10)
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
    .bool('Введите ограничения пака')
})

Settings.propTypes = {
  pack: PropTypes.shape(componentsPropTypes),
  dispatch: PropTypes.func
}

function Settings(props) {
  const [submitting, setSubmitting] = React.useState(false)
  const history = useHistory()
  const initialValues = initValues(validationSchema, props.pack)

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setSubmitting(true)
      let pack = { ...props.pack, ...values }
      await saveLocalPack(pack)
      props.dispatch({ type: 'pack/load', pack })
      history.push(`/pack/${pack.uuid}`)
    },
  })

  useBeforeunload((event) => {
    if(Object.keys(formik.touched).length) event.preventDefault()
  })

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <FormikTextField
          name='name'
          formik={formik}
          label='Название'
          disabled={submitting}
        />
        <FormikAutocomplete
          name='authors'
          formik={formik}
          label='Авторы'
          disabled={submitting}
        />
        <FormikImageField
          name='logo'
          formik={formik}
          label='Логотип'
        />
        <FormikTextField
          name='publisher'
          formik={formik}
          label='Издатель пака (необязательно)'
          disabled={submitting}
        />
        <FormikSlider
          name='difficulty'
          label='Сложность'
          formik={formik}
          disabled={submitting}
          step={1} min={1} max={10}
        />
        <FormikSelect
          name='language'
          formik={formik}
          label='Язык пака'
          options={{
            '': 'Не указано',
            'ru-RU': 'Русский (ru-RU)',
            'en-US': 'Английский (en-US)'
          }}
          disabled={submitting}
        />
        <FormikTextField
          name='comment'
          formik={formik}
          label='Описание (необязательно)'
          disabled={submitting}
        />
        <FormikAutocomplete
          name='tags'
          formik={formik}
          label='Теги (необязательно)'
          disabled={submitting}
        />
        <FormikCheckbox
          name='over18'
          formik={formik}
          label='Добавить метку 18+'
          disabled={submitting}
        />
        <Button
          color='primary'
          variant='contained'
          type='submit'
          disabled={submitting}
        >
          Сохранить
        </Button>
      </form>
      <Prompt
        when={Object.keys(formik.touched).length && !submitting}
        message='Вы хотите покинуть страницу, не сохраняя изменений?'
      />
      <div className={styles.info}>
        <ul>
          <li>Версия XML для описания формата: <span>{format.xmlVersion}</span></li>
          <li>Кодировка текста в формате: <span>{format.encoding}</span></li>
          <li>Версия формата: <span>{props.pack.version}</span></li>
          <li>UUID: <span>{props.pack.uuid}</span></li>
          <li>Дата создания: <span>{props.pack.date}</span></li>
        </ul>
      </div>
    </div>
  )
}

export default connect(mapPackState)(Settings)
