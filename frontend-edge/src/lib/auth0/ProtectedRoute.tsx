import { ComponentType } from 'react'
import {
  withAuthenticationRequired,
  WithAuthenticationRequiredOptions
} from '@auth0/auth0-react'

export const ProtectedRoute = ({
  component,
  ...args
}: { component: ComponentType } & WithAuthenticationRequiredOptions) => {
  const Component = withAuthenticationRequired(component, args)
  return <Component />
}
