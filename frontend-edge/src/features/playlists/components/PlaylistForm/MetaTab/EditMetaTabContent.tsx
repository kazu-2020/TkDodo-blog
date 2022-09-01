import { useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import {
  FloatingLabelTextarea,
  FloatingLabelInput
} from '@/components/Form/FloatingLable'
import { ArrowStepContent } from '@/components/ArrowStep'

import { PlaylistImageForm } from './CropperImageModal/PlaylistImageForm'

// NOTE: フォームの項目数自体が多いため
// eslint-disable-next-line max-lines-per-function
export const EditMetaTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<PlaylistFormInputs>()

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
      <FloatingLabelInput
        id="detailedNameRuby"
        label="ふりがな - Detailed Name Ruby"
        error={errors?.detailedNameRuby}
        register={register('detailedNameRuby')}
        mb={5}
      />
      <FloatingLabelTextarea
        id="detailedCatch"
        label="キャッチコピー - DetailedCatch"
        error={errors?.detailedCatch}
        register={register('detailedCatch')}
        mb={5}
      />
      <FloatingLabelTextarea
        id="description"
        label="説明 - Description"
        error={errors?.description}
        register={register('description')}
        mb={5}
      />
      <FloatingLabelInput
        id="keywords"
        label="キーワード - Keywords"
        error={errors?.keywords}
        register={register('keywords')}
        mb={5}
      />
      <FloatingLabelInput
        id="hashtags"
        label="ハッシュタグ - Hashtags"
        error={errors?.hashtags}
        register={register('hashtags')}
        mb={5}
      />
      <HStack my={8}>
        <FormControl>
          <FormLabel>ジャンル(フォーマット) - Format Genre</FormLabel>
          <Select variant="flushed" placeholder="選択して下さい">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>ジャンル(テーマ) - Theme Genre</FormLabel>
          <Select variant="flushed" placeholder="選択して下さい">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </FormControl>
      </HStack>
      <Heading size="md">画像</Heading>
      <Box my={5}>
        <PlaylistImageForm />
      </Box>

      <Heading size="md">色</Heading>
      <FormControl>
        <FormLabel>リンク(同一内容) - SameAs</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>関連リンク - Citation</FormLabel>
        <Input />
      </FormControl>
      <FormControl>
        <FormLabel>短縮URL - Alias Id</FormLabel>
        <Input {...register('aliasId')} />
        <FormErrorMessage>
          {errors.aliasId && errors.aliasId.message}
        </FormErrorMessage>
      </FormControl>
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
