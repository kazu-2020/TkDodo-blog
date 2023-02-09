import { nanoid } from 'nanoid'
import { Skeleton, SkeletonProps } from '@chakra-ui/react'

type TableRowSkeletonProps = {
  columnCount?: number
} & SkeletonProps

const TableRowSkeleton = ({
  columnCount = 5,
  ...skeletonProps
}: TableRowSkeletonProps) => (
  <tr>
    {[...Array(columnCount)].map(() => (
      <Skeleton key={nanoid()} as="td" h={10} {...skeletonProps} />
    ))}
  </tr>
)

type TableRowSkeletonsProps = {
  rowCount?: number
} & TableRowSkeletonProps

export const TableRowSkeletons = ({
  rowCount = 20,
  ...rowSkeletonProps
}: TableRowSkeletonsProps) => (
  <>
    {[...Array(rowCount)].map(() => (
      <TableRowSkeleton key={nanoid()} {...rowSkeletonProps} />
    ))}
  </>
)
