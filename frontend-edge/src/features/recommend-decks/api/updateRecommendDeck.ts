import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { SameAs } from '@/types/same_as'
import { RecommendDeck } from '@/types/recommend_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

export type RecommendDeckParams = {
  name?: string
  interfix?: string
  description?: string
  apiState?: boolean
  adminMemo?: string
  deckSameAsAttributes?: SameAs[]
  playlists?: number[]
  enableListUpdate: boolean
}

export type UpdateRecommendDeckDTO = {
  data: RecommendDeckParams
  recommendDeckId: string
}

const requestParams = (data: RecommendDeckParams) => {
  if (Object.hasOwn(data, 'apiState')) {
    const { apiState, ...params } = data
    return {
      deck: snakecaseKeys(
        {
          ...params,
          apiState: data.apiState ? 'open' : 'close'
        },
        { exclude: ['_destroy'] }
      ),
      enable_list_update: data.enableListUpdate
    }
  }
  return {
    deck: snakecaseKeys(data),
    enable_list_update: data.enableListUpdate
  }
}

export const updateRecommendDeck = async ({
  data,
  recommendDeckId
}: UpdateRecommendDeckDTO): Promise<RecommendDeck> => {
  const res = await axios.patch(
    `/decks/${recommendDeckId}`,
    requestParams(data)
  )

  return {
    ...res.data,
    // FIXME: レスポンスのidが数値になっていて、queryKeyに影響が出てしまうのでのでキャストしてる
    // ex. ['recommend-deck', 33] ['recommend-deck', "33"] は別のキャッシュとして扱われる
    id: `${res.data.id}`
  }
}

type UseUpdateRecommendDeckOptions = {
  config?: MutationConfig<typeof updateRecommendDeck>
}

export const useUpdateRecommendDeck = ({
  config
}: UseUpdateRecommendDeckOptions = {}) =>
  useMutation({
    onMutate: async (updatingRecommendDeck) => {
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
          id: updatingRecommendDeck?.recommendDeckId
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
      queryClient.refetchQueries(['recommend-deck', data.id])
    },
    mutationFn: updateRecommendDeck,
    ...config
  })
