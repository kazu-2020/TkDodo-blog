import videojs from 'video.js'
import { useEffect, useRef } from 'react'
import 'video.js/dist/video-js.css'
import { Box } from '@chakra-ui/react'

type Props = {
  src: string
}

export const Video = ({ src }: Props) => {
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const playerRef = useRef<videojs.Player | null>(null)

  useEffect(() => {
    if (!playerRef.current) {
      const placeholderElement = placeholderRef.current
      const videoElement = placeholderElement?.appendChild(
        document.createElement('video-js')
      )

      const options = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src
          }
        ]
      }
      if (videoElement) {
        playerRef.current = videojs(videoElement, options, () => {})
      }
    }
  }, [src, placeholderRef])

  useEffect(() => {
    const player = playerRef.current
    return () => {
      if (player) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return <Box ref={placeholderRef} w="100%" h="200px" />
}
