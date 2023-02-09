import { useQuery } from '@tanstack/react-query'

import { User } from '@/types/user'
import { Pagination } from '@/types/pagination'
import { QueryConfig } from '@/lib/react-query'
import axios from '@/lib/axios'

type Response = {
  users: User[]
  pagination: Pagination
}

type Params = {
  keyword: string
  role?: string
  page?: number
}

const getUsers = async (params: Params) => {
  const res = await axios.get<Response>('/users', {
    params
  })

  return res.data
}

type UseUsersOptions = {
  params: Params
  config?: QueryConfig<typeof getUsers, Error>
}

export const useUsers = ({ params, config }: UseUsersOptions) =>
  useQuery<Response, Error>(['users', params], () => getUsers(params), {
    keepPreviousData: true,
    ...config
  })
