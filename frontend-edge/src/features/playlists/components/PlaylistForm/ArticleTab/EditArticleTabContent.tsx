import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Container,
  Divider,
  Flex,
  FormErrorMessage,
  Heading,
  Text,
  Textarea
} from '@chakra-ui/react'

import { setUndefinedOrString } from '@/lib/react-hook-form/utils'
import PlainTextParser from '@/lib/editorjs/plain_text_parser'
import { PlaylistFormInputs } from '@/features/playlists/types'
import { EditorInformationForm } from '@/features/playlists/components/PlaylistForm/ArticleTab/EditorInformationForm'
import { ArticleEditor } from '@/components/ArticleEditor/ArticleEditor'
import { ArrowStepContent } from '@/components/ArrowStep'

export const EditArticleTabContent = ({
  contentIndex
}: {
  contentIndex: number
}) => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue
  } = useFormContext<PlaylistFormInputs>()
  const [textLength, setTextLength] = useState(0)

  useEffect(() => {
    const editorData = getValues('editorData')
    if (editorData) {
      setTextLength(PlainTextParser.parse(editorData).length)
    }
  }, [])

  return (
    <ArrowStepContent index={contentIndex}>
      <Container maxW="650px">
        <Heading size="md" mb={2}>
          ヘッダー
        </Heading>
        <Textarea
          data-testid="markedHeader"
          {...register('markedHeader', {
            setValueAs: setUndefinedOrString
          })}
        />
        <FormErrorMessage>
          {errors.markedHeader && errors.markedHeader.message}
        </FormErrorMessage>
      </Container>

      <Divider my={6} borderColor="gray.400" />

      <Container maxW="650px">
        <input type="hidden" {...register('editorData')} />
        <Alert status="warning" mb={5}>
          <AlertIcon />
          <Box>
            <AlertDescription fontSize="xs">
              {/* eslint-disable-next-line no-irregular-whitespace */}
              {`コピーした文章や半角記号などは意図しない表示になる場合があります。半角記号（#　-　+　"　[　]　(　)　<　>　!　/　~　|　*　^　　.など）を起点に表示が意図通りになっていない場合は、全角文字に変更するか、その半角記号の前に（バックスラッシュ・半角）を入力してみてください。`}
            </AlertDescription>
          </Box>
        </Alert>
        <Flex justifyContent="space-between" mb={4}>
          <Heading size="md">記事本文</Heading>
          <Text size="sm" color="gray.400">
            {textLength}文字
          </Text>
        </Flex>
        <ArticleEditor
          defaultValue={getValues('editorData')}
          onChange={() => {}}
          onReady={() => {}}
          onSave={(data) => {
            setValue('editorData', data, { shouldDirty: true })
            setTextLength(PlainTextParser.parse(data).length)
          }}
        />
      </Container>

      <Divider my={6} borderColor="gray.400" />

      <Container maxW="650px" mb={5}>
        <Heading size="md" mb={2}>
          フッター
        </Heading>
        <Textarea
          data-testid="markedFooter"
          {...register('markedFooter', {
            setValueAs: setUndefinedOrString
          })}
        />
        <FormErrorMessage>
          {errors.markedFooter && errors.markedFooter.message}
        </FormErrorMessage>
      </Container>

      <Container maxW="650px">
        <EditorInformationForm />
      </Container>
    </ArrowStepContent>
  )
}
