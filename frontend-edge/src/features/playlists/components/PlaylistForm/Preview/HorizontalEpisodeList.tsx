import { Carousel } from 'react-responsive-carousel'
import React, { CSSProperties } from 'react'
import { nanoid } from 'nanoid'
import { Box, HStack, Text } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import { EpisodeData } from '@/types/episode_data'
import { EpisodeListItem } from '@/features/playlists/components'

const PAGE_ITEMS = 8

type Props = {
  episodes: EpisodeData[]
}

const arrowStyles: CSSProperties = {
  position: 'absolute',
  top: '60px',
  zIndex: 2
}

const renderArrowPrev = (
  isShow: boolean,
  clickHandler: () => void,
  hasPrev: boolean,
  label: string
) => {
  if (!isShow) {
    return null
  }
  return (
    <button
      disabled={!hasPrev}
      type="button"
      onClick={clickHandler}
      title={label}
      style={{
        ...arrowStyles,
        left: '0'
      }}
    >
      <ChevronLeftIcon
        w={12}
        h={12}
        color={hasPrev ? 'gray.600' : 'gray.200'}
      />
    </button>
  )
}

const renderArrowNext = (
  isShow: boolean,
  clickHandler: () => void,
  hasNext: boolean,
  label: string
) => {
  if (!isShow) {
    return null
  }

  return (
    <button
      disabled={!hasNext}
      type="button"
      onClick={clickHandler}
      title={label}
      style={{
        ...arrowStyles,
        right: '0'
      }}
    >
      <ChevronRightIcon
        w={12}
        h={12}
        color={hasNext ? 'gray.600' : 'gray.200'}
      />
    </button>
  )
}

const episodeArrayToPage = (episodes: EpisodeData[]) =>
  episodes.reduce(
    (acc: EpisodeData[][], _, index: number) =>
      index % PAGE_ITEMS
        ? acc
        : [...acc, ...[episodes.slice(index, index + PAGE_ITEMS)]],
    []
  )

export const HorizontalEpisodeList = ({ episodes }: Props) => {
  const pages = episodeArrayToPage(episodes)

  if (episodes.length < 1) {
    return (
      <Box>
        <Text fontSize="sm" my={4} mx={12} key="episodes-undefined">
          エピソードは登録されていません
        </Text>
      </Box>
    )
  }

  return (
    <Carousel
      renderArrowPrev={(clickHandler, hasPrev, label) =>
        renderArrowPrev(pages.length > 1, clickHandler, hasPrev, label)
      }
      renderArrowNext={(clickHandler, hasPrev, label) =>
        renderArrowNext(pages.length > 1, clickHandler, hasPrev, label)
      }
      showStatus={false}
      showIndicators={false}
      showThumbs={false}
    >
      {pages.map((page) => (
        <HStack
          key={nanoid()}
          wrap="wrap"
          alignItems="flex-start"
          spacing={0}
          mx={12}
        >
          {page?.map((item: EpisodeData) => (
            <Box pr={1} key={item.id}>
              <EpisodeListItem
                w="100px"
                flexDirection="column"
                alignItems="flex-start"
                isSmall
                episodeItem={item}
                mb={2}
              />
            </Box>
          ))}
        </HStack>
      ))}
    </Carousel>
  )
}

if (import.meta.vitest) {
  const { episodeDataGenerator } = await import('@/test/data-generators')

  const { describe, it, expect } = import.meta.vitest
  describe('renderArrowPrev', () => {
    it('表示する場合', () => {
      expect(renderArrowPrev(true, () => {}, true, 'dummy')).not.toBeNull()
    })

    it('表示しない場合', () => {
      expect(renderArrowPrev(false, () => {}, true, 'dummy')).toBeNull()
    })
  })

  describe('renderArrowNext', () => {
    it('表示する場合', () => {
      expect(renderArrowNext(true, () => {}, true, 'dummy')).not.toBeNull()
    })

    it('表示しない場合', () => {
      expect(renderArrowNext(false, () => {}, true, 'dummy')).toBeNull()
    })
  })

  describe('episodeArrayToPage', () => {
    // eslint-disable-next-line max-statements
    it('8件の場合', () => {
      const episodes = [
        episodeDataGenerator({ id: 1 }),
        episodeDataGenerator({ id: 2 }),
        episodeDataGenerator({ id: 3 }),
        episodeDataGenerator({ id: 4 }),
        episodeDataGenerator({ id: 5 }),
        episodeDataGenerator({ id: 6 }),
        episodeDataGenerator({ id: 7 }),
        episodeDataGenerator({ id: 8 })
      ]
      const page = episodeArrayToPage(episodes)
      expect(page).toHaveLength(1)

      expect(page[0][0].id).toEqual(1)
      expect(page[0][1].id).toEqual(2)
      expect(page[0][2].id).toEqual(3)
      expect(page[0][3].id).toEqual(4)
      expect(page[0][4].id).toEqual(5)
      expect(page[0][5].id).toEqual(6)
      expect(page[0][6].id).toEqual(7)
      expect(page[0][7].id).toEqual(8)
    })

    // eslint-disable-next-line max-statements
    it('9件の場合', () => {
      const episodes = [
        episodeDataGenerator({ id: 1 }),
        episodeDataGenerator({ id: 2 }),
        episodeDataGenerator({ id: 3 }),
        episodeDataGenerator({ id: 4 }),
        episodeDataGenerator({ id: 5 }),
        episodeDataGenerator({ id: 6 }),
        episodeDataGenerator({ id: 7 }),
        episodeDataGenerator({ id: 8 }),
        episodeDataGenerator({ id: 9 })
      ]
      const page = episodeArrayToPage(episodes)
      expect(page).toHaveLength(2)

      expect(page[0][0].id).toEqual(1)
      expect(page[0][1].id).toEqual(2)
      expect(page[0][2].id).toEqual(3)
      expect(page[0][3].id).toEqual(4)
      expect(page[0][4].id).toEqual(5)
      expect(page[0][5].id).toEqual(6)
      expect(page[0][6].id).toEqual(7)
      expect(page[0][7].id).toEqual(8)

      expect(page[1][0].id).toEqual(9)
    })
  })
}
