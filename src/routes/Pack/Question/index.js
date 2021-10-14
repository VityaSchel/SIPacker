import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { mapPackState } from '../../../utils'
import NotFound404 from 'components/NotFound404'
import QuestionContent from './QuestionContent'

Question.propTypes = {
  pack: PropTypes.object,
}
function Question(props) {
  const [notFound, setNotFound] = React.useState()
  const [question, setQuestion] = React.useState()
  const params = useParams()

  React.useEffect(() => {
    const pack = props.pack
    if(!pack) return setNotFound(true)
    const round = pack.rounds[params.roundIndex-1]
    if(!round) return setNotFound(true)
    const theme = round.themes[params.themeIndex-1]
    if(!theme) return setNotFound(true)
    const question = theme.questions.find(({ price }) => price === Number(params.questionPrice))
    if(!question) return setNotFound(true)
    setQuestion(question)
    setNotFound(false)
  }, [params])

  return (
    notFound !== undefined &&
    notFound
      ? <NotFound404 />
      : <QuestionContent data={question} />
  )
}

export default connect(mapPackState)(Question)
