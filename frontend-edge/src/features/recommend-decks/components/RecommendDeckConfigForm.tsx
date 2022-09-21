import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { Button, Spacer, Text, VStack } from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import { setUndefinedOrString } from '@/lib/react-hook-form/utils'
import { FloatingLabelInput } from '@/components/Form/FloatingLable'
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: recommendDeck?.adminMemo
    }
  })

  const updateRecommendDeckMutation = useUpdateRecommendDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await updateRecommendDeckMutation.mutateAsync({
      data: { ...values, enableListUpdate: false },
      recommendDeckId: recommendDeck.id
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      data-testid="recommendDeckConfigForm"
    >
      <VStack align="flex-start">
        <Text>公開状態</Text>
        <ApiStateBadge apiState={recommendDeck.apiState} />
        <Spacer py={2} />
        <FloatingLabelInput
          id="adminMemo"
          label="管理メモ"
          error={errors?.adminMemo}
          register={register('adminMemo', {
            setValueAs: setUndefinedOrString
          })}
          mb={10}
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
  )
}
export default RecommendDeckConfigForm
