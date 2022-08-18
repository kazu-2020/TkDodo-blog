import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { Button, Spacer, Text, VStack } from '@chakra-ui/react'

import { SeriesDeck } from '@/types/series_deck'
import { FloatingLabelInput } from '@/components/Form/FloatingLable'

import { useUpdateSeriesDeck } from '../api/updateSeriesDeck'
import ApiStateBadge from '@/components/ApiStateBadge'

type Inputs = {
  adminMemo: string
}

const SeriesDeckConfigForm = ({ seriesDeck }: { seriesDeck: SeriesDeck }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: seriesDeck?.adminMemo
    }
  })

  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await updateSeriesDeckMutation.mutateAsync({
      data: { ...values, enableListUpdate: false },
      seriesDeckId: seriesDeck.id
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckConfigForm">
      <VStack align="flex-start">
        <Text>公開状態</Text>
        <ApiStateBadge apiState={seriesDeck.apiState} />
        <Spacer py={2} />
        <FloatingLabelInput
          id="adminMemo"
          label="管理メモ"
          error={errors?.adminMemo}
          register={register('adminMemo')}
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
export default SeriesDeckConfigForm
