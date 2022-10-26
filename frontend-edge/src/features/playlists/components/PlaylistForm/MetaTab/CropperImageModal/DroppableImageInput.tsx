import { MdCloudUpload, MdOutlineCloudUpload } from 'react-icons/all'
import { useDropzone } from 'react-dropzone'
import React, { useCallback } from 'react'
import Compressor from 'compressorjs'
import { Box, Center, Icon, HStack } from '@chakra-ui/react'

import { useCropperImageModalStore } from '@/features/playlists/stores/cropperImageModal'

const isAllowedFileType = (file: File): boolean =>
  file.type === 'image/jpg' ||
  file.type === 'image/jpeg' ||
  file.type === 'image/png'

const isAllowedFileSize = (file: File): boolean => {
  const limitSize = 10 * 1024 ** 2 // 10MB
  return file.size < limitSize
}

const validate = (file: File): boolean => {
  if (!isAllowedFileType(file)) {
    // eslint-disable-next-line no-alert
    alert('対応形式のファイルを選択してください')
    return false
  }
  if (!isAllowedFileSize(file)) {
    // eslint-disable-next-line no-alert
    alert('ファイルが大きすぎます（上限10MB）')
    return false
  }
  return true
}

export const DroppableImageInput = () => {
  const { setInputImage, setImageMimeType } =
    useCropperImageModalStore((state) => ({
      setInputImage: state.setInputImage,
      setImageMimeType: state.setImageMimeType,
    }))

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!validate(file)) {
      return
    }

    setImageMimeType(file.type)

    // eslint-disable-next-line no-new
    new Compressor(file, {
      maxWidth: 2880,
      maxHeight: 2880,
      success(result) {
        const reader = new FileReader()
        reader.onload = () => {
          const image = new Image()
          if (typeof reader.result === 'string') {
            image.src = reader.result
            setInputImage(image)
          }
        }
        reader.readAsDataURL(result)
      },
      error(err) {
        // eslint-disable-next-line no-console
        console.log(err.message)
      },
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Box
      {...getRootProps()}
      sx={{ height: '400px' }}
      cursor="pointer"
      bgColor="gray.100"
    >
      <Center
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        <input type="file" {...getInputProps()} />
        <HStack spacing={3}>
          {isDragActive ? (
            <Icon as={MdCloudUpload} w={16} h={16} />
          ) : (
            <Icon as={MdOutlineCloudUpload} w={16} h={16} />
          )}
          <span>
            クリック or ここにドラッグで画像をアップロード
            <br />
            (対応形式: jpg / jpeg / png)
          </span>
        </HStack>
      </Center>
    </Box>
  )
}
