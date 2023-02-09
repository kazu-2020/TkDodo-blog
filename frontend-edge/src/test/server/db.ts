import { ModelAPI } from '@mswjs/data/lib/glossary'
import { factory, nullable, primaryKey } from '@mswjs/data'

const models = {
  seriesDeck: {
    id: primaryKey(String),
    name: String,
    interfix: String,
    description: String,
    apiState: String,
    stringId: String,
    adminMemo: String
  },
  recommendDeck: {
    id: primaryKey(String),
    name: String,
    interfix: String,
    description: String,
    apiState: String,
    stringId: String,
    adminMemo: String,
    sameAs: Array,
    playlists: Array
  },
  seriesPlaylist: {
    id: primaryKey(String),
    stringId: String,
    seriesId: String,
    name: String,
    logo: String,
    videos: String,
    itemNum: Number,
    howToCount: Number,
    eventCount: Number,
    faqPageCount: Number
  },
  playlist: {
    id: primaryKey(String),
    playlistUid: String,
    stringId: String,
    primaryId: Number,
    name: String,
    detailedNameRuby: String,
    description: String,
    keywords: Array,
    detailedCatch: String,
    hashtags: Array,
    formatGenreCode: String,
    formatGenreName: String,
    themeGenreCode: String,
    themeGenreName: String,
    selectedPalette: String,
    primaryLightColor: String,
    primaryDarkColor: String,
    textLightColor: String,
    textDarkColor: String,
    linkLightColor: String,
    linkDarkColor: String,
    apiState: String,
    reservePublishTimeAt: String,
    reserveFinishTimeAt: String,
    logoImageData: String,
    eyecatchImageData: String,
    heroImageData: String,
    logo: Object,
    eyecatch: Object,
    hero: Object,
    removeLogoImage: Boolean,
    removeEyecatchImage: Boolean,
    removeHeroImage: Boolean,
    playableItemsCount: Number,
    itemNum: Number,
    howToCount: Number,
    eventCount: Number,
    faqPageCount: Number,
    hasHowTo: Boolean,
    hasEvent: Boolean,
    hasFaqPage: Boolean,
    activeItemList: Boolean,
    activeEpisode: Boolean,
    activeArticle: Boolean,
    activeHowTo: Boolean,
    activeEvent: Boolean,
    activeFaqPage: Boolean,
    items: Array,
    sameAs: Array,
    citations: Array,
    aliasId: String,
    actor: Array,
    contributor: Array,
    markedHeader: String,
    // body?: OutputData,
    markedFooter: String,
    articleBody: String,
    markedBody: String,
    authorType: String,
    authorName: String,
    publisherType: String,
    publisherName: String,
    // containsEpisodes?: Array<EpisodeData>},
    layoutPattern: String,
    publishLevel: String,
    dateCreated: String,
    dateModified: String
  },
  announcement: {
    id: primaryKey(Number),
    status: String,
    contents: String,
    dateCreated: String
  },
  user: {
    id: primaryKey(Number),
    firstName: nullable(String),
    lastName: nullable(String),
    email: String,
    jobClass: nullable(String),
    systemRoles: Array,
    invitedAt: nullable(String),
    loggedInAt: nullable(String)
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
