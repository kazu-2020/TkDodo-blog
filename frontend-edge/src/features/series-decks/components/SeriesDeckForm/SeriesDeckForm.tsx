import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'

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
  const { getValues, handleSubmit, trigger } = formMethods

  const {
    setInputValues,
    seriesPlaylists,
    setSeriesPlaylists,
    hasChangedSeriesPlaylists
  } = useSeriesDeckFormStore((state) => ({
    setInputValues: state.setInputValues,
    seriesPlaylists: state.seriesPlaylists,
    setSeriesPlaylists: state.setSeriesPlaylists,
    hasChangedSeriesPlaylists: state.hasChangedSeriesPlaylists
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
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckForm">
        <ArrowStepContainer />
      </form>
    </FormProvider>
  )
}
