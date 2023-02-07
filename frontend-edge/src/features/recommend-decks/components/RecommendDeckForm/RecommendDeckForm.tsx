import { useNavigate } from 'react-router-dom'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'

import { usePrompt } from '@/utils/form-guard'
import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { useToastForCreation, useToastForUpdation } from '@/hooks/useToast'

import { RecommendDeckFormInputs } from '../../types'
import {
  useUpdateRecommendDeck,
  RecommendDeckParams as UpdateRecommendDeckParams
} from '../../api/updateRecommendDeck'
import {
  RecommendDeckParams as CreateRecommendDeckParams,
  useCreateRecommendDeck
} from '../../api/createRecommendDeck'

import { ArrowStepContainer } from './ArrowStepContainer'

type RecommendDeckFormProps = {
  recommendDeck?: RecommendDeck
}

const useDispatchFormData = () => {
  const creationToast = useToastForCreation()
  const updataionToast = useToastForUpdation()
  const navigate = useNavigate()

  const { mutateAsync: createRecommendDeckAsync } = useCreateRecommendDeck()
  const { mutateAsync: updateRecommendDeckAsync } = useUpdateRecommendDeck()

  const createRecommendDeck = (data: CreateRecommendDeckParams) => {
    createRecommendDeckAsync(
      { data },
      {
        onSuccess: () => {
          navigate('/recommend-decks')
        },
        onError: () => {
          creationToast.fail()
        }
      }
    )
  }

  const updateRecommendDeck = (
    recommendDeckId: string,
    data: UpdateRecommendDeckParams
  ) => {
    updateRecommendDeckAsync(
      {
        data,
        recommendDeckId
      },
      {
        onSuccess: () => {
          updataionToast.success()
        },
        onError: () => {
          updataionToast.fail()
        }
      }
    )
  }

  return {
    createRecommendDeck,
    updateRecommendDeck
  }
}

export const RecommendDeckForm = ({
  recommendDeck = undefined
}: RecommendDeckFormProps) => {
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

  const { createRecommendDeck, updateRecommendDeck } = useDispatchFormData()

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const onSubmit: SubmitHandler<RecommendDeckFormInputs> = (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs
    const recommendIds =
      getValues('playlists')?.map((playlist) => playlist.primaryId) || []
    if (recommendDeck) {
      updateRecommendDeck(recommendDeck.deckUid, {
        ...onlyDirtyValues,
        playlists: recommendIds,
        enableListUpdate: !!onlyDirtyValues.playlists
      })
    } else {
      createRecommendDeck({ ...onlyDirtyValues, playlists: recommendIds })
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
