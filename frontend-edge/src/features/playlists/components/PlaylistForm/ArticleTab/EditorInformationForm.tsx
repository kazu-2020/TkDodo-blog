import { FaUserEdit } from 'react-icons/all'
import { Controller, useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { PropertyInput } from '@/components/Form'

const PersonOrganizationRadio = ({
  inputName
}: {
  inputName: 'authorType' | 'publisherType'
}) => {
  const { control } = useFormContext<PlaylistFormInputs>()

  return (
    <Controller
      name={inputName}
      control={control}
      render={({ field: { onChange, value } }) => (
        <RadioGroup
          data-testid={`${inputName}-radio-group`}
          onChange={onChange}
          value={value}
          defaultValue="Organization"
        >
          <HStack spacing="24px">
            <Radio value="Person" data-testid={`radio-${inputName}-person`}>
              個人(Person)
            </Radio>
            <Radio
              value="Organization"
              data-testid={`radio-${inputName}-organization`}
            >
              グループ(Organization)
            </Radio>
          </HStack>
        </RadioGroup>
      )}
    />
  )
}

export const EditorInformationForm = () => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlaylistFormInputs>()

  return (
    <Box bgColor="lightGray" p={4} borderRadius="sm">
      <Heading size="md" mb={2}>
        <Flex alignItems="center">
          <Icon as={FaUserEdit} w={6} h={6} mr={2} />
          <Text>編集者情報の入力</Text>
        </Flex>
      </Heading>
      <Divider my={3} borderColor="gray.400" />
      <Box p={4} bgColor="white" borderRadius="sm">
        <Stack spacing={4}>
          <FormControl as="fieldset">
            <FormLabel as="legend">
              著者
              <Text as="span" color="gray">
                - Author
              </Text>
            </FormLabel>
            <PersonOrganizationRadio inputName="authorType" />
          </FormControl>
          <PropertyInput
            label="著者名"
            schemaName="Author Name"
            error={errors?.authorName}
            register={register(`authorName`, {
              required: '著者名を入力してください'
            })}
            isRequired
            m={3}
          />
          <FormControl as="fieldset">
            <FormLabel as="legend">
              発行者
              <Text as="span" color="gray">
                - Publisher
              </Text>
            </FormLabel>
            <PersonOrganizationRadio inputName="publisherType" />
          </FormControl>
          <PropertyInput
            label="発行者名"
            schemaName="Publisher Name"
            error={errors?.publisherName}
            register={register(`publisherName`, {
              required: '発行者名を入力してください'
            })}
            isRequired
            m={3}
          />
        </Stack>
      </Box>
    </Box>
  )
}
