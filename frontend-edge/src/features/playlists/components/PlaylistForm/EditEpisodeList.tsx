import React from 'react'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import { Alert, AlertIcon, Box, Grid, GridItem, Text } from '@chakra-ui/react'

import { usePlaylistFormStore } from '@/features/playlists/stores/playlistForm'
import { EditEpisodeListItem } from '@/features/playlists/components/PlaylistForm/EditEpisodeListItem'

import { SortableItem } from './SortableItem'

export const EditEpisodeList = () => {
  const { episodes, setEpisodes } = usePlaylistFormStore((state) => ({
    episodes: state.episodes,
    setEpisodes: state.setEpisodes
  }))

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // onPointerDown後に、ほんの少し動かさないとDragStartEventが発火しないように
        // この設定によりDraggableな領域内のボタンなどの要素がクリック可能になる
        distance: 10
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = episodes.findIndex((ep) => ep.episodeId === active.id)
      const newIndex = episodes.findIndex((ep) => ep.episodeId === over?.id)
      const newEpisodes = arrayMove(episodes, oldIndex, newIndex)
      setEpisodes(newEpisodes)
    }
  }

  // @ts-ignore
  return (
    <Box mb={10} data-testid="edit-series-playlist">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={1}
          borderBottom="1px"
          borderColor="gray.200"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          p={2}
        >
          <GridItem h="5" />
          <GridItem colSpan={5} h="5">
            <Text>エピソード</Text>
          </GridItem>
          <GridItem colSpan={1} h="5">
            <Text>再生時間</Text>
          </GridItem>
          <GridItem colSpan={2} h="5">
            <Text>シリーズ名</Text>
          </GridItem>
          <GridItem colSpan={2} h="5">
            <Text>直近放送日</Text>
          </GridItem>
          <GridItem colSpan={1} h="5">
            <Text>視聴状況</Text>
          </GridItem>
        </Grid>

        {episodes.length < 1 && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            プレイリストを追加してください
          </Alert>
        )}
        <SortableContext
          items={episodes.map((ep) => ep.episodeId)}
          strategy={verticalListSortingStrategy}
        >
          {episodes.map((ep) => (
            <SortableItem id={ep.episodeId} key={ep.episodeId}>
              <EditEpisodeListItem key={ep.episodeId} episode={ep} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  )
}
