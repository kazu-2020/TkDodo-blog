import { HiOutlineMinus } from 'react-icons/all'
import { UseFormSetValue } from 'react-hook-form/dist/types/form'
import { useFormContext, UseFormGetValues } from 'react-hook-form'
import React from 'react'
import {
  AccordionButton,
  AccordionIcon,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  Text
} from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'

import { RecommendPlaylist } from '@/types/recommend_playlist'
import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'

const removeRecommendPlaylist = (
  getValues: UseFormGetValues<RecommendDeckFormInputs>,
  setValue: UseFormSetValue<any>,
  playlistUid: string
) => {
  const playlists =
    getValues('playlists')?.filter(
      (playlist) => playlist.playlistUid !== playlistUid
    ) || []
  setValue('playlists', playlists, { shouldDirty: true })
}

export const EditRecommendPlaylistListItemDetail = ({
  playlist,
  onToggleAccordion
}: {
  playlist: RecommendPlaylist
  onToggleAccordion: () => void
}) => {
  const { getValues, setValue } = useFormContext<RecommendDeckFormInputs>()

  const logoImage =
    playlist.logo?.medium?.url ?? '/public/dummy/default1/default1-logo.png'

  return (
    <Grid
      templateColumns="repeat(20, 1fr)"
      gap={6}
      fontSize="xs"
      fontWeight="bold"
      p={2}
    >
      <GridItem colSpan={2} h={8} textAlign="center">
        <Button
          aria-label="削除"
          boxShadow="md"
          h="8"
          w="8"
          minW="8"
          colorScheme="orange"
          bg="accent"
          color="black"
          borderRadius="sm"
          onClick={() => {
            removeRecommendPlaylist(getValues, setValue, playlist.playlistUid)
          }}
        >
          <Icon as={HiOutlineMinus} />
        </Button>
      </GridItem>
      <GridItem colSpan={6} h={8}>
        <HStack>
          <Image src={logoImage} alt={playlist.name} h="30px" />
          <Text noOfLines={1}>{playlist.name}</Text>
        </HStack>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center>
          <Text fontSize="xl" fontWeight="normal">
            {playlist.markedBody ? '○' : '×'}
          </Text>
        </Center>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center h="100%">
          <Center
            fontSize="sm"
            bg={playlist.playableItemsCount !== 0 ? 'pink' : 'gray'}
            rounded="md"
            color="white"
            h={8}
            px={4}
          >
            {playlist.playableItemsCount}/{playlist.itemNum}
          </Center>
        </Center>
      </GridItem>
      <GridItem colSpan={4} h={8}>
        <Center h={8}>
          <AccordionButton
            color="link"
            _hover={{}}
            onClick={() => onToggleAccordion()}
          >
            <Text fontSize="sm">エピソード表示</Text>
            <AccordionIcon />
          </AccordionButton>
        </Center>
      </GridItem>
    </Grid>
  )
}
