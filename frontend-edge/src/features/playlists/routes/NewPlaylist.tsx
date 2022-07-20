import { useState } from 'react'
import { Button } from '@chakra-ui/react'

import { ArrowStepContextProvider } from '@/features/misc/components/arrowstep/ArrowStepContext'
import ArrowStepContent from '@/components/ArrowStepContent'
import ArrowStep from '@/components/ArrowStep'

const NewPlaylist = () => {
  const [isSuccessList, setSuccessList] = useState(false)
  const [hasErrorList, setErrorList] = useState(false)
  const [isSuccessArticle, setSuccessArticle] = useState(false)
  const [hasErrorArticle, setErrorArticle] = useState(false)
  const [isSuccessSeries, setSuccessSeries] = useState(false)
  const [hasErrorSeries, setErrorSeries] = useState(false)
  const steps = [
    {
      title: 'リスト (NItemList)',
      isSuccess: isSuccessList,
      hasError: hasErrorList
    },
    {
      title: '記事 (NArticle)',
      isSuccess: isSuccessArticle,
      hasError: hasErrorArticle
    },
    {
      title: '基本情報(NSeries)',
      isSuccess: isSuccessSeries,
      hasError: hasErrorSeries
    }
  ]

  return (
    <main style={{ padding: '1rem' }}>
      <ArrowStepContextProvider>
        <ArrowStep items={steps} />
        <ArrowStepContent index={0}>
          <h2>New Play List 1</h2>
          <Button onClick={() => setSuccessList(!isSuccessList)}>
            switch success badge
          </Button>
          <Button onClick={() => setErrorList(!hasErrorList)}>
            switch error badge
          </Button>
        </ArrowStepContent>
        <ArrowStepContent index={1}>
          <h2>New Play List 2</h2>
          <Button onClick={() => setSuccessArticle(!isSuccessArticle)}>
            switch success badge
          </Button>
          <Button onClick={() => setErrorArticle(!hasErrorArticle)}>
            switch error badge
          </Button>
        </ArrowStepContent>
        <ArrowStepContent index={2}>
          <h2>New Play List 3</h2>
          <Button onClick={() => setSuccessSeries(!isSuccessSeries)}>
            switch success badge
          </Button>
          <Button onClick={() => setErrorSeries(!hasErrorSeries)}>
            switch error badge
          </Button>
        </ArrowStepContent>
      </ArrowStepContextProvider>
    </main>
  )
}
export default NewPlaylist
