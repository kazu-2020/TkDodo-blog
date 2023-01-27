import snakecaseKeys from 'snakecase-keys'
import { useMutation } from '@tanstack/react-query'

import { Announcement } from '@/types/announcement'
import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type UpdateAnnouncementDTO = {
  id: string
  data: Pick<Announcement, 'status' | 'contents'>
}

const updateAnnouncement = async ({
  id,
  data
}: UpdateAnnouncementDTO): Promise<Announcement> => {
  const res = await axios.patch(`/announcements/${id}`, {
    announcement: snakecaseKeys(data)
  })

  return res.data
}

type UseUpdateAnnouncementOptions = {
  config?: MutationConfig<typeof updateAnnouncement>
}

export const useUpdateAnnouncement = ({
  config
}: UseUpdateAnnouncementOptions) =>
  useMutation({
    mutationFn: updateAnnouncement,
    ...config
  })
