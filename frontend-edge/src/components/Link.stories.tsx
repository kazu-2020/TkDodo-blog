import { ComponentMeta } from '@storybook/react'

import Link from './Link'

export default {
  title: 'Components/Link',
  component: Link,
  parameters: {
    controls: { expanded: true }
  }
} as ComponentMeta<typeof Link>

const Template = () => <Link to="/">Hello</Link>

export const Default = Template.bind({})
