import { useMutation } from 'react-query'

import { Deck as SeriesDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type CreateSeriesDeckDTO = {
  data: {
    title: string
    body: string
  }
}

export const createSeriesDeck = ({
  data
}: CreateSeriesDeckDTO): Promise<SeriesDeck> =>
  axios.post(`/series_decks`, data)

type UseCreateSeriesDeckOptions = {
  config?: MutationConfig<typeof createSeriesDeck>
}

export const useCreateSeriesDeck = ({
  config
}: UseCreateSeriesDeckOptions = {}) =>
  useMutation({
    onMutate: async (newSeriesDeck) => {
      await queryClient.cancelQueries('series-decks')

      const previousSeriesDecks =
        queryClient.getQueryData<SeriesDeck[]>('series-decks')

      queryClient.setQueryData('series-decks', [
        ...(previousSeriesDecks || []),
        newSeriesDeck.data
      ])

      return { previousSeriesDecks }
    },
    onError: (_, __, context: any) => {
      if (context?.previousSeriesDecks) {
        queryClient.setQueryData('series-decks', context.previousSeriesDecks)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('series-decks')
    },
    ...config,
    mutationFn: createSeriesDeck
  })
