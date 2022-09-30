import { Box } from '@chakra-ui/react'

import { EpisodeData } from '@/types/episode_data'
import { SearchEpisodeItem } from '@/features/playlists/components/PlaylistForm/ListTab/SearchEpisodeItem'

type Props = {
  items?: EpisodeData[]
  onClick: (episode: EpisodeData) => void
}

export const SearchEpisodeItems = ({ items, onClick }: Props) => (
  <Box w="100%">
    {items?.map((item: EpisodeData) => (
      <SearchEpisodeItem key={item.id} item={item} onClick={onClick} />
    ))}
  </Box>
)
