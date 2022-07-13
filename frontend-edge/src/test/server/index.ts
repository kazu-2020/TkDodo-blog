import { REACT_APP_API_MOCKING } from '@/config'

export const initMocks = () => {
  if (REACT_APP_API_MOCKING === 'true') {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      const { server } = require('./server')
      server.listen()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      const { worker } = require('./browser')
      worker.start()
    }
  }
}
