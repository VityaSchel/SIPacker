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
  'auction': 'Аукцион',
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
