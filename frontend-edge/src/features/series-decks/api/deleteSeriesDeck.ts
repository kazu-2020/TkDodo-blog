import { useMutation } from 'react-query'

import { Deck as SeriesDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export const deleteSeriesDeck = ({ seriesDeckId }: { seriesDeckId: string }) =>
  axios.delete(`/series-decks/${seriesDeckId}`)

type UseDeleteSeriesDeckOptions = {
  config?: MutationConfig<typeof deleteSeriesDeck>
}

export const useDeleteSeriesDeck = ({
  config
}: UseDeleteSeriesDeckOptions = {}) =>
  useMutation({
    onMutate: async (deletedSeriesDeck) => {
      await queryClient.cancelQueries('series-decks')

      const previousSeriesDecks =
        queryClient.getQueryData<SeriesDeck[]>('series-decks')

      queryClient.setQueryData(
        'series-decks',
        previousSeriesDecks?.filter(
          (seriesDeck) => seriesDeck.id !== deletedSeriesDeck.seriesDeckId
        )
      )

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
    mutationFn: deleteSeriesDeck
  })
