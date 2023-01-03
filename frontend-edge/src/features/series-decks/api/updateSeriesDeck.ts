import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

type SeriesDeckParams = {
  name?: string
  interfix?: string
  description?: string
  apiState?: boolean
  adminMemo?: string
  playlists?: string[]
  enableListUpdate: boolean
}

export type UpdateSeriesDeckDTO = {
  data: SeriesDeckParams
  seriesDeckId: string
}

const requestParams = (data: SeriesDeckParams) => {
  if (Object.hasOwn(data, 'apiState')) {
    const { apiState, ...params } = data
    return {
      series_deck: snakecaseKeys({
        ...params,
        apiState: data.apiState ? 'open' : 'close'
      }),
      enable_list_update: data.enableListUpdate
    }
  }

  return {
    series_deck: snakecaseKeys(data),
    enable_list_update: data.enableListUpdate
  }
}

export const updateSeriesDeck = async ({
  data,
  seriesDeckId
}: UpdateSeriesDeckDTO): Promise<SeriesDeck> => {
  const res = await axios.patch(
    `/series_decks/${seriesDeckId}`,
    requestParams(data)
  )

  return {
    ...res.data,
    // FIXME: レスポンスのidが数値になっていて、queryKeyに影響が出てしまうのでのでキャストしてる
    // ex. ['series-deck', 33] ['series-deck', "33"] は別のキャッシュとして扱われる
    id: `${res.data.id}`
  }
}

type UseUpdateSeriesDeckOptions = {
  config?: MutationConfig<typeof updateSeriesDeck>
}

export const useUpdateSeriesDeck = ({
  config
}: UseUpdateSeriesDeckOptions = {}) => {
  const toast = useToast()

  return useMutation({
    onMutate: async (updatingSeriesDeck) => {
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
          id: updatingSeriesDeck?.seriesDeckId
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
      toast({
        title: '保存に失敗しました。',
        status: 'error',
        isClosable: true,
        position: 'top-right'
      })
    },
    onSuccess: (data) => {
      queryClient.refetchQueries(['series-deck', data.id])
      toast({
        title: '保存しました。',
        status: 'success',
        isClosable: true,
        position: 'top-right'
      })
    },
    ...config,
    mutationFn: updateSeriesDeck
  })
}
