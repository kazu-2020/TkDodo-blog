// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker/locale/ja'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeck } from '@/types/series_deck'
import { RecommendDeck } from '@/types/recommend_deck'
import { Playlist } from '@/types/playlist'
import { Article } from '@/types/article'
import { PackageJson } from 'type-fest'
import { Organization } from '@/types/organization'
import { Person } from '@/types/person'
import { ImageRole } from '@/types/image_role'

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
  playlistUId: faker.datatype.uuid(),
  stringId: faker.datatype.uuid(),
  primaryId: faker.datatype.number(),
  name: faker.word.adjective(),
  detailedNameRuby: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  keywords: ['hoge', 'fuga', 'piyo'],
  detailedCatch: faker.lorem.paragraph(),
  hashtag: ['#hoge', '#fuga', '#piyo'],
  formatGenre: 'フォーマットジャンル',
  formatGenreName: 'フォーマットジャンル',
  themeGenre: 'テーマジャンル',
  themeGenreName: 'テーマジャンル',
  selectedPalette: faker.color.rgb(),
  primaryLight: faker.color.rgb(),
  primaryDark: faker.color.rgb(),
  textLight: faker.color.rgb(),
  textDark: faker.color.rgb(),
  linkLight: faker.color.rgb(),
  linkDark: faker.color.rgb(),
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
  article: {},
  videos: [],
  layoutPattern: faker.word.adjective(),
  publishLevel: faker.word.adjective(),
  dateCreated: faker.date.past().toDateString(),
  dateModified: faker.date.past().toDateString(),
  tvepisodeCount: faker.datatype.number(),
  ...overrides
})

export const articleGenerator = (overrides?: Overrides): Article => ({
  header: faker.word.adjective(),
  footer: faker.word.adjective(),
  plainBody: faker.lorem.paragraph(),
  markedBody: faker.helpers.maybe(() => faker.lorem.paragraph(), {
    probability: 0.5
  }),
  authorType: faker.helpers.arrayElement(['Person', 'Organization']),
  authorName: faker.word.adjective(),
  publisherType: faker.helpers.arrayElement(['Person', 'Organization']),
  publisherName: faker.word.adjective(),
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
