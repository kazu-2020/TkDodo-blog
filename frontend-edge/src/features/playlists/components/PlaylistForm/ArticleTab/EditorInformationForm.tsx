import { FaUserEdit } from 'react-icons/all'
import { Controller, useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'

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
          <FormControl isRequired>
            <FormLabel>
              著者名
              <Text as="span" color="gray">
                - Author Name
              </Text>
            </FormLabel>
            <Input
              data-testid="authorName"
              {...register('authorName', {
                required: '著者名を入力して下さい'
              })}
            />
            <FormErrorMessage>{errors?.authorName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl as="fieldset">
            <FormLabel as="legend">
              発行者
              <Text as="span" color="gray">
                - Publisher
              </Text>
            </FormLabel>
            <PersonOrganizationRadio inputName="publisherType" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>
              発行者名
              <Text as="span" color="gray">
                - Publisher Name
              </Text>
            </FormLabel>
            <Input
              data-testid="publisherName"
              {...register('publisherName', {
                required: '発行者名を入力して下さい'
              })}
            />
            <FormErrorMessage>
              {errors.publisherName && errors.publisherName.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
      </Box>
    </Box>
  )
}
