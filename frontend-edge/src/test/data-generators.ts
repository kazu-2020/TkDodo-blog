// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker/locale/ja'

import { SeriesPlaylist } from '@/types/series_playlist'
import { SeriesDeck } from '@/types/series_deck'

type Overrides = Record<string, any>

export const seriesDeckGenerator = (overrides?: Overrides): SeriesDeck => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  interfix: faker.word.adjective(),
  stringId: faker.datatype.uuid(),
  adminMemo: faker.lorem.paragraph(),
  apiState: faker.helpers.arrayElement(['open', 'close', 'waiting']),
  playlists: [],
  playlistCount: faker.datatype.number(),
  dateCreated: faker.date.past().toISOString(),
  dateModified: faker.date.past().toISOString(),
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
