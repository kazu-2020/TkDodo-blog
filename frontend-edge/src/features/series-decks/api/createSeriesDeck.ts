import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type CreateSeriesDeckDTO = {
  data: {
    name: string
    interfix: string
    description?: string
    apiState: boolean
    playlists?: string[]
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
}: UseCreateSeriesDeckOptions = {}) => {
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
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
      toast({
        title: '新規作成に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries('series-decks')
      navigate(`/series-decks`)
      toast({
        title: '作成しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: createSeriesDeck
  })
}
