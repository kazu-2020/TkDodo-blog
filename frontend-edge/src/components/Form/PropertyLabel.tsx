import React from 'react'
import { FormLabel, Text } from '@chakra-ui/react'

export const PropertyLabel = ({
  label,
  schemaName
}: {
  label: string
  schemaName: string
}) => (
  <FormLabel>
    {label}
    <Text as="span" color="gray">
      {' '}
      - {schemaName}
    </Text>
  </FormLabel>
)
