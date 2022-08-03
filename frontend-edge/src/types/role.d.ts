import { Person } from './person'
import { Organization } from './organization'

export interface Role {
  person?: Person
  organization?: Organization
}
