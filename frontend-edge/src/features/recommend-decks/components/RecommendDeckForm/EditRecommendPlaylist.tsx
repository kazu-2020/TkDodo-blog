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

import { useRecommendDeckFormStore } from '@/features/recommend-decks/stores/recommendDeckForm'
import { EditRecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylistListItem'

import { SortableItem } from './SortableItem'

export const EditRecommendPlaylist = () => {
  const { recommendPlaylists, setRecommendPlaylists } =
    useRecommendDeckFormStore((state) => ({
      recommendPlaylists: state.recommendPlaylists,
      setRecommendPlaylists: state.setRecommendPlaylists
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
      const oldIndex = recommendPlaylists.findIndex(
        (pl) => pl.seriesId === active.id
      )
      const newIndex = recommendPlaylists.findIndex(
        (pl) => pl.seriesId === over?.id
      )
      const newRecommendPlaylists = arrayMove(
        recommendPlaylists,
        oldIndex,
        newIndex
      )
      setRecommendPlaylists(newRecommendPlaylists)
    }
  }

  // @ts-ignore
  return (
    <Box mb={10} data-testid="edit-recommend-playlist">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={6}
          borderBottom="1px"
          borderColor="gray.200"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          p={2}
        >
          <GridItem h="5" />
          <GridItem colSpan={6} h="5">
            <Text>シリーズ</Text>
          </GridItem>
          <GridItem colSpan={5} h="5">
            <Text>アイテム数</Text>
          </GridItem>
        </Grid>

        {recommendPlaylists.length < 1 && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            プレイリストを追加してください
          </Alert>
        )}
        <SortableContext
          items={recommendPlaylists.map((pl) => pl.seriesId)}
          strategy={verticalListSortingStrategy}
        >
          {recommendPlaylists.map((playlist) => (
            <SortableItem id={playlist.seriesId} key={playlist.seriesId}>
              <EditRecommendPlaylistListItem
                key={playlist.seriesId}
                playlist={playlist}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  )
}
