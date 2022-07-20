import { MouseEventHandler } from 'react'
import { CSSObject, Flex, Text } from '@chakra-ui/react'

type Props = {
  title: string
  isCurrent?: boolean
  isSuccess?: boolean
  hasError?: boolean
  onClick?: MouseEventHandler<HTMLElement>
}

const errorBadgeStyle = {
  color: '#ab0000',
  fontSize: '0.5rem',
  position: 'relative',
  top: '-9px'
}

const successBadgeStyle = {
  color: '#009688',
  fontSize: '0.5rem',
  position: 'relative',
  top: '-9px'
}

const labelStyle = {
  position: 'relative'
}

const stepStyle = {
  fontSize: '1.15rem',
  color: '#000',
  cursor: 'pointer',
  position: 'relative',
  backgroundColor: 'white',
  border: '1px solid #cecece',
  height: '52px'
}

const stepBeforeStyle: CSSObject = {
  content: '" "',
  position: 'absolute',
  top: '0',
  right: '-21px',
  width: '0',
  height: '0',
  borderTop: '26px solid transparent',
  borderBottom: '25px solid transparent',
  borderLeft: '19px solid #cecece',
  zIndex: '2'
}

const stepAfterStyle: CSSObject = {
  content: '" "',
  position: 'absolute',
  top: '0',
  right: '-19px',
  width: '0',
  height: '0',
  borderTop: '26px solid transparent',
  borderBottom: '25px solid transparent',
  borderLeft: '19px solid white',
  zIndex: '3'
}

const currentStepStyle: CSSObject = {
  color: 'white',
  backgroundColor: '#c6bebb',
  fontWeight: 'bold'
}

const currentStepAfterStyle: CSSObject = {
  borderLeft: '19px solid #c6bebb'
}

const ArrowStepItem = ({
  title = '',
  isCurrent = false,
  isSuccess = false,
  hasError = false,
  onClick = undefined
}: Props) => (
  <Flex
    onClick={onClick}
    justifyContent="center"
    alignItems="center"
    sx={{ ...stepStyle, ...(isCurrent ? currentStepStyle : {}) }}
    _before={stepBeforeStyle}
    _after={{
      ...stepAfterStyle,
      ...(isCurrent ? currentStepAfterStyle : {})
    }}
  >
    {hasError && <Text sx={errorBadgeStyle}>●</Text>}
    {!hasError && isSuccess && <Text sx={successBadgeStyle}>●</Text>}
    <Text sx={labelStyle}>{title}</Text>
  </Flex>
)

export default ArrowStepItem
