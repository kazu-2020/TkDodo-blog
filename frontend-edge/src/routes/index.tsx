import { Outlet, Route, Routes } from 'react-router-dom'

import { isTomigayaEnv } from '@/utils/env'
import { ProtectedRoute } from '@/lib/auth0/ProtectedRoute'
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
import { HomePage } from '@/features/home/routes'
import {
  EditAnnouncement,
  NewAnnouncement,
  Announcements
} from '@/features/annoucements/routes'
import Layout from '@/components/Layout'

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        !isTomigayaEnv() ? <Layout /> : <ProtectedRoute component={Layout} />
      }
    >
      <Route index element={<HomePage />} />
      <Route path="playlists" element={<Outlet />}>
        <Route index element={<Playlists />} />
        <Route path=":playlistUid" element={<Playlist />} />
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
      <Route path="announcements" element={<Announcements />} />
      <Route path="announcements/new" element={<NewAnnouncement />} />
      <Route
        path="announcements/:announcementId/edit"
        element={<EditAnnouncement />}
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
)

export default AppRoutes
