import { useFormContext } from 'react-hook-form'
import React from 'react'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { Alert, AlertIcon, Box } from '@chakra-ui/react'

import { RecommendDeckFormInputs } from '@/features/recommend-decks/types'
import { SortableItem } from '@/features/recommend-decks/components/RecommendDeckForm/SortableItem'
import { RecommendPlaylistListHeader } from '@/features/recommend-decks/components/RecommendDeckForm/RecommendPlaylistListHeader'
import { EditRecommendPlaylistListItem } from '@/features/recommend-decks/components/RecommendDeckForm/EditRecommendPlaylistListItem'

export const EditRecommendPlaylist = () => {
  const { getValues, setValue } = useFormContext<RecommendDeckFormInputs>()
  const recommendPlaylists = getValues('playlists')

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

    if (!recommendPlaylists) return

    if (active.id !== over?.id) {
      const oldIndex = recommendPlaylists.findIndex(
        (pl) => pl.playlistUId === active.id
      )
      const newIndex = recommendPlaylists.findIndex(
        (pl) => pl.playlistUId === over?.id
      )
      const newSeriesPlaylists = arrayMove(
        recommendPlaylists,
        oldIndex,
        newIndex
      )
      setValue('playlists', newSeriesPlaylists, { shouldDirty: true })
    }
  }

  // @ts-ignore
  return (
    <Box mb={10} data-testid="edit-recommend-playlist">
      <RecommendPlaylistListHeader />
      {!recommendPlaylists ||
        (recommendPlaylists?.length < 1 && (
          <Alert status="warning" colorScheme="gray">
            <AlertIcon />
            編成可能なプレイリストからプレイリストを追加してください
          </Alert>
        ))}
      {recommendPlaylists && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={recommendPlaylists.map((pl) => pl.playlistUId)}
            strategy={verticalListSortingStrategy}
          >
            {recommendPlaylists.map((playlist) => (
              <SortableItem
                id={playlist.playlistUId}
                key={playlist.playlistUId}
              >
                <EditRecommendPlaylistListItem playlist={playlist} />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      )}
    </Box>
  )
}
