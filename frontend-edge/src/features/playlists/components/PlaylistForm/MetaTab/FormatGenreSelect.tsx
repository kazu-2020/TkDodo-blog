import { PropertySelect, SelectOption } from '@/components/Form/PropertySelect'

const options: SelectOption[] = [
  { value: '00', label: 'ジャンルレス' },
  { value: '01', label: '報道' },
  { value: '02', label: 'ドキュメンタリー' },
  { value: '03', label: 'ドラマ' },
  { value: '04', label: 'アニメ' },
  { value: '05', label: 'バラエティ' },
  { value: '06', label: '映画' },
  { value: '08', label: 'PR・お知らせ' },
  { value: '09', label: '講座' }
]

export const FormatGenreSelect = () => (
    <PropertySelect
      name="formatGenreCode"
      label="ジャンル(フォーマット)"
      schemaName="Format Genre"
      placeholder="選択して下さい"
      {...{ options }}
    />
  )
