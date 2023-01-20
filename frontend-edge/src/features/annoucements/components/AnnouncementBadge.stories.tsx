import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { AnnouncementBadge } from './AnnouncementBadge'

export default {
  component: AnnouncementBadge
} as ComponentMeta<typeof AnnouncementBadge>

export const General: ComponentStoryObj<typeof AnnouncementBadge> = {
  args: {
    status: 'general'
  }
}

export const Improved: ComponentStoryObj<typeof AnnouncementBadge> = {
  args: {
    status: 'improved'
  }
}

export const Maintenance: ComponentStoryObj<typeof AnnouncementBadge> = {
  args: {
    status: 'maintenance'
  }
}

export const Attentive: ComponentStoryObj<typeof AnnouncementBadge> = {
  args: {
    status: 'attentive'
  }
}

export const Emergency: ComponentStoryObj<typeof AnnouncementBadge> = {
  args: {
    status: 'emergency'
  }
}
