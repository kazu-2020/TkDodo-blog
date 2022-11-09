import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'

import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'

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
      deckSameAsAttributes: recommendDeck?.sameAs,
      playlists: recommendDeck?.playlists
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
    reset,
    formState: { dirtyFields }
  } = formMethods

  const createRecommendDeckMutation = useCreateRecommendDeck()
  const updateRecommendDeckMutation = useUpdateRecommendDeck()

  const onSubmit: SubmitHandler<RecommendDeckFormInputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs

    const recommendIds =
      getValues('playlists')?.map((playlist) => playlist.primaryId) || []
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
          enableListUpdate: !!onlyDirtyValues.playlists
        },
        recommendDeckId: recommendDeck.deckUid
      })
    }
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
