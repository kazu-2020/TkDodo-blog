import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Pagination } from '@/components/Pagination'

import { AnnouncementList } from './AnnouncementList' // eslint-disable-line import/no-cycle

export default {
  component: AnnouncementList
} as ComponentMeta<typeof AnnouncementList>

export const Default: ComponentStoryObj<typeof AnnouncementList> = {
  render: (args) => <AnnouncementList {...args} />,
  args: {
    annoucments: [
      {
        id: 1,
        status: 'general',
        contents: 'マニュアルを更新しました  https://example.com',
        dataCreated: '2023-01-12T10:04:03+09:00'
      },
      {
        id: 2,
        status: 'improved',
        contents:
          '●●●機能をリリースしました。マニュアルはこちら  https://example.com',
        dataCreated: '2023-01-12T10:04:03+09:00'
      },
      {
        id: 3,
        status: 'attentive',
        contents:
          '【重要】システムの利用にあたって、必ずご確認ください https://example.com',
        dataCreated: '2023-01-12T10:04:03+09:00'
      },
      {
        id: 4,
        status: 'maintenance',
        contents: 'ver. X.X.X がリリースされました！ https://example.com',
        dataCreated: '2023-01-12T10:04:03+09:00'
      },
      {
        id: 5,
        status: 'emergency',
        contents: '緊急のお知らせ  https://example.com',
        dataCreated: '2023-01-12T10:04:03+09:00'
      }
    ]
  }
}

export const Editable = {
  ...Default,
  args: {
    ...Default.args,
    isEditable: true
  }
}

export const ShowMore = {
  ...Default,
  args: {
    ...Default.args,
    isSawMore: true
  }
}

export const WithPagination = {
  ...Editable,
  args: {
    ...Editable.args,
    pagination: (
      <Pagination page={1} offset={20} totalCount={101} pageCount={5} />
    )
  }
}
