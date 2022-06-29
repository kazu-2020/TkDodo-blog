import { useMutation } from 'react-query'

import { Deck as RecommendDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type CreateRecommendDeckDTO = {
  data: {
    title: string
    body: string
  }
}

export const createRecommendDeck = ({
  data
}: CreateRecommendDeckDTO): Promise<RecommendDeck> =>
  axios.post(`/recommend_decks`, data)

type UseCreateRecommendDeckOptions = {
  config?: MutationConfig<typeof createRecommendDeck>
}

export const useCreateRecommendDeck = ({
  config
}: UseCreateRecommendDeckOptions = {}) =>
  useMutation({
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
    },
    ...config,
    mutationFn: createRecommendDeck
  })
