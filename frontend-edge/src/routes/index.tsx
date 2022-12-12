import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import React from 'react'
import { LoginCallback, Security } from '@okta/okta-react'
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'

import { isTomigayaEnv } from '@/utils/env'
import { RequiredAuth } from '@/lib/okta/components/SecureRoute'
import Loading from '@/lib/okta/components/Loading'
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
import { OIDC_CONFIG } from '@/config'
import Layout from '@/components/Layout'
import Home from '@/components/Home'

const oktaAuth = new OktaAuth(OIDC_CONFIG)

const AppRoutes = () => {
  const navigate = useNavigate()
  const restoreOriginalUri = (_oktaAuth: OktaAuth, originalUri: string) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin))
  }
  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Routes>
        <Route
          path="login/callback"
          element={<LoginCallback loadingElement={<Loading />} />}
        />
        <Route
          path="/"
          element={!isTomigayaEnv() ? <Outlet /> : <RequiredAuth />}
        >
          <Route path="" element={<Layout />}>
            <Route index element={<Home />} />
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
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Security>
  )
}

export default AppRoutes
