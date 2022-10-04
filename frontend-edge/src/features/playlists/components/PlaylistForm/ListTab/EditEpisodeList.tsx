import { useFormContext, useWatch } from 'react-hook-form'
import React, { useState } from 'react'
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
import { Alert, AlertIcon, Box, useDisclosure } from '@chakra-ui/react'

import { EpisodeData } from '@/types/episode_data'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { EpisodeHeader } from '@/features/playlists/components/PlaylistForm/ListTab/EpisodeHeader'
import { EditEpisodeListItem } from '@/features/playlists/components/PlaylistForm/ListTab/EditEpisodeListItem'
import { PlaylistEpisodeDrawer } from '@/features/playlists/components/PlaylistEpisodeDrawer'

import { SortableItem } from './SortableItem'

export const EditEpisodeList = () => {
  const { getValues, setValue } = useFormContext<PlaylistFormInputs>()
  const {
    isOpen: isOpenEpisode,
    onOpen: onOpenEpisode,
    onClose: onCloseEpisode
  } = useDisclosure()
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeData>()
  const episodes = useWatch({ name: 'episodes' })

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
        <EpisodeHeader />

        {episodes?.length < 1 && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            プレイリストを追加してください
          </Alert>
        )}
        <SortableContext
          items={episodes?.map((ep: EpisodeData) => ep.id)}
          strategy={verticalListSortingStrategy}
        >
          {episodes?.map((ep: EpisodeData) => (
            <SortableItem id={ep.id} key={ep.id}>
              <EditEpisodeListItem
                key={ep.id}
                episode={ep}
                onClick={(episode) => {
                  setSelectedEpisode(episode)
                  onOpenEpisode()
                }}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      {selectedEpisode && (
        <PlaylistEpisodeDrawer
          episode={selectedEpisode}
          isOpen={isOpenEpisode}
          onClose={onCloseEpisode}
        />
      )}
    </Box>
  )
}
