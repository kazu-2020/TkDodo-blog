import { Person } from './person'
import { Organization } from './organization'

export type Role = {
  person?: Person
  organization?: Organization
}
