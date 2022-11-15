import { useUpdateEffect } from 'react-use'
import { useParams } from 'react-router-dom'
import { useFormContext, useWatch } from 'react-hook-form'
import React from 'react'
import {
  Checkbox,
  FormControl,
  FormLabel,
  Skeleton,
  Stack
} from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { useBundleItems } from '@/features/playlists/api/getBundleItems'

const SubTypeCheckbox = ({
  name,
  label,
  isChecked,
  count
}: {
  name:
    | 'activeTvepisode'
    | 'activeFaqpage'
    | 'activeHowto'
    | 'activeEvent'
    | 'activeRecipe'
  label: string
  isChecked: boolean
  count: number | undefined
}) => {
  const { register } = useFormContext<PlaylistFormInputs>()

  return (
    <Checkbox data-testid={name} isChecked={isChecked} {...register(name)}>
      {label}
      {count !== undefined && ` (${count})`}
    </Checkbox>
  )
}

const Skeletons = () => (
  <>
    <Skeleton h={7} w="200px" mb={2} />
    <Skeleton h={7} w="100px" />
    <Stack pl={6} my={3} spacing={3}>
      <Skeleton h={6} w="150px" />
      <Skeleton h={6} w="150px" />
      <Skeleton h={6} w="150px" />
      <Skeleton h={6} w="150px" />
      <Skeleton h={6} w="150px" />
    </Stack>
    <Skeleton h={7} w="100px" />
  </>
)

const useActiveCheckboxes = () => {
  const [
    activeTvepisode,
    activeFaqpage,
    activeHowto,
    activeEvent,
    activeRecipe
  ] = useWatch({
    name: [
      'activeTvepisode',
      'activeFaqpage',
      'activeHowto',
      'activeEvent',
      'activeRecipe'
    ]
  })

  const allChecked = [
    activeTvepisode,
    activeFaqpage,
    activeHowto,
    activeEvent,
    activeRecipe
  ].every(Boolean)

  const isIndeterminate =
    [
      activeTvepisode,
      activeFaqpage,
      activeHowto,
      activeEvent,
      activeRecipe
    ].some(Boolean) && !allChecked

  return {
    activeTvepisode,
    activeFaqpage,
    activeHowto,
    activeEvent,
    activeRecipe,
    allChecked,
    isIndeterminate
  }
}

export const ActiveCheckboxes = () => {
  const { register, setValue } = useFormContext<PlaylistFormInputs>()
  const {
    activeTvepisode,
    activeFaqpage,
    activeHowto,
    activeEvent,
    activeRecipe,
    allChecked,
    isIndeterminate
  } = useActiveCheckboxes()

  useUpdateEffect(() => {
    setValue('activeItemList', allChecked || isIndeterminate, {
      shouldDirty: true
    })
  }, [allChecked, isIndeterminate, setValue])

  const { playlistUId } = useParams()
  const { data, isLoading } = useBundleItems(playlistUId)

  if (isLoading) {
    return <Skeletons />
  }

  return (
    <FormControl mb={5}>
      <FormLabel>Typeごとのactive ON/OFF</FormLabel>
      <Checkbox
        data-testid="activeItemList"
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        {...register('activeItemList')}
        onChange={(e) => {
          const isChecked = e.target.checked
          setValue('activeItemList', isChecked, { shouldDirty: true })
          setValue('activeTvepisode', isChecked, { shouldDirty: true })
          setValue('activeFaqpage', isChecked, { shouldDirty: true })
          setValue('activeHowto', isChecked, { shouldDirty: true })
          setValue('activeEvent', isChecked, { shouldDirty: true })
          setValue('activeRecipe', isChecked, { shouldDirty: true })
        }}
      >
        NItemList
      </Checkbox>
      <Stack pl={6} my={3} spacing={3}>
        <SubTypeCheckbox
          name="activeTvepisode"
          isChecked={activeTvepisode}
          label="TVEpisode"
          count={data?.tvepisodeCount}
        />
        <SubTypeCheckbox
          name="activeFaqpage"
          isChecked={activeFaqpage}
          label="FAQPage"
          count={data?.faqpageCount}
        />
        <SubTypeCheckbox
          name="activeHowto"
          isChecked={activeHowto}
          label="HowTo"
          count={data?.howtoCount}
        />
        <SubTypeCheckbox
          name="activeEvent"
          isChecked={activeEvent}
          label="Event"
          count={data?.eventCount}
        />
        <SubTypeCheckbox
          name="activeRecipe"
          isChecked={activeRecipe}
          label="Recipe"
          count={data?.recipeCount}
        />
      </Stack>
      <Checkbox data-testid="activeArticle" {...register('activeArticle')}>
        NArticle
      </Checkbox>
    </FormControl>
  )
}
