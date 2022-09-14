import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import { DevTool } from '@hookform/devtools'

import { SeriesDeck } from '@/types/series_deck'
import { useSeriesDeckFormStore } from '@/features/series-decks/stores/seriesDeckForm'

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
      apiState: seriesDeck?.apiState === 'open'
    },
    mode: 'onChange'
  })

type Props = {
  seriesDeck?: SeriesDeck | undefined
}

export const SeriesDeckForm = ({ seriesDeck = undefined }: Props) => {
  const formMethods = useSeriesForm(seriesDeck)
  const { control, getValues, handleSubmit, trigger, reset } = formMethods

  const {
    setInputValues,
    seriesPlaylists,
    setSeriesPlaylists,
    hasChangedSeriesPlaylists,
    resetHasChangedSeriesPlaylists
  } = useSeriesDeckFormStore((state) => ({
    setInputValues: state.setInputValues,
    seriesPlaylists: state.seriesPlaylists,
    setSeriesPlaylists: state.setSeriesPlaylists,
    hasChangedSeriesPlaylists: state.hasChangedSeriesPlaylists,
    resetHasChangedSeriesPlaylists: state.resetHasChangedSeriesPlaylists
  }))

  useEffect(() => {
    setSeriesPlaylists(seriesDeck?.playlists || [])
    setInputValues(getValues())
    trigger()
  }, [seriesDeck, setSeriesPlaylists, setInputValues, getValues, trigger])

  const createSeriesDeckMutation = useCreateSeriesDeck()
  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<SeriesDeckFormInputs> = async (values) => {
    const seriesIds = seriesPlaylists.map((playlist) => playlist.seriesId)

    if (seriesDeck === undefined) {
      await createSeriesDeckMutation.mutateAsync({
        data: { ...values, playlists: seriesIds }
      })
    } else {
      await updateSeriesDeckMutation.mutateAsync({
        data: {
          ...values,
          playlists: seriesIds,
          enableListUpdate: hasChangedSeriesPlaylists
        },
        seriesDeckId: seriesDeck.id
      })
    }
    resetHasChangedSeriesPlaylists()
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.DEV && <DevTool control={control} />}
    </FormProvider>
  )
}
