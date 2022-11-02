import { useFormContext } from 'react-hook-form'
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

import { SeriesDeckFormInputs } from '@/features/series-decks/types'
import { EditSeriesPlaylistListItem } from '@/features/series-decks/components/SeriesDeckForm/EditSeriesPlaylistListItem'

import { SortableItem } from './SortableItem'

export const EditSeriesPlaylist = () => {
  const { getValues, setValue } = useFormContext<SeriesDeckFormInputs>()
  const seriesPlaylists = getValues('playlists')

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

    if (!seriesPlaylists) return

    if (active.id !== over?.id) {
      const oldIndex = seriesPlaylists.findIndex(
        (pl) => pl.seriesId === active.id
      )
      const newIndex = seriesPlaylists.findIndex(
        (pl) => pl.seriesId === over?.id
      )
      const newSeriesPlaylists = arrayMove(seriesPlaylists, oldIndex, newIndex)
      setValue('playlists', newSeriesPlaylists, { shouldDirty: true })
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
          templateColumns="repeat(10, 1fr)"
          gap={6}
          borderBottom="1px"
          borderColor="gray.200"
          fontSize="xs"
          fontWeight="bold"
          color="gray"
          p={2}
        >
          <GridItem h="5" />
          <GridItem colSpan={5} h="5">
            <Text>シリーズ</Text>
          </GridItem>
          <GridItem colSpan={4} h="5">
            <Text>アイテム数</Text>
          </GridItem>
        </Grid>

        {(!seriesPlaylists || seriesPlaylists.length < 1) && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            シリーズを追加してください
          </Alert>
        )}
        {seriesPlaylists && (
          <SortableContext
            items={seriesPlaylists.map((pl) => pl.seriesId)}
            strategy={verticalListSortingStrategy}
          >
            {seriesPlaylists.map((playlist) => (
              <SortableItem id={playlist.seriesId} key={playlist.seriesId}>
                <EditSeriesPlaylistListItem
                  key={playlist.seriesId}
                  playlist={playlist}
                />
              </SortableItem>
            ))}
          </SortableContext>
        )}
      </DndContext>
    </Box>
  )
}
