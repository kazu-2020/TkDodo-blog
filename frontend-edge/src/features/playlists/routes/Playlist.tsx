import { useParams } from 'react-router-dom'
import React, { useContext, useEffect } from 'react'
import { Skeleton, HStack } from '@chakra-ui/react'

import { BreadcrumbContext } from '@/components/Breadcrumb'

import { PlaylistForm } from '../components/PlaylistForm'
import { usePlaylist } from '../api/getPlaylist'

// TODO: 共通コンポーネントにする
const FormScreenSkeleton = () => (
  <>
    <HStack spacing="4" alignItems="start" mb={5}>
      <Skeleton p={5} borderRadius="sm" minH="60px" flex={1} />
      <Skeleton h="60px" w="300px" px={3} bg="white" borderRadius="md" />
    </HStack>
    <HStack spacing="4" alignItems="start">
      <Skeleton p={5} borderRadius="sm" minH="400px" flex={1} />
      <Skeleton h="400px" w="300px" px={3} bg="white" borderRadius="md" />
    </HStack>
  </>
)

const Playlist = () => {
  const breadcrumbDispatch = useContext(BreadcrumbContext).dispatch

  const { playlistUId } = useParams()
  const { data, isLoading } = usePlaylist(playlistUId)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (typeof breadcrumbDispatch === 'function') {
      breadcrumbDispatch({ name: data?.name ?? '' })
    }
  }, [breadcrumbDispatch, data])

  if (isLoading) {
    return <FormScreenSkeleton />
  }

  if (!data) return null

  return <PlaylistForm playlist={data} />
}
export default Playlist
