import useBreadcrumbs, { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import { useLocation } from 'react-router-dom'
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  StyleProps
} from '@chakra-ui/react'

import Link from '../Link'

import { BreadcrumbLabel } from './BreadcrumbLabel'

export const Breadcrumb = (props: StyleProps) => {
  const breadcrumbs = useBreadcrumbs(
    BreadcrumbLabel as BreadcrumbsRoute<string>[]
  )
  const location = useLocation()

  return (
    <ChakraBreadcrumb {...props}>
      {breadcrumbs.map(({ match, breadcrumb }) => {
        const isCurrentPage = location.pathname === match.pathname
        return isCurrentPage ? (
          <BreadcrumbItem
            key={match.pathname}
            fontSize="sm"
            color="disabled"
            isCurrentPage
          >
            {breadcrumb}
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={match.pathname} fontSize="sm" color="link">
            <Link to={match.pathname}>{breadcrumb}</Link>
          </BreadcrumbItem>
        )
      })}
    </ChakraBreadcrumb>
  )
}
