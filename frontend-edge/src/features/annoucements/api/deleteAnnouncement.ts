import { useMutation } from '@tanstack/react-query'

import { Announcement } from '@/types/announcement'
import { MutationConfig, queryClient } from '@/lib/react-query'
import axios from '@/lib/axios'

type DeleteAnnouncementDTO = {
  id: string
}

const deleteAnnouncement = ({ id }: DeleteAnnouncementDTO) =>
  axios.delete<Announcement>(`/announcements/${id}`)

type UseDeleteAnnouncementOptions = {
  config?: MutationConfig<typeof deleteAnnouncement>
}

export const useDeleteAnnouncement = ({
  config
}: UseDeleteAnnouncementOptions) =>
  useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements'])
    },
    mutationFn: deleteAnnouncement,
    ...config
  })
