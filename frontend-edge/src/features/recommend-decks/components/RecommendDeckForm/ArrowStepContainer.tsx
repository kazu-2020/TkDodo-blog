import {
  FieldNamesMarkedBoolean,
  FieldValues,
  useFormContext
} from 'react-hook-form'
import React from 'react'
import { Box, Hide, HStack } from '@chakra-ui/react'

import { ArrowStepContextProvider, StepItem } from '@/components/ArrowStep'

import { VerticalPreview } from './VerticalPreview'
import { FormHeader } from './FormHeader'
import { EditListTabContent } from './EditListTabContent'
import { EditDeckTabContent } from './EditDeckTabContent'

const hasChangedPlaylists = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean => dirtyFields.playlists === true

const hasChangedDeck = (
  dirtyFields: FieldNamesMarkedBoolean<FieldValues>
): boolean =>
  dirtyFields.name === true ||
  dirtyFields.interfix === true ||
  dirtyFields.description === true ||
  dirtyFields.apiState === true ||
  dirtyFields.deckSameAsAttributes?.some(
    (sameAs: any) =>
      Object.keys(sameAs).length === 0 ||
      sameAs.name === true ||
      sameAs.url === true ||
      // eslint-disable-next-line no-underscore-dangle
      sameAs._destroy === true
  ) === true

export const ArrowStepContainer = () => {
  const {
    formState: { dirtyFields, isValid }
  } = useFormContext()

  const stepItems: StepItem[] = [
    {
      title: 'リスト(Playlist)',
      isSuccess: hasChangedPlaylists(dirtyFields),
      hasError: false
    },
    {
      title: '基本情報(Deck)',
      isSuccess: hasChangedDeck(dirtyFields),
      hasError: !isValid
    }
  ]
  const listIndex = 0
  const deckIndex = 1

  return (
    <ArrowStepContextProvider>
      <FormHeader stepItems={stepItems} />

      <HStack spacing="4" alignItems="start">
        <Box bg="white" p={5} borderRadius="sm" minH="400px" flex={1}>
          <EditListTabContent contentIndex={listIndex} />
          <EditDeckTabContent contentIndex={deckIndex} />
        </Box>
        <Hide below="lg">
          <VerticalPreview />
        </Hide>
      </HStack>
    </ArrowStepContextProvider>
  )
}

if (import.meta.vitest) {
  const { generateRecommendDeckDirtyFields } = await import(
    '@/test/data-generators'
  )

  const { describe, it, expect } = import.meta.vitest
  describe('hasChangedPlaylists', () => {
    it('変更がある場合', () => {
      const dirtyFields = generateRecommendDeckDirtyFields({ playlists: true })
      expect(hasChangedPlaylists(dirtyFields)).toBe(true)
    })

    it('変更がない場合（ステータスあり）', () => {
      const dirtyFields = generateRecommendDeckDirtyFields({})
      expect(hasChangedPlaylists(dirtyFields)).toBe(false)
    })

    it('変更がない場合（ステータスなし）', () => {
      const dirtyFields = {}
      expect(hasChangedPlaylists(dirtyFields)).toBe(false)
    })
  })

  describe('hasChangedDeck', () => {
    it('変更がある場合', () => {
      const dirtyFields = generateRecommendDeckDirtyFields({ name: true })
      expect(hasChangedDeck(dirtyFields)).toBe(true)
    })

    it('変更がある場合（sameAs）', () => {
      const dirtyFields1 = generateRecommendDeckDirtyFields({
        deckSameAsAttributes: [{ name: false, url: false, _destroy: true }]
      })
      expect(hasChangedDeck(dirtyFields1)).toBe(true)

      const dirtyFields2 = generateRecommendDeckDirtyFields({
        deckSameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: true }
        ]
      })
      expect(hasChangedDeck(dirtyFields2)).toBe(true)

      const dirtyFields3 = generateRecommendDeckDirtyFields({
        deckSameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false },
          {} // 新規追加した場合は、空のオブジェクトが生成される
        ]
      })
      expect(hasChangedDeck(dirtyFields3)).toBe(true)
    })

    it('変更がない場合（ステータスあり）', () => {
      const dirtyFields = generateRecommendDeckDirtyFields({})
      expect(hasChangedDeck(dirtyFields)).toBe(false)
    })

    it('変更がない場合（ステータスなし）', () => {
      const dirtyFields = {}
      expect(hasChangedDeck(dirtyFields)).toBe(false)
    })

    it('変更がない場合（sameAs）', () => {
      const dirtyFields1 = generateRecommendDeckDirtyFields({
        deckSameAsAttributes: []
      })
      expect(hasChangedDeck(dirtyFields1)).toBe(false)

      const dirtyFields2 = generateRecommendDeckDirtyFields({
        deckSameAsAttributes: [
          { name: false, url: false, _destroy: false },
          { name: false, url: false, _destroy: false }
        ]
      })
      expect(hasChangedDeck(dirtyFields2)).toBe(false)
    })
  })
}
