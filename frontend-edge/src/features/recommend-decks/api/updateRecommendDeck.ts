import snakecaseKeys from 'snakecase-keys'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'

import { SameAs } from '@/types/same_as'
import { RecommendDeck } from '@/types/recommend_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

type RecommendDeckParams = {
  name?: string
  interfix?: string
  description?: string
  apiState?: boolean
  adminMemo?: string
  deckSameAsAttributes?: SameAs[]
  playlists?: string[]
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
      deck: snakecaseKeys({
        ...params,
        apiState: data.apiState ? 'open' : 'close'
      }),
      enable_list_update: data.enableListUpdate ? '1' : ''
    }
  }

  return { deck: snakecaseKeys(data) }
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
    ...res.data.deck,
    // FIXME: レスポンスのidが数値になっていて、queryKeyに影響が出てしまうのでのでキャストしてる
    // ex. ['recommend-deck', 33] ['recommend-deck', "33"] は別のキャッシュとして扱われる
    id: `${res.data.deck.id}`
  }
}

type UseUpdateRecommendDeckOptions = {
  config?: MutationConfig<typeof updateRecommendDeck>
}

export const useUpdateRecommendDeck = ({
  config
}: UseUpdateRecommendDeckOptions = {}) => {
  const toast = useToast()

  return useMutation({
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
      toast({
        title: '保存に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['recommend-deck', data.id])
      toast({
        title: '保存しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: updateRecommendDeck
  })
}
