import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React, { useEffect } from 'react'
import { DevTool } from '@hookform/devtools'

import { usePrompt } from '@/utils/form-guard'
import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'

import { RecommendDeckFormInputs } from '../../types'
import { useUpdateRecommendDeck } from '../../api/updateRecommendDeck'
import { useCreateRecommendDeck } from '../../api/createRecommendDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

const useRecommendForm = (recommendDeck: RecommendDeck | undefined) =>
  useForm<RecommendDeckFormInputs>({
    defaultValues: {
      name: recommendDeck?.name,
      interfix: recommendDeck?.interfix,
      description: recommendDeck?.description,
      apiState: recommendDeck?.apiState === 'open',
      deckSameAsAttributes: recommendDeck?.sameAs
    },
    mode: 'onChange'
  })

type Props = {
  recommendDeck?: RecommendDeck | undefined
}

export const RecommendDeckForm = ({ recommendDeck = undefined }: Props) => {
  const formMethods = useRecommendForm(recommendDeck)
  const {
    control,
    getValues,
    handleSubmit,
    trigger,
    reset,
    formState: { dirtyFields, isDirty }
  } = formMethods

  const {
    setInputValues,
    recommendPlaylists,
    setRecommendPlaylists,
    hasChangedRecommendPlaylists,
    resetHasChangedRecommendPlaylists
  } = useRecommendDeckFormStore((state) => ({
    setInputValues: state.setInputValues,
    recommendPlaylists: state.recommendPlaylists,
    setRecommendPlaylists: state.setRecommendPlaylists,
    hasChangedRecommendPlaylists: state.hasChangedRecommendPlaylists,
    resetHasChangedRecommendPlaylists: state.resetHasChangedRecommendPlaylists
  }))

  useEffect(() => {
    setRecommendPlaylists(recommendDeck?.playlists || [])
    setInputValues(getValues())
    trigger()
  }, [recommendDeck, setRecommendPlaylists, setInputValues, getValues, trigger])

  usePrompt('編集中のデータがあります。ページを離れますか？', isDirty)

  const createRecommendDeckMutation = useCreateRecommendDeck()
  const updateRecommendDeckMutation = useUpdateRecommendDeck()

  const onSubmit: SubmitHandler<RecommendDeckFormInputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs

    const recommendIds = recommendPlaylists.map(
      (playlist) => playlist.primaryId
    )

    if (recommendDeck === undefined) {
      await createRecommendDeckMutation.mutateAsync({
        data: {
          ...onlyDirtyValues,
          playlists: recommendIds
        }
      })
    } else {
      await updateRecommendDeckMutation.mutateAsync({
        data: {
          ...onlyDirtyValues,
          playlists: recommendIds,
          enableListUpdate: hasChangedRecommendPlaylists
        },
        recommendDeckId: recommendDeck.id
      })
    }
    resetHasChangedRecommendPlaylists()
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="recommendDeckForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool control={control} />}
    </FormProvider>
  )
}
