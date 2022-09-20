import { Box } from '@chakra-ui/react'

import { EpisodeData } from '@/types/episode_data'
import { SearchEpisodeItem } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItem'

type Props = {
  items?: EpisodeData[]
}

export const SearchEpisodeItems = ({ items }: Props) => (
  <Box w="100%">
    {items?.map((item: EpisodeData) => (
      <SearchEpisodeItem key={item.id} item={item} />
    ))}
  </Box>
)
