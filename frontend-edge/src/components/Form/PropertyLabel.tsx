import React from 'react'
import { FormLabel, Text } from '@chakra-ui/react'

export type PropertyLabelProps = {
  label: string
  schemaName?: string
}

export const PropertyLabel = ({ label, schemaName }: PropertyLabelProps) => (
  <FormLabel fontSize="11px" lineHeight="16px" fontWeight="bold" mb={0}>
    {label}
    {schemaName && (
      <Text as="span" color="gray">
        {' '}
        - {schemaName}
      </Text>
    )}
  </FormLabel>
)
