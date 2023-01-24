import { useQuery } from '@tanstack/react-query'

import { Announcement } from '@/types/announcement'
import { QueryConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type Response = {
  announcement: Announcement
}

type Params = {
  announcementId: string
}

const getAnnouncement = async ({
  announcementId
}: Params): Promise<Response> => {
  const res = await axios.get(`/announcements/${announcementId}`)

  return res.data
}

type UseAnnouncementsOptions = {
  params: Params
  config?: QueryConfig<typeof getAnnouncement, Error>
}

export const useAnnouncement = ({ params, config }: UseAnnouncementsOptions) =>
  useQuery<Response, Error>(
    ['announcement', params],
    () => getAnnouncement(params),
    { ...config }
  )
