import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Home from './pages/home/Home'

import Wardrobe from './pages/wardrobe/Wardrobe'
import AddClothing from './pages/wardrobe/AddClothing'
import ClothingDetails from './pages/wardrobe/ClothingDetails'
import EditClothing from './pages/wardrobe/EditClothing'
import SavedOutfit from './pages/outfit/SavedOutfit'

import OutfitStudio from './pages/outfit/OutfitStudio'
import Spaces from './pages/spaces/Spaces'
import SpaceDetails from './pages/spaces/SpaceDetails'

import ProtectedRoute from './routes/ProtectedRoute'
import OfflineBanner from './components/ui/OfflineBanner'
import SyncStatus from './components/ui/SyncStatus'

import { useAuth } from './features/authentication/useAuth'
import { useSyncEngine } from './hooks/useSyncEngine'

import { useCloudSync } from './hooks/useCloudSync'

function CloudSyncManager() {
  const { user } = useAuth()

  useCloudSync(user?.id)

  return null
}

function App() {
  const { user } = useAuth()

  useSyncEngine(user?.id)

  return (
  <>
    <OfflineBanner />

    {user && (
      <div className="fixed bottom-4 right-4 z-50 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-md">
        <SyncStatus userId={user.id} />
      </div>
    )}

    <CloudSyncManager />

      <Routes>
        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/wardrobe"
            element={<Wardrobe />}
          />

          <Route
            path="/wardrobe/add"
            element={<AddClothing />}
          />

          <Route
  path="/wardrobe/:clothingId"
  element={<ClothingDetails />}
/>

<Route
  path="/wardrobe/:clothingId/edit"
  element={<EditClothing />}
/>

<Route
  path="/outfit/:outfitId/view"
  element={<SavedOutfit />}
/>
          {/* Create a new outfit */}
          <Route
            path="/outfit"
            element={<OutfitStudio />}
          />

          {/* Edit an existing outfit */}
          <Route
            path="/outfit/:outfitId"
            element={<OutfitStudio />}
          />

          <Route
            path="/spaces"
            element={<Spaces />}
          />

          <Route
            path="/spaces/:spaceId"
            element={<SpaceDetails />}
          />

        </Route>

        {/* =========================
            FALLBACK
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </>
  )
}

export default App