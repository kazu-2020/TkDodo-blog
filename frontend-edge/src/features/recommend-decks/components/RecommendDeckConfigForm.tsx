import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { DevTool } from '@hookform/devtools'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react'

import { RecommendDeck } from '@/types/recommend_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
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
    formState: { errors, dirtyFields, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: recommendDeck?.adminMemo
    }
  })

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
          <FormControl id="adminMemo" isInvalid={!!errors?.adminMemo} mb={10}>
            <FormLabel>管理メモ</FormLabel>
            <Input
              data-testid="adminMemo"
              variant="flushed"
              {...register('adminMemo')}
            />
            {errors?.adminMemo && (
              <FormErrorMessage>{errors.adminMemo.message}</FormErrorMessage>
            )}
          </FormControl>
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
