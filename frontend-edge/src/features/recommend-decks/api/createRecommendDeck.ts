import snakecaseKeys from 'snakecase-keys'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { SameAs } from '@/types/same_as'
import { Deck as RecommendDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

type RecommendDeckParams = {
  name?: string
  interfix?: string
  description?: string
  apiState?: boolean
  deckSameAsAttributes?: SameAs[]
  playlists?: number[]
}

export type CreateRecommendDeckDTO = {
  data: RecommendDeckParams
}

const requestParams = (data: RecommendDeckParams) => {
  if (Object.hasOwn(data, 'apiState')) {
    const { apiState, ...params } = data
    return {
      deck: snakecaseKeys({
        ...params,
        apiState: data.apiState ? 'open' : 'close'
      })
    }
  }

  return { deck: snakecaseKeys(data) }
}

export const createRecommendDeck = ({
  data
}: CreateRecommendDeckDTO): Promise<RecommendDeck> =>
  axios.post(`/decks`, requestParams(data))

type UseCreateRecommendDeckOptions = {
  config?: MutationConfig<typeof createRecommendDeck>
}

export const useCreateRecommendDeck = ({
  config
}: UseCreateRecommendDeckOptions = {}) => {
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    onMutate: async (newRecommendDeck) => {
      await queryClient.cancelQueries('recommend-decks')

      const previousRecommendDecks =
        queryClient.getQueryData<RecommendDeck[]>('recommend-decks')

      queryClient.setQueryData('recommend-decks', [
        ...(previousRecommendDecks || []),
        newRecommendDeck.data
      ])

      return { previousRecommendDecks }
    },
    onError: (_, __, context: any) => {
      if (context?.previousRecommendDecks) {
        queryClient.setQueryData(
          'recommend-decks',
          context.previousRecommendDecks
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('recommend-decks')
      navigate('/recommend-decks')
      toast({
        title: '作成しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: createRecommendDeck
  })
}
