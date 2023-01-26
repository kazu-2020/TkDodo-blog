import { useForm, Controller } from 'react-hook-form'
import { useMemo } from 'react'
import { Select } from 'chakra-react-select'
import { render, screen } from '@testing-library/react'
import { composeStories } from '@storybook/testing-react'
import { Box, Button, Textarea } from '@chakra-ui/react'

import {
  ANNOUNCEMENT_STATUS,
  Announcement,
  AnnouncementStatus
} from '@/types/announcement'
import { FormFieldWrapper } from '@/components/Form/FormFiledWrapper'

import { convertAnnouncementStatus } from '../utils/convertAnnouncementStatus'
import { usePrompt } from '@/utils/form-guard'

type StatusOption = { label: string; value: AnnouncementStatus }

type FormInput = Pick<Announcement, 'status' | 'contents'>

type AnnouncementFormProps = {
  onSubmit: (data: FormInput) => void
  isEdit?: boolean
} & Partial<FormInput>

export const AnnouncementForm = ({
  onSubmit,
  isEdit,
  status,
  contents
}: AnnouncementFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<FormInput>({
    defaultValues: {
      status: status ?? 'general',
      contents: contents ?? ''
    }
  })

  const statusOption = useMemo<StatusOption[]>(
    () =>
      ANNOUNCEMENT_STATUS.map((announcementStatus) => ({
        label: convertAnnouncementStatus(announcementStatus),
        value: announcementStatus
      })),
    []
  )

  usePrompt(
    '編集中のデータがあります。ページを離れますか？',
    isDirty && !isSubmitting
  )

  return (
    <Box p={6} bg="white" boxShadow="md">
      {/*
        chakaraの「isRequired」とreact-hook-formの「required」 validationを同時に指定した場合、
        react-hook-formが動作するように「noValidate」を付与
      */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        data-testid={`announcement-${isEdit ? 'edit' : 'new'}-form`}
      >
        <Controller
          name="status"
          render={({ field: { onChange, value, ref } }) => (
            <FormFieldWrapper
              id="status"
              error={errors.status}
              label="種別"
              mb={8}
            >
              <Select
                options={statusOption}
                value={statusOption.find((option) => option.value === value)}
                onChange={(newValue) => {
                  if (newValue?.value) {
                    onChange(newValue.value)
                  }
                }}
                {...{ ref }}
              />
            </FormFieldWrapper>
          )}
          {...{ control }}
        />

        <FormFieldWrapper
          id="contents"
          error={errors.contents}
          isRequired
          label="お知らせ内容"
          mb={8}
        >
          <Textarea
            placeholder="内容を入力します（URLは自動的にリンクになります）"
            {...register('contents', {
              required: 'お知らせ内容を入力してください'
            })}
          />
        </FormFieldWrapper>

        <Button
          type="submit"
          isLoading={isSubmitting}
          color="white"
          bg="#FF9800"
          px={8}
          boxShadow="md"
          _hover={{ opacity: 0.6 }}
        >
          {isEdit ? '保存する' : '新規登録する'}
        </Button>
      </form>
    </Box>
  )
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest
  const stories = await import('./AnnouncementForm.stories') // eslint-disable-line import/no-cycle
  const { EmptyError } = composeStories(stories)

  describe('未入力で送信ボタンを押した場合', () => {
    it('「お知らせ内容を入力してください」が表示されること', async () => {
      const { container } = render(<EmptyError />)
      await EmptyError.play({ canvasElement: container })
      const errorMessage = await screen.findByText(
        'お知らせ内容を入力してください'
      )

      expect(errorMessage).toBeInTheDocument()
    })
  })
}
