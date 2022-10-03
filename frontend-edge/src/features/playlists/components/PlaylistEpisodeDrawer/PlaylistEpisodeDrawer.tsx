import React from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  Image,
  Text,
  VStack
} from '@chakra-ui/react'

import { hasVideo, videoUrl } from '@/utils/video'
import { episodeThumbnailUrl } from '@/utils/image'
import { EpisodeData } from '@/types/episode_data'
import { resentEventStartDate } from '@/features/playlists/utils/episodeFormat'
import { RelatedPlaylists } from '@/features/playlists/components/PlaylistEpisodeDrawer/RelatedPlaylists'
import { Genres } from '@/features/playlists/components/PlaylistEpisodeDrawer/Genres'
import { ActorContributor } from '@/features/playlists/components/PlaylistEpisodeDrawer/ActorContributor'
import { Video } from '@/components/Video/Video'

export const PlaylistEpisodeDrawer = ({
  episode,
  isOpen,
  onClose
}: {
  episode: EpisodeData
  isOpen: any
  onClose: any
}) => (
  <Drawer
    isOpen={isOpen}
    onClose={onClose}
    size="md"
    blockScrollOnMount={false}
  >
    <DrawerContent>
      <DrawerBody p={0}>
        <VStack fontSize="sm" p={4} alignItems="flex-start">
          <Text fontWeight="bold">{episode.name}</Text>
          <Text color="#757575">{episode.partOfSeries?.name}</Text>
          <Text>EpisodeID: {episode.id}</Text>
          <Image
            borderRadius="4px"
            src={episodeThumbnailUrl(
              episode,
              'https://placehold.jp/360x202.png?text=EyeCatch'
            )}
          />
          {episode.videos && hasVideo(episode.videos) && (
            <Video src={videoUrl(episode.videos)} />
          )}
          <Text>{episode.description}</Text>
          <Text>直近放送日：{resentEventStartDate(episode)}</Text>

          <Genres episode={episode} />

          <ActorContributor episode={episode} />
          <RelatedPlaylists episode={episode} />
        </VStack>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
)
