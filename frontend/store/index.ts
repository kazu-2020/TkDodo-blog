import { getAccessorType } from 'typed-vuex'

import * as loading from './loading'
import * as playlists from './playlists'
import * as playlisticles from './playlisticles'
import * as sameAs from './sameAs'

export const accessorType = getAccessorType({
  modules: {
    loading,
    playlists,
    playlisticles,
    sameAs,
  },
})
