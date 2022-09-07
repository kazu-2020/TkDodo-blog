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

import { PlaylistFormInputs } from '@/features/playlists/types'
import { EditEpisodeListItem } from '@/features/playlists/components/PlaylistForm/ListTab/EditEpisodeListItem'

import { SortableItem } from './SortableItem'

export const EditEpisodeList = () => {
  const { getValues, setValue } = useFormContext<PlaylistFormInputs>()

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
      const oldIndex = getValues('episodes').findIndex(
        (ep) => ep.id === active.id
      )
      const newIndex = getValues('episodes').findIndex(
        (ep) => ep.id === over?.id
      )
      const newEpisodes = arrayMove(getValues('episodes'), oldIndex, newIndex)
      setValue('episodes', newEpisodes, { shouldDirty: true })
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

        {getValues('episodes')?.length < 1 && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            プレイリストを追加してください
          </Alert>
        )}
        <SortableContext
          items={getValues('episodes').map((ep) => ep.id)}
          strategy={verticalListSortingStrategy}
        >
          {getValues('episodes').map((ep) => (
            <SortableItem id={ep.id} key={ep.id}>
              <EditEpisodeListItem key={ep.id} episode={ep} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  )
}
