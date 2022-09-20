import { Outlet, Route, Routes } from 'react-router-dom'

// FIXME: Auth0を有効にした後、コメントアウト
// import { ProtectedRoute } from '@/lib/auth0/ProtectedRoute'

import {
  SeriesDecks,
  SeriesDeck,
  NewSeriesDeck,
  ConfigSeriesDeck
} from '@/features/series-decks'
import {
  RecommendDecks,
  RecommendDeck,
  NewRecommendDeck,
  ConfigRecommendDeck
} from '@/features/recommend-decks'
import { Playlist, Playlists, NewPlaylist } from '@/features/playlists'
import NotFound from '@/features/misc/routes/NotFound'
import Layout from '@/components/Layout'
import Home from '@/components/Home'

const AppRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<ProtectedRoute component={Layout} />}>  FIXME: Auth0の設定を変えてもらう */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="playlists" element={<Outlet />}>
        <Route index element={<Playlists />} />
        <Route path=":playlistUId" element={<Playlist />} />
        <Route path="new" element={<NewPlaylist />} />
      </Route>
      <Route path="recommend-decks" element={<Outlet />}>
        <Route index element={<RecommendDecks />} />
        <Route path=":recommendDeckId" element={<Outlet />}>
          <Route index element={<RecommendDeck />} />
          <Route path="config" element={<ConfigRecommendDeck />} />
        </Route>
        <Route path="new" element={<NewRecommendDeck />} />
      </Route>
      <Route path="series-decks" element={<Outlet />}>
        <Route index element={<SeriesDecks />} />
        <Route path=":seriesDeckId" element={<Outlet />}>
          <Route index element={<SeriesDeck />} />
          <Route path="config" element={<ConfigSeriesDeck />} />
        </Route>
        <Route path="new" element={<NewSeriesDeck />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default AppRoutes
