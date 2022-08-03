import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Button, Flex, Spacer, Text } from '@chakra-ui/react'

import { ArrowStep, StepItem } from '@/components/ArrowStep'

export const FormHeader = ({ stepItems }: { stepItems: StepItem[] }) => {
  const {
    formState: { isSubmitting, isValid }
  } = useFormContext()

  return (
    <Flex
      mb={5}
      pos="sticky"
      top="60px"
      bgColor="#f0f0f0"
      pt="15px"
      pb="10px"
      zIndex={888}
    >
      <ArrowStep items={stepItems} w="50%" />
      <Spacer />
      <Button
        type="submit"
        colorScheme="orange"
        bg="accent"
        loadingText="送信中"
        isLoading={isSubmitting}
        size="lg"
        w={180}
        isDisabled={!isValid}
      >
        <Text>保存する</Text>
      </Button>
    </Flex>
  )
}
