import { useQuery } from '@tanstack/react-query'

import { Pagination } from '@/types/pagination'
import { Announcement } from '@/types/announcement'
import { QueryConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type Response = {
  announcements: Announcement[]
  pagination: Pagination
}

type Params = {
  page?: number
  per?: number
}

const getAnnouncements = async (params: Params): Promise<Response> => {
  const res = await axios.get('/announcements', {
    params
  })

  return res.data
}

type UseAnnouncementsOptions = {
  params: Params
  config?: QueryConfig<typeof getAnnouncements, Error>
}

export const useAnnouncements = ({ params, config }: UseAnnouncementsOptions) =>
  useQuery<Response, Error>(
    ['announcements', params],
    () => getAnnouncements(params),
    {
      keepPreviousData: true,
      ...config
    }
  )
