import { Badge } from '@chakra-ui/react'

type Props = {
  prefix?: string
  text: string
  onCopy: () => void
}

export const TextCopyBadge = ({
  prefix = '',
  text = '',
  onCopy = () => {}
}: Props) => (
  <Badge
    ml="1"
    px={3}
    py={0.5}
    fontSize="xs"
    variant="solid"
    colorScheme="teal"
    borderRadius="xl"
    cursor="pointer"
    onClick={() => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          onCopy()
        })
      }
    }}
  >
    {prefix ? `${prefix}: ${text}` : text}
  </Badge>
)
