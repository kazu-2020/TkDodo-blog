import Cropper from 'react-cropper'
import React, { useRef } from 'react'
import { useSteps } from 'chakra-ui-steps'
import { Box, Button, HStack, Text } from '@chakra-ui/react'

import { aspectRatio } from '@/features/playlists/utils/playlistImage'
import { useCropperImageModalStore } from '@/features/playlists/stores/cropperImageModal'

export const Step2Content = ({
  imageType,
  steps
}: {
  imageType: 'logo' | 'eyecatch' | 'hero'
  steps: ReturnType<typeof useSteps>
}) => {
  const { inputImage, filledImage, filledImageType, setCroppedImageData } =
    useCropperImageModalStore((state) => ({
      inputImage: state.inputImage,
      filledImage: state.filledImage,
      filledImageType: state.filledImageType,
      setCroppedImageData: state.setCroppedImageData
    }))

  const cropperRef = useRef<HTMLImageElement>(null)

  return (
    <>
      <Box py={4}>
        <Text>範囲を選択してください</Text>
      </Box>
      <Cropper
        ref={cropperRef}
        src={filledImageType ? filledImage?.src : inputImage?.src}
        style={{ height: 400, width: '100%' }}
        dragMode="crop"
        aspectRatio={aspectRatio(imageType)}
        highlight={false}
        viewMode={2}
        zoomable={false}
        movable={false}
        guides={false}
        minCropBoxHeight={20}
        minCropBoxWidth={20}
        autoCropArea={1}
      />
      <HStack justifyContent="center" pt={4}>
        <Button mr={4} onClick={steps.prevStep} variant="outline">
          戻る
        </Button>
        <Button
          onClick={() => {
            const imageElement: any = cropperRef?.current
            const cropper: any = imageElement?.cropper
            setCroppedImageData(cropper.getCroppedCanvas().toDataURL())

            steps.nextStep()
          }}
          colorScheme="green"
        >
          次へ
        </Button>
      </HStack>
    </>
  )
}
