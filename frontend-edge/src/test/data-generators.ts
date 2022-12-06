// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker/locale/ja'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeck } from '@/types/series_deck'
import { SeriesData } from '@/types/series_data'
import { RecommendDeck } from '@/types/recommend_deck'
import { Playlist } from '@/types/playlist'
import { Person } from '@/types/person'
import { Organization } from '@/types/organization'
import { EpisodeData, Genre } from '@/types/episode_data'
import {
  DetailedContent,
  DetailedContentStatus,
  VideoObjectIdentifierGroup
} from '@/types/video_object'

type Overrides = Record<string, any>

export const seriesDeckGenerator = (overrides?: Overrides): SeriesDeck => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  interfix: faker.word.adjective(),
  stringId: faker.datatype.uuid(),
  deckUid: faker.datatype.uuid(),
  adminMemo: faker.lorem.paragraph(),
  apiState: faker.helpers.arrayElement(['open', 'close', 'waiting']),
  playlists: [],
  playlistCount: faker.datatype.number(),
  dateCreated: faker.date.past().toISOString(),
  dateModified: faker.date.past().toISOString(),
  ...overrides
})

export const recommendDeckGenerator = (
  overrides?: Overrides
): RecommendDeck => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  interfix: faker.word.adjective(),
  stringId: faker.datatype.uuid(),
  deckUid: faker.datatype.uuid(),
  adminMemo: faker.lorem.paragraph(),
  apiState: faker.helpers.arrayElement(['open', 'close', 'waiting']),
  playlists: [],
  playListCount: faker.datatype.number(),
  dateCreated: faker.date.past().toISOString(),
  dateModified: faker.date.past().toISOString(),
  sameAs: [],
  ...overrides
})

export const seriesPlaylistGenerator = (
  overrides?: Overrides
): SeriesPlaylist => ({
  id: `${faker.datatype.number()}`,
  stringId: faker.datatype.uuid(),
  seriesId: faker.random.alphaNumeric(10),
  name: faker.word.adjective(),
  logo: {},
  videos: [],
  itemNum: faker.datatype.number(),
  howToCount: faker.datatype.number(),
  eventCount: faker.datatype.number(),
  faqPageCount: faker.datatype.number(),
  ...overrides
})

export const playlistGenerator = (overrides?: Overrides): Playlist => ({
  id: `${faker.datatype.number()}`,
  playlistUid: faker.datatype.uuid(),
  stringId: faker.datatype.uuid(),
  primaryId: faker.datatype.number(),
  name: faker.word.adjective(),
  detailedNameRuby: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  keywords: ['hoge', 'fuga', 'piyo'],
  detailedCatch: faker.lorem.paragraph(),
  hashtags: ['#hoge', '#fuga', '#piyo'],
  formatGenreCode: 'フォーマットジャンル',
  formatGenreName: 'フォーマットジャンル',
  themeGenreCode: 'テーマジャンル',
  themeGenreName: 'テーマジャンル',
  selectedPalette: faker.color.rgb(),
  primaryLightColor: faker.color.rgb(),
  primaryDarkColor: faker.color.rgb(),
  textLightColor: faker.color.rgb(),
  textDarkColor: faker.color.rgb(),
  linkLightColor: faker.color.rgb(),
  linkDarkColor: faker.color.rgb(),
  apiState: faker.word.adjective(),
  reservePublishTimeAt: faker.word.adjective(),
  reserveFinishTimeAt: faker.word.adjective(),
  logoImageData: faker.word.adjective(),
  eyecatchImageData: faker.word.adjective(),
  heroImageData: faker.word.adjective(),
  logo: {},
  eyecatch: {},
  hero: {},
  removeLogoImage: false,
  removeEyecatchImage: false,
  removeHeroImage: false,
  playableItemsCount: faker.datatype.number(),
  itemNum: faker.datatype.number(),
  howtoCount: faker.datatype.number(),
  eventCount: faker.datatype.number(),
  faqpageCount: faker.datatype.number(),
  hasHowTo: faker.datatype.boolean(),
  hasEvent: faker.datatype.boolean(),
  hasFaqPage: faker.datatype.boolean(),
  activeItemList: faker.datatype.boolean(),
  activeTvepisode: faker.datatype.boolean(),
  activeArticle: faker.datatype.boolean(),
  activeHowto: faker.datatype.boolean(),
  activeEvent: faker.datatype.boolean(),
  activeFaqpage: faker.datatype.boolean(),
  activeRecipe: faker.datatype.boolean(),
  items: [],
  sameAs: [],
  citations: [],
  aliasId: faker.word.adjective(),
  actor: [],
  contributor: [],
  markedHeader: faker.word.adjective(),
  markedFooter: faker.word.adjective(),
  articleBody: faker.lorem.paragraph(),
  markedBody: faker.helpers.maybe(() => faker.lorem.paragraph(), {
    probability: 0.5
  }),
  authorType: faker.helpers.arrayElement(['Person', 'Organization']),
  authorName: faker.word.adjective(),
  publisherType: faker.helpers.arrayElement(['Person', 'Organization']),
  publisherName: faker.word.adjective(),
  videos: [],
  layoutPattern: faker.word.adjective(),
  publishLevel: faker.word.adjective(),
  dateCreated: faker.date.past().toDateString(),
  dateModified: faker.date.past().toDateString(),
  tvepisodeCount: faker.datatype.number(),
  ...overrides
})

