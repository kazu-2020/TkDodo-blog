import { useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Spacer,
  Text
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import {
  PropertyInput,
  PropertyTextarea,
  MultiValueTextInput,
  PropertyLabel
} from '@/components/Form'
import { ArrowStepContent } from '@/components/ArrowStep'

import { ThemeGenreSelect } from './ThemeGenreSelect'
import { SameAsItems } from './SameAsItems'
import { FormatGenreSelect } from './FormatGenreSelect'
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
    trigger,
    formState: { errors }
  } = useFormContext<PlaylistFormInputs>()

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

      <PropertyInput
        label="ふりがな"
        schemaName="Detailed Name Ruby"
        error={errors?.detailedNameRuby}
        register={register('detailedNameRuby')}
        mb={5}
      />

      <PropertyTextarea
        label="キャッチコピー"
        schemaName="DetailedCatch"
        error={errors?.detailedCatch}
        register={register('detailedCatch')}
        mb={5}
      />

      <PropertyTextarea
        label="説明"
        schemaName="Description"
        error={errors?.description}
        register={register('description')}
        mb={5}
      />

      <MultiValueTextInput
        name="keywords"
        label="キーワード"
        schemaName="Keywords"
        placeholder="キーワードを入力してください"
        mb={5}
      />

      <MultiValueTextInput
        name="hashtags"
        label="ハッシュタグ"
        schemaName="Hashtags"
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

      <PropertyLabel label="色" schemaName="Color" />
      <Text>
        ここで選んだ色がアクセシビリティに配慮された色に変換されページに反映されます。
      </Text>
      <Text>一番右側のパレットから自由に色を選択することができます。</Text>
      <Box my={5}>
        <ColorPaletteForm />
      </Box>

      <SameAsItems
        control={control}
        register={register}
        errors={errors}
        trigger={trigger}
      />

      <CitationItems
        control={control}
        register={register}
        errors={errors}
        trigger={trigger}
      />

      <PropertyInput
        label="短縮URL"
        schemaName="AliasId"
        helperText="半角英数字、「-」「_」が利用できます"
        error={errors?.aliasId}
        register={register('aliasId')}
        mb={5}
      />

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
