import { createBrowserHistory } from 'history'

export const removeUndefined = object => Object.fromEntries(Object.entries(object).filter(([, val]) => val !== undefined))

export const history = createBrowserHistory()
