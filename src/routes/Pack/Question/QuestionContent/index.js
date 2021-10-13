import React from 'react'
import * as yup from 'yup'
import styles from './styles.module.scss'
import { useFormik } from 'formik'
import { useHistory, Prompt } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useBeforeunload } from 'react-beforeunload'
import FormFields from './FormFields'
import Scenario from './Scenario'

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
  scenario: yup
    .array()
    .of(yup.object().shape({ type: yup.string() }))
    .min(1)
    .max(100)
})

export default function QuestionContent() {
  const history = useHistory()
  const [submitting, setSubmitting] = React.useState(false)

  const initialValues = {}

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setSubmitting(true)
      console.log(values)
      // let pack = { ...props.pack, ...values }
      // await saveLocalPack(pack)
      // props.dispatch({ type: 'pack/load', pack })
      // history.push(`/pack/${pack.uuid}`)
    },
  })

  useBeforeunload((event) => {
    if(Object.keys(formik.touched).length) event.preventDefault()
  })

  return (
    <div className={styles.container}>
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.formGroups}>
          <FormFields formik={formik} submitting={submitting} />
          <Scenario formik={formik} submitting={submitting} />
        </div>
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
      <Prompt
        when={Object.keys(formik.touched).length && !submitting}
        message='Вы хотите покинуть страницу, не сохраняя изменений?'
      />
    </div>
  )
}
