import { ChangeEventHandler } from 'react'
import { FormControl, FormLabel, Switch } from '@chakra-ui/react'

type Props = {
  onChange?: ChangeEventHandler<HTMLInputElement>
}

const ArticleModeSwitch = ({ onChange = undefined }: Props) => (
  <FormControl display="flex" alignItems="center">
    <Switch id="article-mode" colorScheme="teal" onChange={onChange} />
    <FormLabel htmlFor="article-mode" mb="0" ml="3" color="gray.600">
      記事モード
    </FormLabel>
  </FormControl>
)

export default ArticleModeSwitch
