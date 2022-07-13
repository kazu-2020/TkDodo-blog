import { UseMutationResult } from 'react-query'
import { useForm, SubmitHandler } from 'react-hook-form'
import React from 'react'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Text,
  Textarea,
  Checkbox,
  Button,
  HStack
} from '@chakra-ui/react'

import { Deck } from '@/types/deck'

type Inputs = {
  name: string
  interfix: string
  description: string
  apiState: boolean
}
const SeriesDeckForm = ({
  mutation,
  deck
}: {
  mutation: UseMutationResult<any, any, any, any>
  deck: Deck
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: {
      name: deck.name,
      interfix: deck.interfix,
      description: deck.description,
      apiState: deck.apiState === 'open'
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    await mutation.mutateAsync({ data: values, seriesDeckId: deck.id })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl variant="floating" isInvalid={!!errors.name} mb={5}>
        <Input
          id="name"
          placeholder=" "
          {...register('name', {
            required: '名前を入力してください'
          })}
        />
        <FormLabel htmlFor="name" color="gray">
          名前 - Name <span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.interfix} mb={5}>
        <FormLabel htmlFor="name">デッキID - DeckId</FormLabel>
        <HStack>
          <Text>series-tv-for-</Text>
          <Input
            id="interfix"
            w={200}
            {...register('interfix', {
              required: '中間接辞 - Interfixを入力してください'
            })}
          />
          <Text ml={3}>-xxxxxxxxxx</Text>
        </HStack>
        <FormErrorMessage ml="103px">
          {errors.interfix && errors.interfix.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} mb={5}>
        <FormLabel htmlFor="description">説明 - Description</FormLabel>
        <Textarea
          id="description"
          placeholder=" "
          {...register('description')}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={5}>
        <FormLabel htmlFor="apiState">APIへの公開/非公開</FormLabel>
        <Checkbox id="apiState" defaultChecked {...register('apiState')}>
          公開する
        </Checkbox>
      </FormControl>
      <Button
        mt={4}
        colorScheme="teal"
        loadingText="送信中"
        isLoading={mutation.isLoading}
        type="submit"
      >
        Submit
      </Button>
    </form>
  )
}
export default SeriesDeckForm
