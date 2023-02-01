import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { useToast } from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
import { SeriesDeck } from '@/types/series_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'

import { SeriesDeckFormInputs } from '../../types'
import { useUpdateSeriesDeck } from '../../api/updateSeriesDeck'
import { useCreateSeriesDeck } from '../../api/createSeriesDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

type Props = {
  seriesDeck?: SeriesDeck | undefined
}

// eslint-disable-next-line max-lines-per-function
export const SeriesDeckForm = ({ seriesDeck = undefined }: Props) => {
  const formMethods = useForm<SeriesDeckFormInputs>({
    defaultValues: {
      name: seriesDeck?.name,
      interfix: seriesDeck?.interfix,
      description: seriesDeck?.description,
      apiState: seriesDeck?.apiState === 'open',
      playlists: seriesDeck?.playlists
    },
    mode: 'onChange'
  })

  const toast = useToast({
    isClosable: true,
    position: 'top-right'
  })

  const { mutateAsync: createSeriesDeckAsync } = useCreateSeriesDeck()
  const { mutateAsync: updateSeriesDeckAsync } = useUpdateSeriesDeck()

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, isSubmitting }
  } = formMethods

  const createSeriesDeck = async (inputData: SeriesDeckFormInputs) => {
    const seriesIds =
      getValues('playlists')?.map((playlist) => playlist.seriesId) || []

    try {
      await createSeriesDeckAsync({
        data: {
          ...inputData,
          playlists: seriesIds
        }
      })
      toast({
        title: '作成しました。',
        status: 'success'
      })
    } catch {
      toast({
        title: '新規作成に失敗しました。',
        status: 'error'
      })
    }
  }

  const updateSeriesDeck = async (
    inputData: SeriesDeckFormInputs,
    seriesDeckId: string
  ) => {
    const seriesIds =
      getValues('playlists')?.map((playlist) => playlist.seriesId) || []
    try {
      await updateSeriesDeckAsync({
        data: {
          ...inputData,
          playlists: seriesIds,
          enableListUpdate: !!inputData.playlists
        },
        seriesDeckId
      })
      toast({
        title: '保存しました。',
        status: 'success'
      })
    } catch {
      toast({
        title: '保存に失敗しました。',
        status: 'error'
      })
    }
  }

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const onSubmit: SubmitHandler<SeriesDeckFormInputs> = (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as SeriesDeckFormInputs

    if (seriesDeck === undefined) {
      createSeriesDeck(values)
    } else {
      updateSeriesDeck(onlyDirtyValues, seriesDeck.deckUid)
    }
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool {...{ control }} />}
    </FormProvider>
  )
}
