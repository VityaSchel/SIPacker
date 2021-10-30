import React from 'react'
import { createBrowserHistory } from 'history'
import filesizeToText from 'filesize'
import generatePeaks from 'waveformer'

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
  pack.rounds.length &&
  pack.rounds.every(round =>
    round.themes.every(theme =>
      theme.questions.length
    )
  )
)

export const hasThemeInEachRound = pack => Boolean(
  pack.rounds.length &&
  pack.rounds.every(round =>
    round.themes.length
  )
)

export const has5ThemesInEachRound = pack => Boolean(
  pack.rounds.length &&
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
  pack.rounds.length &&
  pack.rounds.every(
    round => round.themes.every(
      theme => theme.questions.every(
        question => question.scenario?.length
      )
    )
  )
)

const symbols = { B: 'Б', kB: 'кБ', MB: 'МБ', GB: 'ГБ', TB: 'ТБ', PB: 'ПБ', EB: 'ЭБ', ZB: 'ЗБ', YB: 'ЙБ' }
export const filesize = size => size === null ? 'Неизвестно' : filesizeToText(size, { symbols })

export function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = React.useRef()
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  React.useEffect(() => {
    savedHandler.current = handler
  }, [handler])
  React.useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener
      if (!isSupported) return
      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event)
      // Add event listener
      element.addEventListener(eventName, eventListener)
      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element] // Re-run if eventName or element changes
  )
}

export const extensionsMimeTypes = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jpe: 'image/jpeg',
  gif: 'image/gif',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  wav: 'audio/x-wav',
  mp4: 'video/mp4'
}

export const swapObject = obj => Object.assign({}, ...Object.entries(obj).map(([a,b]) => ({ [b]: a })))

export const getType = mimeType => ({
  'image/png': 'Изображение PNG',
  'image/jpeg': 'Изображение JPEG',
  'image/gif': 'Анимация GIF',
  'audio/mpeg': 'Аудио-файл mpeg',
  'audio/x-wav': 'Аудио-файл wav',
  'audio/ogg': 'Аудио-файл ogg',
  'video/mp4': 'Видео-файл mpeg',
}[mimeType] ?? 'Неизвестный формат')

export const generateWaveform = (width, height, srcUrl) => {
  return new Promise(resolve => {
    const virtualCanvas = document.createElement('canvas')
    const context = virtualCanvas.getContext('2d')
    virtualCanvas.width = width
    virtualCanvas.height = height

    generatePeaks(width, srcUrl).then(peaks => {
      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#5b60f8')
      gradient.addColorStop(1, '#2e33c3')
      context.strokeStyle = gradient

      for(let x = 0; x < width; x++) {
        context.beginPath()
        const center = height/2
        const halfPeak = peaks[x]*height / 2
        context.moveTo(x, center-halfPeak)
        context.lineTo(x, center+halfPeak)
        context.stroke()
      }

      virtualCanvas.toBlob(resolve)
    })
  })
}
