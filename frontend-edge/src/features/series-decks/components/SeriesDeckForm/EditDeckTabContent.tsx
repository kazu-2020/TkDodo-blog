import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Checkbox, FormControl, HStack, Text } from '@chakra-ui/react'

import { SeriesDeckFormInputs } from '@/features/series-decks/types'
import { PropertyInput, PropertyTextarea } from '@/components/Form'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditDeckTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<SeriesDeckFormInputs>()

  return (
    <ArrowStepContent index={contentIndex}>
      <PropertyInput
        label="名前"
        schemaName="Name"
        error={errors?.name}
        register={register('name', {
          required: '名前を入力してください'
        })}
        isRequired
        mb={10}
      />

      <HStack mb={10}>
        <Text>series-tv-for-</Text>
        <PropertyInput
          label="中間接辞"
          schemaName="Interfix"
          error={errors?.interfix}
          register={register('interfix', {
            required: '中間接辞 - Interfixを入力してください'
          })}
          isRequired
          w={250}
        />
        <Text ml={3}>-xxxxxxxxxx</Text>
      </HStack>

      <PropertyTextarea
        name="description"
        label="説明"
        schemaName="Description"
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
    </ArrowStepContent>
  )
}
