import { GrPowerReset } from 'react-icons/all'
import React from 'react'
import { useSteps } from 'chakra-ui-steps'
import {
  Button,
  Flex,
  HStack,
  Image,
  Select,
  Spacer,
  Text
} from '@chakra-ui/react'

import { aspectRatio } from '@/features/playlists/utils/playlistImage'
import { createFilledBackgroundImageSrc } from '@/features/playlists/utils/filledImage'
import { useCropperImageModalStore } from '@/features/playlists/stores/cropperImageModal'
import { DroppableImageInput } from '@/features/playlists/components/PlaylistForm/MetaTab/CropperImageModal/DroppableImageInput'

export const Step1Content = ({
  imageType,
  steps
}: {
  imageType: 'logo' | 'eyecatch' | 'hero'
  steps: ReturnType<typeof useSteps>
}) => {
  const {
    inputImage,
    setInputImage,
    setFilledImage,
    filledImageType,
    setFilledImageType
  } = useCropperImageModalStore((state) => ({
    inputImage: state.inputImage,
    setInputImage: state.setInputImage,
    setFilledImage: state.setFilledImage,
    filledImageType: state.filledImageType,
    setFilledImageType: state.setFilledImageType
  }))

  return (
    <>
      <Flex py={4}>
        <Text>使用したい画像をアップロードしてください</Text>
        <Spacer />
        <Select
          placeholder="トリミング不可の画像は選択"
          size="sm"
          w="sm"
          onChange={(e) => {
            setFilledImageType(e.target.value)
          }}
        >
          <option value="dominant">背景を画像から抽出した色で埋める</option>
          <option value="black">背景を黒で埋める</option>
          <option value="white">背景を白で埋める</option>
        </Select>
      </Flex>
      {!inputImage?.src ? (
        <DroppableImageInput />
      ) : (
        <>
          <Image src={inputImage.src} height={400} objectFit="contain" />
          <HStack justifyContent="center" pt={4}>
            <Button
              mr={4}
              onClick={() => {
                setInputImage(undefined)
              }}
              variant="outline"
              leftIcon={<GrPowerReset />}
            >
              画像を変更する
            </Button>
            <Button
              onClick={async () => {
                // 背景を埋める
                if (filledImageType) {
                  const img = document.createElement('img')
                  img.src = await createFilledBackgroundImageSrc(
                    inputImage,
                    imageType,
                    aspectRatio(imageType),
                    filledImageType
                  )
                  setFilledImage(img)
                }
                steps.nextStep()
              }}
              colorScheme="green"
            >
              次へ
            </Button>
          </HStack>
        </>
      )}
    </>
  )
}
