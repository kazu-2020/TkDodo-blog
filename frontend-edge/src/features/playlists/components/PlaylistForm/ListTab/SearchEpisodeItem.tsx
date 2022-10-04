import { HiOutlinePlus } from 'react-icons/all'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues, useWatch } from 'react-hook-form'
import {
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Text
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { hasVideo } from '@/utils/video'
import { episodeThumbnailUrl } from '@/utils/image'
import { EpisodeData } from '@/types/episode_data'
import {
  resentEventStartDate,
  totalTime
} from '@/features/playlists/utils/episodeFormat'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { PlayableStatusBadge } from '@/components/PlayableStatusBadge'

type Props = {
  item: EpisodeData
  onClick: (episode: EpisodeData) => void
}

const addEpisode = (
  getValues: UseFormGetValues<PlaylistFormInputs>,
  setValue: UseFormSetValue<any>,
  episode: EpisodeData
) => {
  const episodes = getValues('episodes')
  setValue('episodes', [...episodes, { ...episode }], { shouldDirty: true })
}

const hasEpisode = (episodes: Array<EpisodeData>, episode: EpisodeData) =>
  episodes?.some((ep: EpisodeData) => ep.id === episode.id) || false

export const SearchEpisodeItem = ({ item, onClick }: Props) => {
  const { getValues, setValue } = useFormContext<PlaylistFormInputs>()
  const episodes = useWatch({ name: 'episodes' })

  return (
    <Grid
      templateColumns="repeat(36, 1fr)"
      gap={2}
      borderBottom="1px"
      borderColor="gray.200"
      fontSize="xs"
      p={2}
      w="100%"
      cursor="pointer"
    >
      <GridItem h="10" colSpan={3}>
        <Center h="100%">
          {!hasEpisode(episodes, item) && (
            <Button
              aria-label="追加"
              boxShadow="md"
              h="8"
              w="8"
              minW="8"
              colorScheme="orange"
              bg="accent"
              color="black"
              borderRadius="sm"
              onClick={() => {
                addEpisode(getValues, setValue, item)
              }}
            >
              <Icon as={HiOutlinePlus} />
            </Button>
          )}
          {hasEpisode(episodes, item) && (
            <Text lineHeight="40px" h="100%">
              追加済み
            </Text>
          )}
        </Center>
      </GridItem>
      <GridItem
        colSpan={9}
        h="10"
        textAlign="left"
        onClick={() => onClick(item)}
      >
        <HStack p={0} m={0}>
          <Image
            w="74px"
            h="40px"
            borderRadius="4px"
            flexBasis="74px"
            src={episodeThumbnailUrl(item, 'https://placehold.jp/71x40.png')}
          />
          <Text noOfLines={2}>{item.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={5} h="10" onClick={() => onClick(item)}>
        <Center h="100%">
          <Text>{totalTime(item)}</Text>
        </Center>
      </GridItem>
      <GridItem
        colSpan={8}
        h="10"
        textAlign="left"
        onClick={() => onClick(item)}
      >
        <Center h="100%">
          <Text w="100%" textAlign="left" noOfLines={2}>
            {item.partOfSeries?.name || ''}
          </Text>
        </Center>
      </GridItem>
      <GridItem
        colSpan={6}
        h="10"
        textAlign="center"
        onClick={() => onClick(item)}
      >
        <Center h="100%">
          <Text>{resentEventStartDate(item)}</Text>
        </Center>
      </GridItem>
      <GridItem
        colSpan={5}
        h="10"
        textAlign="center"
        onClick={() => onClick(item)}
      >
        <Center h="100%">
          <PlayableStatusBadge isPlayable={hasVideo(item?.videos || [])} />
        </Center>
      </GridItem>
    </Grid>
  )
}
