import { devtools } from 'zustand/middleware'
import create from 'zustand'

type CropperImageModalStore = {
  inputImage: HTMLImageElement | undefined
  setInputImage: (value: HTMLImageElement | undefined) => void
  imageMimeType: string | undefined
  setImageMimeType: (value: string | undefined) => void
  filledImage: HTMLImageElement | undefined
  setFilledImage: (value: HTMLImageElement | undefined) => void
  filledImageType: string | undefined
  setFilledImageType: (value: string | undefined) => void
  croppedImageData: string | undefined
  setCroppedImageData: (value: string | undefined) => void
}

export const useCropperImageModalStore = create<CropperImageModalStore>()(
  devtools((set) => ({
    inputImage: undefined,
    setInputImage: (inputImage) => set({ inputImage }),
    imageMimeType: undefined,
    setImageMimeType: (imageMimeType) => set({ imageMimeType }),
    filledImage: undefined,
    setFilledImage: (filledImage) => set({ filledImage }),
    filledImageType: undefined,
    setFilledImageType: (filledImageType) => set({ filledImageType }),
    croppedImageData: undefined,
    setCroppedImageData: (croppedImageData) => set({ croppedImageData })
  }))
)
