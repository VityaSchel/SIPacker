export const validate = (values, props, params) => {
  const questions = [...props.pack.rounds[params.roundIndex-1].themes[params.themeIndex-1].questions]

  const errors = {}
  if(values.price !== props.data?.price && questions.some(({ price }) => price === values.price)) {
    errors.price = 'Вопрос с такой стоимостью уже существует в этой теме'
  }

  const checkRealPrice = () => {
    checkNumber('realprice', 'Выберете настоящую стоимость вопроса', 'Настоящая стоимость вопроса должна быть больше 0')
  }

  const checkNumber = (propertyName, noValueError = 'Выберете значение', zeroError = 'Значение должно быть больше 0') => {
    if(values[propertyName] === undefined || values[propertyName] === '') {
      errors[propertyName] = noValueError
    } else if (values[propertyName] === 0) {
      errors[propertyName] = zeroError
    }
  }

  switch(values.type) {
    case 'cat':
      checkRealPrice()
      break

    case 'bagcat':
      if(!values.questionPriceType) {
        errors.questionPriceType = 'Выберете способ определения стоимость вопроса'
      } else {
        switch(values.questionPriceType) {
          case 'fixed':
            checkRealPrice()
            break

          case 'byPlayer':
            ['realpriceFrom', 'realpriceTo'].forEach(checkNumber)
            if(values.realpriceStep === 0) errors.realpriceStep = 'Шаг не может быть равен 0'
            break
        }
      }
      if(!values.detailsDisclosure) errors.detailsDisclosure = 'Выберете момент, когда узнается стоимость вопроса'
      break
  }

  return errors
}
