import { ImageHash } from './image_hash'

export type TvEventData = {
  name?: string
  image: ImageHash
  startDate?: string
  endDate?: string
  location?: string
  address?: string
  url?: string
}
