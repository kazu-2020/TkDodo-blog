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

export const HorizontalEpisodeList = ({ episodes }: Props) => {
  const pages = episodes.reduce(
    (acc: EpisodeData[][], _, index: number) =>
      index % PAGE_ITEMS
        ? acc
        : [...acc, ...[episodes.slice(index, index + PAGE_ITEMS)]],
    []
  )

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
