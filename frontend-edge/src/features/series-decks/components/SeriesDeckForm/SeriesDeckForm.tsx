import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'

import { usePrompt } from '@/utils/form-guard'
import { SeriesDeck } from '@/types/series_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'

import { SeriesDeckFormInputs } from '../../types'
import { useUpdateSeriesDeck } from '../../api/updateSeriesDeck'
import { useCreateSeriesDeck } from '../../api/createSeriesDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

const useSeriesForm = (seriesDeck: SeriesDeck | undefined) =>
  useForm<SeriesDeckFormInputs>({
    defaultValues: {
      name: seriesDeck?.name,
      interfix: seriesDeck?.interfix,
      description: seriesDeck?.description,
      apiState: seriesDeck?.apiState === 'open',
      playlists: seriesDeck?.playlists
    },
    mode: 'onChange'
  })

type Props = {
  seriesDeck?: SeriesDeck | undefined
}

export const SeriesDeckForm = ({ seriesDeck = undefined }: Props) => {
  const formMethods = useSeriesForm(seriesDeck)
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, isSubmitting }
  } = formMethods

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const createSeriesDeckMutation = useCreateSeriesDeck()
  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<SeriesDeckFormInputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as SeriesDeckFormInputs
    const seriesIds =
      getValues('playlists')?.map((playlist) => playlist.seriesId) || []

    if (seriesDeck === undefined) {
      await createSeriesDeckMutation.mutateAsync({
        data: {
          ...onlyDirtyValues,
          playlists: seriesIds
        }
      })
    } else {
      await updateSeriesDeckMutation.mutateAsync({
        data: {
          ...onlyDirtyValues,
          playlists: seriesIds,
          enableListUpdate: !!onlyDirtyValues.playlists
        },
        seriesDeckId: seriesDeck.deckUid
      })
    }

    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool control={control} />}
    </FormProvider>
  )
}
