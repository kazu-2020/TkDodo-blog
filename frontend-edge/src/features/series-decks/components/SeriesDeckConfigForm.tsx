import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { Button } from '@chakra-ui/react'

import { Deck } from '@/types/deck'
import FloatingLabelInput from '@/components/Form/FloatingLabelInput'

import { useUpdateSeriesDeck } from '../api/updateSeriesDeck'

type Inputs = {
  adminMemo: string
}

const SeriesDeckConfigForm = ({ deck }: { deck: Deck }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: deck?.adminMemo
    }
  })

  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await updateSeriesDeckMutation.mutateAsync({
      data: values,
      seriesDeckId: deck.id
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckConfigForm">
      <FloatingLabelInput
        id="adminMemo"
        label="管理メモ"
        error={errors?.adminMemo}
        register={register('adminMemo')}
        mb={10}
      />

      <Button
        mt={4}
        colorScheme="orange"
        loadingText="送信中"
        isLoading={isSubmitting}
        type="submit"
        bgColor="accent"
      >
        保存する
      </Button>
    </form>
  )
}
export default SeriesDeckConfigForm
