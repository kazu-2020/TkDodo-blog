import axios from '@/lib/axios'
import { MutationConfig } from '@/lib/react-query'
import { Announcement } from '@/types/announcement'
import { useMutation } from '@tanstack/react-query'
import snakecaseKeys from 'snakecase-keys'

type CreateAnnouncementDTO = Pick<Announcement, 'status' | 'contents'>

const createAnnouncement = async (
  data: CreateAnnouncementDTO
): Promise<Announcement> => {
  const res = await axios.post(`/announcements`, {
    announcement: snakecaseKeys(data)
  })

  return res.data
}

type UseCreateAnnouncementOptions = {
  config?: MutationConfig<typeof createAnnouncement>
}

export const useCreateAnnouncement = ({
  config
}: UseCreateAnnouncementOptions) =>
  useMutation({
    mutationFn: createAnnouncement,
    ...config
  })
