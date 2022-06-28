import { useMutation } from 'react-query'

import { Deck as SeriesDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type UpdateSeriesDeckDTO = {
  data: {
    title: string
    body: string
  }
  seriesDeckId: string
}

export const updateSeriesDeck = ({
  data,
  seriesDeckId
}: UpdateSeriesDeckDTO): Promise<SeriesDeck> =>
  axios.patch(`/series_decks/${seriesDeckId}`, data)

type UseUpdateSeriesDeckOptions = {
  config?: MutationConfig<typeof updateSeriesDeck>
}

export const useUpdateSeriesDeck = ({
  config
}: UseUpdateSeriesDeckOptions = {}) =>
  useMutation({
    onMutate: async (updatingSeriesDeck: any) => {
      await queryClient.cancelQueries([
        'series-deck',
        updatingSeriesDeck?.seriesDeckId
      ])

      const previousSeriesDeck = queryClient.getQueryData<SeriesDeck>([
        'series-deck',
        updatingSeriesDeck?.seriesDeckId
      ])

      queryClient.setQueryData(
        ['series-deck', updatingSeriesDeck?.seriesDeckId],
        {
          ...previousSeriesDeck,
          ...updatingSeriesDeck.data,
          id: updatingSeriesDeck.seriesDeckId
        }
      )

      return { previousSeriesDeck }
    },
    onError: (_, __, context: any) => {
      if (context?.previousSeriesDeck) {
        queryClient.setQueryData(
          ['series-deck', context.previousSeriesDeck.id],
          context.previousSeriesDeck
        )
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['discussion', data.id])
    },
    ...config,
    mutationFn: updateSeriesDeck
  })
