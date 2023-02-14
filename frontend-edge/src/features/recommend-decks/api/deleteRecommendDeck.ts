import { useMutation } from '@tanstack/react-query'

import { RecommendDeck } from '@/types/recommend_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export const deleteRecommendDeck = ({
  recommendDeckId
}: {
  recommendDeckId: string
}) => axios.delete(`/decks/${recommendDeckId}`)

type UseDeleteRecommendDeckOptions = {
  config?: MutationConfig<typeof deleteRecommendDeck>
}

export const useDeleteRecommendDeck = ({
  config
}: UseDeleteRecommendDeckOptions = {}) =>
  useMutation({
    onMutate: async (deletedRecommendDeck) => {
      await queryClient.cancelQueries(['recommend-decks'])

      const previousRecommendDecks = queryClient.getQueryData<RecommendDeck[]>([
        'recommend-decks'
      ])

      queryClient.setQueryData(
        ['recommend-decks'],
        previousRecommendDecks?.filter(
          (recommendDeck) =>
            recommendDeck.id !== deletedRecommendDeck.recommendDeckId
        )
      )

      return { previousRecommendDecks }
    },
    onError: (_, __, context: any) => {
      if (context?.previousRecommendDecks) {
        queryClient.setQueryData(
          ['recommend-decks'],
          context.previousRecommendDecks
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recommend-decks'])
    },
    mutationFn: deleteRecommendDeck,
    ...config
  })
