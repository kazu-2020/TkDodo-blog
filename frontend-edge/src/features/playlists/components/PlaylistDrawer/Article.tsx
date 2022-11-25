import React from 'react'
import { Box, Text } from '@chakra-ui/react'

import { Playlist } from '@/types/playlist'
import { playlistGenerator } from '@/test/data-generators'

type Props = {
  playlist: Playlist
}

const ellipsizePlainBody = (playlist: Playlist | undefined) =>
  playlist?.articleBody?.slice(0, 50) || ''

export const Article = ({ playlist }: Props) => {
  const articleBody = ellipsizePlainBody(playlist)
  if (articleBody) {
    return (
      <Box borderTop="1px" borderColor="gray.200" px={7} py={5}>
        <Text pb={4} fontSize="sm">
          {articleBody}
        </Text>
      </Box>
    )
  }
  return null
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  describe('ellipsizePlainBody', () => {
    it('50文字の場合', () => {
      const articleBody = 'A'.repeat(50)
      const article = playlistGenerator({ articleBody })
      expect(ellipsizePlainBody(article)).toEqual(articleBody)
    })

    it('51文字の場合', () => {
      const articleBody = 'A'.repeat(50)
      const article = playlistGenerator({ articleBody: `${articleBody}B` })
      expect(ellipsizePlainBody(article)).toEqual(articleBody)
    })

    it('Articleが未定義の場合', () => {
      expect(ellipsizePlainBody(undefined)).toEqual('')
    })

    it('plainBodyが空の場合', () => {
      const article = playlistGenerator({ articleBody: '' })
      expect(ellipsizePlainBody(article)).toEqual('')
    })

    it('plainBodyが未定義の場合', () => {
      const article = playlistGenerator({ articleBody: undefined })
      expect(ellipsizePlainBody(article)).toEqual('')
    })
  })
}
