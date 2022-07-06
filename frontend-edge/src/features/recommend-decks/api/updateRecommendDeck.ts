import { useMutation } from 'react-query'

import { Deck as RecommendDeck } from '@/types/deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type UpdateRecommendDeckDTO = {
  data: {
    title: string
    body: string
  }
  recommendDeckId: string
}

export const updateRecommendDeck = ({
  data,
  recommendDeckId
}: UpdateRecommendDeckDTO): Promise<RecommendDeck> =>
  axios.patch(`/recommend_decks/${recommendDeckId}`, data)

type UseUpdateRecommendDeckOptions = {
  config?: MutationConfig<typeof updateRecommendDeck>
}

export const useUpdateRecommendDeck = ({
  config
}: UseUpdateRecommendDeckOptions = {}) =>
  useMutation({
    onMutate: async (updatingRecommendDeck: any) => {
      await queryClient.cancelQueries([
        'recommend-deck',
        updatingRecommendDeck?.recommendDeckId
      ])

      const previousRecommendDeck = queryClient.getQueryData<RecommendDeck>([
        'recommend-deck',
        updatingRecommendDeck?.recommendDeckId
      ])

      queryClient.setQueryData(
        ['recommend-deck', updatingRecommendDeck?.recommendDeckId],
        {
          ...previousRecommendDeck,
          ...updatingRecommendDeck.data,
          id: updatingRecommendDeck.recommendDeckId
        }
      )

      return { previousRecommendDeck }
    },
    onError: (_, __, context: any) => {
      if (context?.previousRecommendDeck) {
        queryClient.setQueryData(
          ['recommend-deck', context.previousRecommendDeck.id],
          context.previousRecommendDeck
        )
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['discussion', data.id])
    },
    ...config,
    mutationFn: updateRecommendDeck
  })
