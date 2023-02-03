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
  VStack,
  useToast
} from '@chakra-ui/react'

import { usePrompt } from '@/utils/form-guard'
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
  const toast = useToast({
    position: 'top-right',
    isClosable: true
  })

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

  const { mutateAsync: updateRecommendDeckAsync } = useUpdateRecommendDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as RecommendDeckFormInputs

    try {
      await updateRecommendDeckAsync({
        data: { ...onlyDirtyValues, playlists: [], enableListUpdate: false },
        recommendDeckId: recommendDeck.deckUid
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
