import { useMutation } from '@tanstack/react-query'

import { Announcement } from '@/types/announcement'
import { MutationConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type DeleteAnnouncementDTO = {
  id: string
}

const deleteAnnouncement = async ({
  id
}: DeleteAnnouncementDTO): Promise<Announcement> => {
  const res = await axios.delete(`/announcements/${id}`)

  return res.data
}

type UseDeleteAnnouncementOptions = {
  config?: MutationConfig<typeof deleteAnnouncement>
}

export const useDeleteAnnouncement = ({
  config
}: UseDeleteAnnouncementOptions) =>
  useMutation({
    mutationFn: deleteAnnouncement,
    ...config
  })
