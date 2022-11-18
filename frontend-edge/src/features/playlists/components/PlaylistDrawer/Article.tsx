import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { Article as PlaylistArticle } from '@/types/article'

type Props = {
  playlist: Playlist
}

const ellipsizePlainBody = (article: PlaylistArticle | undefined) =>
  article?.plainBody?.slice(0, 50) || ''

export const Article = ({ playlist }: Props) => {
  const plainBody = ellipsizePlainBody(playlist.article)
  if (plainBody) {
    return (
      <Box borderTop="1px" borderColor="gray.200" px={7} py={5}>
        <Text pb={4} fontSize="sm">
          {plainBody}
        </Text>
      </Box>
    )
  }
  return null
}

if (import.meta.vitest) {
  const { articleGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('ellipsizePlainBody', () => {
    it('50文字の場合', () => {
      const plainBody = 'A'.repeat(50)
      const article = articleGenerator({ plainBody })
      expect(ellipsizePlainBody(article)).toEqual(plainBody)
    })

    it('51文字の場合', () => {
      const plainBody = 'A'.repeat(50)
      const article = articleGenerator({ plainBody: `${plainBody}B` })
      expect(ellipsizePlainBody(article)).toEqual(plainBody)
    })

    it('Articleが未定義の場合', () => {
      expect(ellipsizePlainBody(undefined)).toEqual('')
    })

    it('plainBodyが空の場合', () => {
      const article = articleGenerator({ plainBody: '' })
      expect(ellipsizePlainBody(article)).toEqual('')
    })

    it('plainBodyが未定義の場合', () => {
      const article = articleGenerator({ plainBody: undefined })
      expect(ellipsizePlainBody(article)).toEqual('')
    })
  })
}