export const generatePlaylistDirtyFields = (overrides?: Overrides): any => ({
  name: false,
  detailedNameRuby: false,
  detailedCatch: false,
  description: false,
  keywords: [],
  hashtags: [],
  formatGenreCode: false,
  themeGenreCode: false,
  selectedPalette: false,
  primaryLightColor: false,
  primaryDarkColor: false,
  linkLightColor: false,
  linkDarkColor: false,
  aliasId: false,
  sameAsAttributes: [],
  citationsAttributes: [],
  apiState: false,
  logoImageSrc: false,
  eyecatchImageSrc: false,
  heroImageSrc: false,
  editorData: false,
  markedHeader: false,
  markedFooter: false,
  authorType: false,
  authorName: false,
  publisherName: false,
  publisherType: false,
  episodes: false,
  activeTvepisode: false,
  activeArticle: false,
  activeFaqpage: false,
  activeHowto: false,
  activeEvent: false,
  activeRecipe: false,
  activeItemList: false,
  ...overrides
})

export const rolePersonGenerator = (overrides?: Overrides): Person => ({
  additionalName: faker.word.adjective(),
  characterName: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  detailedAdditionalNameRuby: faker.word.adjective(),
  detailedCharacterCopy: faker.word.adjective(),
  detailedCharacterNameRuby: faker.word.adjective(),
  detailedFamilyNameRuby: faker.word.adjective(),
  detailedGivenNameRuby: faker.word.adjective(),
  detailedNameRuby: faker.word.adjective(),
  familyName: faker.word.adjective(),
  givenName: faker.word.adjective(),
  image: {},
  name: faker.word.adjective(),
  occupationName: faker.word.adjective(),
  roleName: faker.helpers.arrayElement([
    'author',
    'copyrightHolder',
    'creator',
    'producer',
    'publisher',
    'funder',
    'sponsor',
    'translator',
    'character',
    'editor',
    'director',
    'musicBy',
    'actor'
  ]),
  ...overrides
})

export const roleOrganizationGenerator = (
  overrides?: Overrides
): Organization => ({
  description: faker.word.adjective(),
  detailedNameRuby: faker.word.adjective(),
  image: {},
  name: faker.word.adjective(),
  roleName: faker.helpers.arrayElement([
    'author',
    'copyrightHolder',
    'creator',
    'producer',
    'publisher',
    'funder',
    'sponsor',
    'translator',
    'character',
    'editor',
    'director',
    'musicBy',
    'actor'
  ]),
  ...overrides
})

export const episodeDataGenerator = (overrides?: Overrides): EpisodeData => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  url: faker.internet.url(),
  eyecatch: {},
  keyvisuals: [],
  identifierGroup: {
    shortenedDisplayName: faker.word.adjective(),
    formatGenre: [],
    themeGenre: [],
    formatGenreTag: [],
    themeGenreTag: [],
    genres: []
  },
  partOfSeries: {
    name: faker.word.adjective(),
    eyecatch: {},
    logo: {},
    identifierGroup: {
      shortenedDisplayName: faker.word.adjective()
    }
  },
  releasedEvent: undefined,
  detailedRecentEvent: undefined,
  videos: [],
  broadcastEvent: [],
  actors: [],
  contributors: [],
  ...overrides
})

export const genreGenerator = (overrides?: Overrides): Genre => ({
  id: faker.datatype.number(),
  name1: faker.word.adjective(),
  name2: faker.word.adjective(),
  ...overrides
})

export const seriesDataGenerator = (overrides?: Overrides): SeriesData => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  logo: undefined,
  eyecatch: undefined,
  hero: undefined,
  keyvisuals: undefined,
  partOfSeries: undefined,
  availableEpisodes: undefined,
  videos: [],
  episodes: {
    count: faker.datatype.number(),
    result: [],
    nextUrl: faker.internet.url(),
    resultUrl: faker.internet.url()
  },
  ...overrides
})

export const generateRecommendDeckDirtyFields = (
  overrides?: Overrides
): any => ({
  name: false,
  interfix: false,
  description: false,
  apiState: false,
  deckSameAsAttributes: [],
  playlists: false,
  ...overrides
})

export const generateSeriesDeckDirtyFields = (overrides?: Overrides): any => ({
  name: false,
  interfix: false,
  description: false,
  apiState: false,
  playlists: false,
  ...overrides
})

export const videoGenerator = (overrides?: Overrides): any => ({
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  caption: faker.word.adjective(),
  url: faker.internet.url(),
  embedUrl: faker.internet.url(),
  identifierGroup: {
    environmentId: faker.word.adjective(),
    broadcastEventId: undefined,
    streamType: faker.word.adjective()
  },
  detailedContentStatus: {
    environmentId: faker.word.adjective(),
    streamType: faker.word.adjective(),
    contentStatus: faker.word.adjective()
  },
  detailedContent: undefined,
  sprite: undefined,
  expires: undefined,
  thumbnailUrl: undefined,
  broadcastEvent: undefined,
  ...overrides
})
