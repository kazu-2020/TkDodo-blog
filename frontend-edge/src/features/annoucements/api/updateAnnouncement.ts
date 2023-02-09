import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { Announcement } from '@/types/announcement'
import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type UpdateAnnouncementDTO = {
  id: string
  data: Pick<Announcement, 'status' | 'contents'>
}

const updateAnnouncement = ({ id, data }: UpdateAnnouncementDTO) =>
  axios.patch<Announcement>(`/announcements/${id}`, {
    announcement: snakecaseKeys(data)
  })

type UseUpdateAnnouncementOptions = {
  config?: MutationConfig<typeof updateAnnouncement>
}

export const useUpdateAnnouncement = ({
  config
}: UseUpdateAnnouncementOptions = {}) =>
  useMutation({
    mutationFn: updateAnnouncement,
    ...config
  })
