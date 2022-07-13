// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker/locale/ja'

import { Deck } from '@/types/deck'

type Overrides = Record<string, any>

export const seriesDeckGenerator = (overrides?: Overrides): Deck => ({
  id: `${faker.datatype.number()}`,
  name: faker.word.adjective(),
  description: faker.lorem.paragraph(),
  interfix: faker.word.adjective(),
  stringId: faker.datatype.uuid(),
  adminMemo: faker.lorem.paragraph(),
  apiState: faker.helpers.arrayElement(['open', 'close', 'waiting']),
  sameAs: [],
  playlists: [],
  ...overrides
})
