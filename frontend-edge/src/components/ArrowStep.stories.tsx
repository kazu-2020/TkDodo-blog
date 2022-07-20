import React, { useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { ArrowStepContextProvider } from '@/features/misc/components/arrowstep/ArrowStepContext'

import ArrowStep from './ArrowStep'
import ArrowStepContent from '@/components/ArrowStepContent'
import { Box, Button } from '@chakra-ui/react'

export default {
  title: 'Components/ArrowStep',
  component: ArrowStep
} as ComponentMeta<typeof ArrowStep>

const DefaultTemplate: ComponentStory<typeof ArrowStep> = (props) => (
  <ArrowStepContextProvider>
    <ArrowStep {...props} />
  </ArrowStepContextProvider>
)

const ChangeContentTemplate: ComponentStory<typeof ArrowStep> = () => {
  const [isSuccessList, setSuccessList] = useState(false)
  const [hasErrorList, setErrorList] = useState(false)
  const [isSuccessArticle, setSuccessArticle] = useState(false)
  const [hasErrorArticle, setErrorArticle] = useState(false)
  const [isSuccessSeries, setSuccessSeries] = useState(false)
  const [hasErrorSeries, setErrorSeries] = useState(false)
  const steps = [
    {
      title: 'Page1',
      isSuccess: isSuccessList,
      hasError: hasErrorList
    },
    {
      title: 'Page2',
      isSuccess: isSuccessArticle,
      hasError: hasErrorArticle
    },
    {
      title: 'Page3',
      isSuccess: isSuccessSeries,
      hasError: hasErrorSeries
    }
  ]

  return (
    <Box>
      <ArrowStepContextProvider>
        <ArrowStep items={steps} />
        <ArrowStepContent index={0}>
          <Box py={5} px={5} bg="red.100">
            <h2>Page1</h2>
            <Box py={5}>
              <Button
                mr={10}
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setSuccessList(!isSuccessList)}
              >
                switch success badge
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setErrorList(!hasErrorList)}
              >
                switch error badge
              </Button>
            </Box>
          </Box>
        </ArrowStepContent>
        <ArrowStepContent index={1}>
          <Box py={5} px={5} bg="orange.100">
            <h2>Page2</h2>
            <Box py={5}>
              <Button
                mr={10}
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setSuccessArticle(!isSuccessArticle)}
              >
                switch success badge
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setErrorArticle(!hasErrorArticle)}
              >
                switch error badge
              </Button>
            </Box>
          </Box>
        </ArrowStepContent>
        <ArrowStepContent index={2}>
          <Box py={5} px={5} bg="yellow.100">
            <h2>Page3</h2>
            <Box py={5}>
              <Button
                mr={10}
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setSuccessSeries(!isSuccessSeries)}
              >
                switch success badge
              </Button>
              <Button
                mr={10}
                colorScheme="blue"
                variant="outline"
                bg="white"
                onClick={() => setErrorSeries(!hasErrorSeries)}
              >
                switch error badge
              </Button>
            </Box>
          </Box>
        </ArrowStepContent>
      </ArrowStepContextProvider>
    </Box>
  )
}

export const Default = DefaultTemplate.bind({})
Default.args = {
  items: [
    { title: 'リスト (NItemList)', isSuccess: true, hasError: false },
    { title: '記事 (NArticle)', isSuccess: false, hasError: true },
    { title: '基本情報(NSeries)', isSuccess: false, hasError: false }
  ]
}

export const ChangeContent = ChangeContentTemplate.bind({})
