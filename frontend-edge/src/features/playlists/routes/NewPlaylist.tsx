import React, { useEffect } from 'react'

import { PlaylistForm } from '../components/PlaylistForm'

const NewPlaylist = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })

  return <PlaylistForm />
}
export default NewPlaylist
