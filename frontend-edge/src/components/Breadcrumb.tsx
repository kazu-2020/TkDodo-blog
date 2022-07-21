import useBreadcrumbs, { BreadcrumbsRoute } from 'use-react-router-breadcrumbs'
import { useLocation } from 'react-router-dom'
import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react'

import { BreadcrumbLabel } from '@/components/Breadcrumb/BreadcrumbLabel'

const Breadcrumb = (props: any) => {
  const breadcrumbs = useBreadcrumbs(
    BreadcrumbLabel as BreadcrumbsRoute<string>[]
  )
  const location = useLocation()
  const { mt } = props

  return (
    <ChakraBreadcrumb mt={mt} pt="8" pb="3" pl="6" pr="3">
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
            <BreadcrumbLink href={match.pathname}>{breadcrumb}</BreadcrumbLink>
          </BreadcrumbItem>
        )
      })}
    </ChakraBreadcrumb>
  )
}

Breadcrumb.defaultProps = {
  mt: 0
}

export default Breadcrumb
