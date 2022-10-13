import React from 'react'
import { Step, Steps, useSteps } from 'chakra-ui-steps'
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import 'cropperjs/dist/cropper.css'

import { useCropperImageModalStore } from '@/features/playlists/stores/cropperImageModal'

import { Step3Content } from './Step3Content'
import { Step2Content } from './Step2Content'
import { Step1Content } from './Step1Content'

export const CropperImageModal = ({
  imageType,
  onClose,
  open
}: {
  imageType: 'logo' | 'eyecatch' | 'hero'
  open: boolean
  onClose: () => void
}) => {
  const { setInputImage } = useCropperImageModalStore((state) => ({
    setInputImage: state.setInputImage
  }))

  const steps = useSteps({ initialStep: 0 })

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={open}
      onClose={() => {
        setInputImage(undefined)
        onClose()
      }}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>画像を編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <Flex
            flexDir="column"
            width="100%"
            data-testid="cropper-image-modal-body"
          >
            <Steps
              labelOrientation="vertical"
              size="sm"
              activeStep={steps.activeStep}
              pr={6}
              mb={3}
            >
              <Step label="画像を選択" key="画像を選択">
                <Step1Content imageType={imageType} steps={steps} />
              </Step>
              <Step label="範囲を選択" key="範囲を選択">
                <Step2Content imageType={imageType} steps={steps} />
              </Step>
              <Step label="確認" key="確認">
                <Step3Content
                  imageType={imageType}
                  steps={steps}
                  onClose={onClose}
                />
              </Step>
            </Steps>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
