import { useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Text
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { ThemeGenreSelect } from '@/features/playlists/components/PlaylistForm/MetaTab/ThemeGenreSelect'
import { FormatGenreSelect } from '@/features/playlists/components/PlaylistForm/MetaTab/FormatGenreSelect'
import { MultiValueTextInput } from '@/components/Form/MultiValueTextInput/MultiValueTextInput'
import {
  FloatingLabelInput,
  FloatingLabelTextarea
} from '@/components/Form/FloatingLable'
import { ArrowStepContent } from '@/components/ArrowStep'

import { SameAsItems } from './SameAsItems'
import { PlaylistImageForm } from './CropperImageModal/PlaylistImageForm'
import { ColorPaletteForm } from './ColorPaletteForm/ColorPaletteForm'
import { CitationItems } from './CitationItems'
import { ActiveCheckboxes } from './ActiveCheckboxes'

// NOTE: フォームの項目数自体が多く分割すると見通しが悪くなるため
// eslint-disable-next-line max-lines-per-function
export const EditMetaTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    control,
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

      <MultiValueTextInput
        name="keywords"
        label="キーワード - Keywords"
        placeholder="キーワードを入力してください"
        mb={5}
      />

      <MultiValueTextInput
        name="hashtags"
        label="ハッシュタグ - Hashtags"
        placeholder="ハッシュタグを入力してください"
        helperText="ハッシュタグは先頭に「#」をつけてください"
        mb={5}
      />

      <HStack my={8} spacing={8}>
        <FormatGenreSelect />
        <Spacer />
        <ThemeGenreSelect />
      </HStack>

      <Heading size="md">画像</Heading>
      <Box my={5}>
        <PlaylistImageForm />
      </Box>

      <Heading size="md">色 - Color</Heading>
      <Text>
        ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます。
      </Text>
      <Text>一番右側のパレットから自由に色を選択することができます。</Text>
      <Box my={5}>
        <ColorPaletteForm />
      </Box>

      <SameAsItems control={control} register={register} errors={errors} />

      <CitationItems control={control} register={register} errors={errors} />

      <FormControl mb={5}>
        <FormLabel>短縮URL - Alias Id</FormLabel>
        <Input variant="flushed" {...register('aliasId')} />
        <FormHelperText>半角英数字、「-」「_」が利用できます</FormHelperText>
        <FormErrorMessage>
          {errors.aliasId && errors.aliasId.message}
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={5}>
        <FormLabel>APIへの公開/非公開</FormLabel>
        <Checkbox
          id="apiState"
          data-testid="apiState"
          {...register('apiState')}
        >
          公開する
        </Checkbox>
      </FormControl>

      <ActiveCheckboxes />
    </ArrowStepContent>
  )
}
