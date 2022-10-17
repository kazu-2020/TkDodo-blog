import React, { useState } from 'react'
import { HStack, useDisclosure } from '@chakra-ui/react'

import { PlaylistImageFormItem } from '@/features/playlists/components/PlaylistForm/MetaTab/CropperImageModal/PlaylistImageFormItem'
import { CropperImageModal } from '@/features/playlists/components/PlaylistForm/MetaTab/CropperImageModal/CropperImageModal'

export const PlaylistImageForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [imageType, setImageType] = useState<'logo' | 'eyecatch' | 'hero'>(
    'logo'
  )

  return (
    <>
      <HStack spacing={2} mb={5}>
        <PlaylistImageFormItem
          imageType="logo"
          label="ロゴ"
          schemaName="Logo"
          onOpen={onOpen}
          setImageType={setImageType}
          width={140}
          height={140}
        />
         <PlaylistImageFormItem
          imageType="eyecatch"
          label="アイキャッチ"
          schemaName="Eyecatch"
          onOpen={onOpen}
          setImageType={setImageType}
          width={250}
          height={140}
         />
         <PlaylistImageFormItem
          imageType="hero"
          label="ヒーロー"
          schemaName="Hero"
          onOpen={onOpen}
          setImageType={setImageType}
          width={420}
          height={140}
         />
      </HStack>
      <CropperImageModal
        imageType={imageType}
        open={isOpen}
        onClose={onClose}
      />
    </>
  )
}
