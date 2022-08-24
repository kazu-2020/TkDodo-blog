import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Checkbox, FormControl, HStack, Text } from '@chakra-ui/react'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { SameAsItems } from '@/features/recommend-decks/components/RecommendDeckForm/SameAsItems'
import {
  FloatingLabelTextarea,
  FloatingLabelInput
} from '@/components/Form/FloatingLable'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditDeckTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<RecommendDeckFormInputs>()

  return (
    <ArrowStepContent index={contentIndex}>
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
        <Text>recommend-tv-for-</Text>
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
      <SameAsItems control={control} register={register} errors={errors} />
    </ArrowStepContent>
  )
}
