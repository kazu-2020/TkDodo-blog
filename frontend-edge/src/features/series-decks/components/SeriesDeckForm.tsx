import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import { FormControl, Text, Checkbox, Button, HStack } from '@chakra-ui/react'

import { Deck } from '@/types/deck'
import FloatingLabelTextarea from '@/components/Form/FloatingLabelTextarea'
import FloatingLabelInput from '@/components/Form/FloatingLabelInput'

import { useUpdateSeriesDeck } from '../api/updateSeriesDeck'
import { useCreateSeriesDeck } from '../api/createSeriesDeck'

type Inputs = {
  name: string
  interfix: string
  description: string
  apiState: boolean
}

const SeriesDeckForm = ({ deck = undefined }: { deck?: Deck | undefined }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      name: deck?.name,
      interfix: deck?.interfix,
      description: deck?.description,
      apiState: deck?.apiState === 'open'
    }
  })

  const createSeriesDeckMutation = useCreateSeriesDeck()
  const updateSeriesDeckMutation = useUpdateSeriesDeck()

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    if (deck === undefined) {
      await createSeriesDeckMutation.mutateAsync({ data: values })
    } else {
      await updateSeriesDeckMutation.mutateAsync({
        data: values,
        seriesDeckId: deck.id
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="seriesDeckForm">
      <FloatingLabelInput
        id="name"
        label="名前 - Name"
        error={errors?.name}
        register={register('name', {
          required: '名前を入力してください'
        })}
        isRequired
        mb={10}
      />

      <HStack mb={10}>
        <Text>series-tv-for-</Text>
        <FloatingLabelInput
          id="interfix"
          label="中間接辞 - Interfix"
          error={errors?.interfix}
          register={register('interfix', {
            required: '中間接辞 - Interfixを入力してください'
          })}
          isRequired
          w={250}
        />
        <Text ml={3}>-xxxxxxxxxx</Text>
      </HStack>

      <FloatingLabelTextarea
        id="description"
        label="説明 - Description"
        error={errors?.description}
        register={register('description')}
        mb={5}
      />
      <FormControl mb={5}>
        <Checkbox
          id="apiState"
          data-testid="apiState"
          {...register('apiState')}
        >
          APIへ公開する
        </Checkbox>
      </FormControl>
      <Button
        mt={4}
        colorScheme="teal"
        loadingText="送信中"
        isLoading={isSubmitting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  )
}
export default SeriesDeckForm
