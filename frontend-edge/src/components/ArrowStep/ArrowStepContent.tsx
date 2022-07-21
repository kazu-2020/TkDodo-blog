import { ReactNode, useContext } from 'react'
import { Box } from '@chakra-ui/react'

import { ArrowStepContext } from '@/components/ArrowStep/ArrowStepContext'

type Props = {
  index?: number
  children?: ReactNode
}

const hideStyle = {
  display: 'none'
}

const ArrowStepContent = ({
  index = undefined,
  children = undefined
}: Props) => {
  const { currentIndex } = useContext(ArrowStepContext).state
  const boxStyle = index === currentIndex ? {} : hideStyle

  return <Box sx={boxStyle}>{children}</Box>
}

export default ArrowStepContent
