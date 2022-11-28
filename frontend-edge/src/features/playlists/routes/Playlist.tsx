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

  const { playlistUid } = useParams()
  const { data, isLoading } = usePlaylist(playlistUid)

  useEffect(() => {
    window.scrollTo(0, 0)

    // TODO: 要原因調査
    // 更新後に name が空のオブジェクト（name: {}）で渡ってくるため暫定対応として、文字列型のチェックを追加しています。
    if (
      typeof breadcrumbDispatch === 'function' &&
      typeof data?.name === 'string'
    ) {
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
