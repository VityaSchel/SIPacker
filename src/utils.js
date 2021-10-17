import { createBrowserHistory } from 'history'

export const removeUndefined = object => Object.fromEntries(Object.entries(object).filter(([, val]) => val !== undefined))

export const history = createBrowserHistory()

export const emptyFunc = () => {}

export const formatDate = dateTime => new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  seconds: 'numeric'
}).format(dateTime)

export const mapPackState = state => ({ pack: state.pack })

export const questionTypes = {
  'simple': 'Обычный',
  'auction': 'Со ставкой (Аукцион)',
  'cat': 'С секретом',
  'bagcat': 'Кот в мешке',
  'sponsored': 'Без риска'
}

export const initValues = (schema, object) => {
  const initialValues = object ?? {}
  const fields = Object.keys(schema.fields)
  const defaultValues = {
    'number': 0,
    'string': '',
    'boolean': false
  }
  fields.forEach(key => initialValues[key] = object ? object[key] : defaultValues[schema.fields[key].type])
  return initialValues
}


export const hasQuestionInEachTheme = pack => Boolean(
  pack.rounds.every(round =>
    round.themes.every(theme =>
      theme.questions.length
    )
  )
)

export const hasThemeInEachRound = pack => Boolean(
  pack.rounds.every(round =>
    round.themes.length
  )
)

export const has5ThemesInEachRound = pack => pack.rounds.length && Boolean(
  pack.rounds.every(round =>
    round.themes.length >= 5
  )
)

export const hasAtLeast25Questions = pack => Boolean(
  pack.rounds.reduce(
    (prev, round) => prev+round.themes.reduce(
      (prev, theme) => prev+theme.questions.length, 0
    ), 0
  ) >= 25
)

export const hasQuestionWithAuction = pack => Boolean(
  pack.rounds.some(
    round => round.themes.some(
      theme => theme.questions.some(
        question => question.type === 'auction'
      )
    )
  )
)

export const hasQuestionWithBagCat = pack => Boolean(
  pack.rounds.some(
    round => round.themes.some(
      theme => theme.questions.some(
        question => question.type === 'bagcat'
      )
    )
  )
)

export const hasScenarioInEachQuestion = pack => Boolean(
  pack.rounds.every(
    round => round.themes.every(
      theme => theme.questions.every(
        question => question.scenario?.length
      )
    )
  )
)
