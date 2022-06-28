import { Outlet, Route, Routes } from 'react-router-dom'

import { SeriesDecks, SeriesDeck, NewSeriesDeck } from '@/features/series-decks'
import {
  RecommendDecks,
  RecommendDeck,
  NewRecommendDeck
} from '@/features/recommend-decks'
import { Playlist, Playlists, NewPlaylist } from '@/features/playlists'
import NotFound from '@/features/misc/routes/NotFound'
import Layout from '@/components/Layout'
import Home from '@/components/Home'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="playlists" element={<Outlet />}>
          <Route index element={<Playlists />} />
          <Route path=":playlistUId" element={<Playlist />} />
          <Route path="new" element={<NewPlaylist />} />
        </Route>
        <Route path="recommend-decks" element={<Outlet />}>
          <Route index element={<RecommendDecks />} />
          <Route path=":playlistUId" element={<RecommendDeck />} />
          <Route path="new" element={<NewRecommendDeck />} />
        </Route>
        <Route path="series-decks" element={<Outlet />}>
          <Route index element={<SeriesDecks />} />
          <Route path=":playlistUId" element={<SeriesDeck />} />
          <Route path="new" element={<NewSeriesDeck />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
