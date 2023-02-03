
import { PropertySelect, SelectOption } from '@/components/Form/PropertySelect'

const options: SelectOption[] = [
  { value: '020', label: 'スポーツ全般' },
  { value: '070', label: '音楽全般' },
  { value: '092', label: '自然' },
  { value: '093', label: '科学' },
  { value: '096', label: '芸術' },
  { value: '110', label: '福祉全般' }
]

export const ThemeGenreSelect = () => (
    <PropertySelect
      name="themeGenreCode"
      label="ジャンル(テーマ)"
      schemaName="Theme Genre"
      placeholder="選択して下さい"
      {...{ options }}
    />
  )
