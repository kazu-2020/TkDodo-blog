import { useContext } from 'react'
import { Box, Flex } from '@chakra-ui/react'

import { ArrowStepItem } from './ArrowStepItem'
import { ArrowStepContext } from './ArrowStepContext'

type StepItem = {
  title: string
  isSuccess?: boolean
  hasError?: boolean
}

type Props = {
  items: StepItem[]
}

export const ArrowStep = ({ items = [] }: Props) => {
  const arrowStepContext = useContext(ArrowStepContext)
  const onClickStep = (index: number) => {
    arrowStepContext.dispatch({ currentIndex: index })
  }

  const { currentIndex } = arrowStepContext.state

  return (
    <Flex wrap="nowrap" justify="center">
      {items.map((item, index) => (
        <Box flex="1" key={item.title}>
          <ArrowStepItem
            title={item.title}
            isSuccess={item.isSuccess}
            hasError={item.hasError}
            isCurrent={index === currentIndex}
            onClick={() => onClickStep(index)}
          />
        </Box>
      ))}
    </Flex>
  )
}
