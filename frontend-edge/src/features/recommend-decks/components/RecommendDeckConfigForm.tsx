import { useForm, SubmitHandler } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import {
  Button,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { PropertyInput } from '@/components/Form'
import ApiStateBadge from '@/components/ApiStateBadge'

import { useUpdateRecommendDeck } from '../api/updateRecommendDeck'

type Inputs = {
  adminMemo?: string
}

const RecommendDeckConfigForm = ({
  recommendDeck
}: {
  recommendDeck: RecommendDeck
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting, isDirty }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: recommendDeck?.adminMemo
    }
  })

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  const updateRecommendDeckMutation = useUpdateRecommendDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs

    await updateRecommendDeckMutation.mutateAsync({
      data: { ...onlyDirtyValues, playlists: [], enableListUpdate: false },
      recommendDeckId: recommendDeck.deckUid
    })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="recommendDeckConfigForm"
      >
        <VStack align="flex-start">
          <Text>公開状態</Text>
          <ApiStateBadge apiState={recommendDeck.apiState} />
          <Spacer py={2} />
          <PropertyInput
            label="管理メモ"
            register={register('adminMemo')}
            error={errors.adminMemo}
          />
        </VStack>

        <Button
          mt={4}
          colorScheme="orange"
          loadingText="送信中"
          isLoading={isSubmitting}
          type="submit"
          bgColor="accent"
          size="lg"
        >
          保存する
        </Button>
      </form>

      {import.meta.env.MODE === 'development' && <DevTool control={control} />}
    </>
  )
}
export default RecommendDeckConfigForm
