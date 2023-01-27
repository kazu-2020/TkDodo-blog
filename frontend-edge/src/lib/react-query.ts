import { AxiosError } from 'axios'
import {
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions
} from '@tanstack/react-query'

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true, // NOTE: 画面の一部だけ非同期で取る処理など useQueryのoptionで useErrorBoundary:false を設定しないとエラー画面に遷移してしまうので注意
    refetchOnWindowFocus: false,
    retry: false
  }
}

export const queryClient = new QueryClient({ defaultOptions: queryConfig })

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>

export type QueryConfig<
  QueryFnType extends (...args: any) => any,
  TError = undefined
> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>, TError>,
  'queryKey' | 'queryFn'
>

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >
