import { ModelAPI } from '@mswjs/data/lib/glossary'
import { factory, primaryKey } from '@mswjs/data'

const models = {
  seriesDeck: {
    id: primaryKey(String),
    name: String,
    interfix: String,
    description: String,
    apiState: String,
    stringId: String,
    adminMemo: String
  }
}

export const db = factory(models)

export type Model = keyof typeof db

export const loadDb = () =>
  Object.assign(JSON.parse(window.localStorage.getItem('msw-db') || '{}'))

export const persistDb = (model: Model) => {
  if (process.env.NODE_ENV === 'test') return
  const data = loadDb()
  data[model] = (db[model] as ModelAPI<any, any>).getAll()
  window.localStorage.setItem('msw-db', JSON.stringify(data))
}

export const initializeDb = () => {
  const database = loadDb()
  Object.entries(db).forEach(([key, model]) => {
    const dataEntries = database[key]
    if (dataEntries) {
      dataEntries?.forEach((entry: Record<string, any>) => {
        model.create(entry)
      })
    }
  })
}

export const resetDb = () => {
  window.localStorage.clear()
}

initializeDb()
