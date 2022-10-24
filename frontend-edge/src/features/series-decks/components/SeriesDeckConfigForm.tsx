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

import { usePrompt } from '@/utils/form-guard'
import { SeriesDeck } from '@/types/series_deck'
import { dirtyValues } from '@/lib/react-hook-form/utils'
import { SeriesDeckFormInputs } from '@/features/series-decks/types'
import ApiStateBadge from '@/components/ApiStateBadge'

import { useUpdateSeriesDeck } from '../api/updateSeriesDeck'

type Inputs = {
  adminMemo?: string
}

const SeriesDeckConfigForm = ({ seriesDeck }: { seriesDeck: SeriesDeck }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting, isDirty }
  } = useForm<Inputs>({
    defaultValues: {
      adminMemo: seriesDeck?.adminMemo
    }
  })

  usePrompt('編集中のデータがあります。ページを離れますか？', isDirty)

  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    const onlyDirtyValues = dirtyValues(
      dirtyFields,
      values
    ) as SeriesDeckFormInputs

    await updateSeriesDeckMutation.mutateAsync({
      data: { ...onlyDirtyValues, enableListUpdate: false },
      seriesDeckId: seriesDeck.id
    })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="seriesDeckConfigForm"
      >
        <VStack align="flex-start">
          <Text>公開状態</Text>
          <ApiStateBadge apiState={seriesDeck.apiState} />
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
export default SeriesDeckConfigForm
