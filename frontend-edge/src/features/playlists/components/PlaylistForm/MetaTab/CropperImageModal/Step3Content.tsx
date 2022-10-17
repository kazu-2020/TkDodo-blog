import { MdCheck } from 'react-icons/all'
import { useFormContext } from 'react-hook-form'
import React, { ReactElement } from 'react'
import { useSteps } from 'chakra-ui-steps'
import { Box, Button, Center, HStack, Image, Text } from '@chakra-ui/react'

import { PlaylistFormInputs } from '@/features/playlists/types'
import { useCropperImageModalStore } from '@/features/playlists/stores/cropperImageModal'

const willCreateSizeTexts = (
  imageType: 'logo' | 'eyecatch' | 'hero'
): ReactElement => {
  switch (imageType) {
    case 'logo':
      return (
        <>
          <Text>・縦1,080 ✕ 横1,080px</Text>
          <Text>・縦640 ✕ 横640px</Text>
          <Text>・縦200 ✕ 横200px</Text>
        </>
      )
    case 'eyecatch':
      return (
        <>
          <Text>・縦1,080 ✕ 横1,920px</Text>
          <Text>・縦720 ✕ 横1,280px</Text>
          <Text>・縦522 ✕ 横928px</Text>
          <Text>・縦360 ✕ 横640px</Text>
        </>
      )
    case 'hero':
      return (
        <>
          <Text>・縦640 ✕ 横1,920px</Text>
          <Text>・縦360 ✕ 横1,080px</Text>
        </>
      )
    default:
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>
  }
}
export const Step3Content = ({
  imageType,
  steps,
  onClose
}: {
  imageType: 'logo' | 'eyecatch' | 'hero'
  steps: ReturnType<typeof useSteps>
  onClose: () => void
}) => {
  const { setInputImage, croppedImageData, setCroppedImageData } =
    useCropperImageModalStore((state) => ({
      setInputImage: state.setInputImage,
      croppedImageData: state.croppedImageData,
      setCroppedImageData: state.setCroppedImageData
    }))

  const { setValue, trigger } = useFormContext<PlaylistFormInputs>()

  return (
    <>
      <Box py={4}>
        <Text>生成される画像を確認してください</Text>
      </Box>
      <Center
        backgroundImage={
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC')"
        }
        backgroundColor="white"
        backgroundRepeat="repeat"
        height="410"
      >
        <Image
          src={croppedImageData || ''}
          maxHeight="400"
          objectFit="contain"
        />
      </Center>
      <Box alignSelf="center" my={4}>
        <Text mb={2}>この画像をもとに下記サイズの画像を生成します。</Text>
        {willCreateSizeTexts(imageType)}
      </Box>

      <HStack justifyContent="center" pt={4}>
        <Button mr={4} onClick={steps.prevStep} variant="outline">
          戻る
        </Button>
        <Button
          data-testid="crop-image-button"
          onClick={() => {
            setValue(`${imageType}ImageSrc`, croppedImageData || '', {
              shouldDirty: true,
              shouldValidate: true
            })
            trigger()
            setInputImage(undefined)
            setCroppedImageData(undefined)
            steps.reset()
            onClose()
          }}
          colorScheme="green"
          leftIcon={<MdCheck />}
        >
          決定
        </Button>
      </HStack>
    </>
  )
}
