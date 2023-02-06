import { useNavigate } from 'react-router-dom'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { usePrompt } from '@/utils/form-guard'
import { SeriesDeck } from '@/types/series_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { useToastForCreation, useToastForUpdation } from '@/hooks/useToast'

import { SeriesDeckFormInputs } from '../../types'
import {
  useUpdateSeriesDeck,
  SeriesDeckParams as UpdateSeriesDeckParams
} from '../../api/updateSeriesDeck'
import {
  useCreateSeriesDeck,
  SeriesDeckParams as CreateSeriesDeckParams
} from '../../api/createSeriesDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

type SeriesDeckFormProps = {
  seriesDeck?: SeriesDeck | undefined
}

const useDispatchForm = () => {
  const creationToast = useToastForCreation()
  const updationToast = useToastForUpdation()

  const navigate = useNavigate()

  const { mutateAsync: createSeriesDeckAsync } = useCreateSeriesDeck()
  const { mutateAsync: updateSeriesDeckAsync } = useUpdateSeriesDeck()

  const createSeriesDeck = async (data: CreateSeriesDeckParams) => {
    try {
      await createSeriesDeckAsync({ data })
      navigate(`/series-decks`)
      creationToast.success()
    } catch {
      creationToast.fail()
    }
  }

  const updateSeriesDeck = async (
    seriesDeckId: string,
    data: UpdateSeriesDeckParams
  ) => {
    try {
      await updateSeriesDeckAsync({
        data,
        seriesDeckId
      })
      updationToast.success()
    } catch {
      updationToast.fail()
    }
  }

  return {
    createSeriesDeck,
    updateSeriesDeck
  }
}

export const SeriesDeckForm = ({
  seriesDeck = undefined
}: SeriesDeckFormProps) => {
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

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty, isSubmitting }
  } = formMethods

  const { createSeriesDeck, updateSeriesDeck } = useDispatchForm()

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const onSubmit: SubmitHandler<SeriesDeckFormInputs> = (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as SeriesDeckFormInputs
    const seriesIds =
      getValues('playlists')?.map((playlist) => playlist.seriesId) || []

    if (seriesDeck) {
      updateSeriesDeck(seriesDeck.deckUid, {
        ...onlyDirtyValues,
        playlists: seriesIds,
        enableListUpdate: !!onlyDirtyValues.playlists
      })
    } else {
      createSeriesDeck({ ...onlyDirtyValues, playlists: seriesIds })
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
