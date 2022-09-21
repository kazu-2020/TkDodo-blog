import { RiPencilFill, MdDelete } from 'react-icons/all'
import React from 'react'
import {
  HStack,
  Image,
  Box,
  Button,
  Stack,
  Flex,
  ImageProps
} from '@chakra-ui/react'

type OverlayImageType = {
  onEdit: () => void
  onRemove: () => void
  isInvalid: boolean
} & ImageProps

export const PlaylistImageFormItemImage = ({
  onEdit,
  onRemove,
  isInvalid,
  ...props
}: OverlayImageType) => (
  <HStack>
    <Box
      sx={{
        position: 'relative'
      }}
      _hover={{
        '.overlay': { opacity: 0.9 }
      }}
    >
      <Image {...props} sx={isInvalid ? { border: '2px solid red' } : {}} />
      <Flex
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          height: '100%',
          width: '100%',
          opacity: 0,
          transition: '.2s ease',
          backgroundColor: 'black'
        }}
        align="center"
        justify="center"
      >
        <Stack m={3} spacing={3}>
          <Button
            rightIcon={<RiPencilFill />}
            size="md"
            onClick={() => {
              onEdit()
            }}
          >
            編集
          </Button>
          <Button
            rightIcon={<MdDelete />}
            size="md"
            color="red"
            onClick={() => {
              onRemove()
            }}
          >
            削除
          </Button>
        </Stack>
      </Flex>
    </Box>
  </HStack>
)
