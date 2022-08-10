import React, { useState } from 'react'
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { Box, Button } from '@chakra-ui/react'

import { ArrowStepContextProvider } from '@/components/ArrowStep/ArrowStepContext'
import { ArrowStepContent } from '@/components/ArrowStep/ArrowStepContent'

import { ArrowStep } from './ArrowStep'

export default {
  component: ArrowStep
} as ComponentMeta<typeof ArrowStep>

export const Default: ComponentStoryObj<typeof ArrowStep> = {
  render: (args) => (
    <ArrowStepContextProvider>
      <ArrowStep {...args} />
    </ArrowStepContextProvider>
  ),
  args: {
    items: [
      { title: 'リスト (NItemList)', isSuccess: true, hasError: false },
      { title: '記事 (NArticle)', isSuccess: false, hasError: true },
      { title: '基本情報(NSeries)', isSuccess: false, hasError: false }
    ]
  }
}

export const ChangeContent: ComponentStoryObj<typeof ArrowStep> = {
  // eslint-disable-next-line max-lines-per-function
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSuccessList, setSuccessList] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [hasErrorList, setErrorList] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSuccessArticle, setSuccessArticle] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [hasErrorArticle, setErrorArticle] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSuccessSeries, setSuccessSeries] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
}
