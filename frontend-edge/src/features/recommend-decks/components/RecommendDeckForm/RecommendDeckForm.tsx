/* eslint-disable max-statements */
import { useNavigate } from 'react-router-dom'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'
import { useToast } from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'

import { RecommendDeckFormInputs } from '../../types'
import { useUpdateRecommendDeck } from '../../api/updateRecommendDeck'
import { useCreateRecommendDeck } from '../../api/createRecommendDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

type Props = {
  recommendDeck?: RecommendDeck | undefined
}

// eslint-disable-next-line max-lines-per-function
export const RecommendDeckForm = ({ recommendDeck = undefined }: Props) => {
  const toast = useToast({
    position: 'top-right',
    isClosable: true
  })
  const navigate = useNavigate()

  const formMethods = useForm<RecommendDeckFormInputs>({
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

  const { mutateAsync: createRecommendDeckAsync } = useCreateRecommendDeck()
  const { mutateAsync: updateRecommendDeckAsync } = useUpdateRecommendDeck()

  const createRecommendDeck = async (inputData: RecommendDeckFormInputs) => {
    const recommendIds =
      getValues('playlists')?.map((playlist) => playlist.primaryId) || []
    try {
      await createRecommendDeckAsync({
        data: {
          ...inputData,
          playlists: recommendIds
        }
      })
      navigate('/recommend-decks')
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

  const updateRecommendDeck = async (
    inputData: RecommendDeckFormInputs,
    recommendDeckId: string
  ) => {
    const recommendIds =
      getValues('playlists')?.map((playlist) => playlist.primaryId) || []
    try {
      await updateRecommendDeckAsync({
        data: {
          ...inputData,
          playlists: recommendIds,
          enableListUpdate: !!inputData.playlists
        },
        recommendDeckId
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

  const onSubmit: SubmitHandler<RecommendDeckFormInputs> = (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs

    if (recommendDeck === undefined) {
      createRecommendDeck(onlyDirtyValues)
    } else {
      updateRecommendDeck(onlyDirtyValues, recommendDeck.deckUid)
    }
    reset(values)
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="recommendDeckForm">
        <ArrowStepContainer />
      </form>
      {import.meta.env.MODE === 'development' && <DevTool {...{ control }} />}
    </FormProvider>
  )
}
