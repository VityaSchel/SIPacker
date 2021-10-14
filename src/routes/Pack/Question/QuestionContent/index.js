import PropTypes from 'prop-types'
import * as yup from 'yup'
import styles from './styles.module.scss'
import { useFormik } from 'formik'
import { useParams, useHistory, Prompt } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useBeforeunload } from 'react-beforeunload'
import FormFields from './FormFields'
import Scenario from './Scenario'
import { mapPackState, initValues } from '../../../../utils'
import { connect } from 'react-redux'
import { saveLocalPack } from 'localStorage/localPacks'
import { validate } from './validation'

const priceSchema = yup
  .number()
  .integer()
  .min(1, 'Стоимость вопроса должна быть больше 0')
  .max(4294967295) // max of uint32

const validationSchema = yup.object({
  price: priceSchema.required('Выберете стоимость вопроса'),
  realprice: priceSchema,
  type: yup
    .string()
    .required('Выберете тип вопроса'),
  transferToSelf: yup.bool(),
  detailsDisclosure: yup.string(),
  realpriceFrom: yup.number(),
  realpriceTo: yup.number(),
  realpriceStep: yup.number(),
  correctAnswers: yup
    .string()
    .required('Добавьте как минимум один правильный ответ'),
  incorrectAnswers: yup.string()
})

QuestionContent.propTypes = {
  data: PropTypes.object,
  pack: PropTypes.object,
  dispatch: PropTypes.func
}

function QuestionContent(props) {
  const history = useHistory()
  const params = useParams()
  const round = params.roundIndex

  const initialValues = initValues(validationSchema, props.data)
  const formik = useFormik({
    initialValues,
    validate: values => validate(values, props, params), validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const pack = { ...props.pack }
      const question = { ...props.data, ...values }
      const questions = pack.rounds[round-1].themes[params.themeIndex-1].questions
      questions[questions.findIndex(({ price }) => price === Number(params.questionPrice))] = question
      await saveLocalPack(pack)
      props.dispatch({ type: 'pack/load', pack })
      history.push(`/pack/${pack.uuid}/rounds/${round}`)
    },
  })

  const submitting = formik.isSubmitting

  useBeforeunload((event) => {
    if(Object.keys(formik.touched).length) event.preventDefault()
  })

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <FormFields formik={formik} submitting={submitting} />
        <Button
          color='primary'
          variant='contained'
          type='submit'
          disabled={submitting}
          className={styles.submit}
        >
          Сохранить
        </Button>
      </form>
      <Scenario formik={formik} submitting={formik.isValidating || submitting} />
      <Prompt
        when={Object.keys(formik.touched).length && !submitting}
        message='Вы хотите покинуть страницу, не сохраняя изменений?'
      />
    </div>
  )
}

export default connect(mapPackState)(QuestionContent)
