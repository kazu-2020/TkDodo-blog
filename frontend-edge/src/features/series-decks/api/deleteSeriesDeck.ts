import { useMutation } from '@tanstack/react-query'

import { SeriesDeck } from '@/types/series_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export const deleteSeriesDeck = async ({
  seriesDeckId
}: {
  seriesDeckId: string
}) => {
  await axios.delete(`/series_decks/${seriesDeckId}`)
}

type UseDeleteSeriesDeckOptions = {
  config?: MutationConfig<typeof deleteSeriesDeck>
}

export const useDeleteSeriesDeck = ({
  config
}: UseDeleteSeriesDeckOptions = {}) =>
  useMutation({
    onMutate: async (deletedSeriesDeck) => {
      await queryClient.cancelQueries(['series-decks'])

      const previousSeriesDecks = queryClient.getQueryData<SeriesDeck[]>([
        'series-decks'
      ])

      queryClient.setQueryData(
        ['series-decks'],
        previousSeriesDecks?.filter(
          (seriesDeck) => seriesDeck.id !== deletedSeriesDeck.seriesDeckId
        )
      )

      return { previousSeriesDecks }
    },
    onError: (_, __, context: any) => {
      if (context?.previousSeriesDecks) {
        queryClient.setQueryData(['series-decks'], context.previousSeriesDecks)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['series-decks'])
    },
    mutationFn: deleteSeriesDeck,
    ...config
  })
