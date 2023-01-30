import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Checkbox, FormControl, HStack, Text } from '@chakra-ui/react'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { SameAsItems } from '@/features/recommend-decks/components/RecommendDeckForm/SameAsItems'
import { PropertyInput, PropertyTextarea } from '@/components/Form'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditDeckTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    control,
    trigger,
    formState: { errors }
  } = useFormContext<RecommendDeckFormInputs>()

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
        <Text>recommend-tv-for-</Text>
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
        label="説明"
        schemaName="Description"
        error={errors?.description}
        register={register('description')}
        mb={5}
      />
      <Text fontSize="lg" fontWeight="bold">
        APIへの公開/非公開
      </Text>
      <FormControl mb={5} mt={5}>
        <Checkbox
          id="apiState"
          data-testid="apiState"
          {...register('apiState')}
        >
          公開する
        </Checkbox>
      </FormControl>
      <SameAsItems
        control={control}
        register={register}
        errors={errors}
        trigger={trigger}
      />
    </ArrowStepContent>
  )
}
