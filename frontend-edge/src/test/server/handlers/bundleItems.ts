import { rest } from 'msw'
import { faker } from '@faker-js/faker/locale/ja'

import { API_BASE_URL } from '@/config'

import { delayedResponse } from '../utils'

export const bundleItemsHandlers = [
  rest.get(
    `${API_BASE_URL}/playlists/:playlistUid/bundle_items`,
    (req, res, ctx) => {
      try {
        return delayedResponse(
          ctx.json({
            eventCount: faker.datatype.number(2),
            faqpageCount: faker.datatype.number(10),
            howtoCount: faker.datatype.number(10),
            recipeCount: faker.datatype.number(10),
            tvepisodeCount: faker.datatype.number(99)
          })
        )
      } catch (error: any) {
        return delayedResponse(
          ctx.status(400),
          ctx.json({ message: error?.message || 'Server Error' })
        )
      }
    }
  )
]
