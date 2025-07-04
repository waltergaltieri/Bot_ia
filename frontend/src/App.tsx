import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Onboarding from './pages/auth/Onboarding'
import Dashboard from './pages/Dashboard'
import TeamsList from './pages/teams/TeamsList'
import TeamForm from './pages/teams/TeamForm'
import TeamDetails from './pages/teams/TeamDetails'
import UsersList from './pages/users/UsersList'
import UserForm from './pages/users/UserForm'
import UserDetails from './pages/users/UserDetails'
import PublicationsList from './pages/publications/PublicationsList'
import Analytics from './pages/analytics/Analytics'
import SocialAccounts from './pages/settings/SocialAccounts'
import CompanySettings from './pages/settings/CompanySettings'
import CompaniesList from './pages/companies/CompaniesList'
import CompanyForm from './pages/companies/CompanyForm'
import Sales from './pages/sales/Sales'
import Billing from './pages/billing/Billing'
import SubCompanies from './pages/sub-companies/SubCompanies'
import Activity from './pages/activity/Activity'
import SystemSettings from './pages/settings/SystemSettings'
import ByCompanyAnalytics from './pages/analytics/ByCompanyAnalytics'
import CompanyDetails from './pages/sub-companies/CompanyDetails'

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  console.log('ProtectedRoute - User:', user, 'Loading:', isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('Redirecting to login - no user found')
    return <Navigate to="/login" replace />
  }

  return <Layout>{children}</Layout>
}

// Componente para rutas públicas (solo accesibles sin autenticación)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()

  console.log('PublicRoute - User:', user, 'Loading:', isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (user) {
    console.log('Redirecting to dashboard - user found')
    return <Navigate to="/dashboard" replace />
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>
}

function App() {
  console.log('App component rendering')

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas públicas */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <PublicRoute>
              <Onboarding />
            </PublicRoute>
          } 
        />

        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Gestión de empresas - Solo Super Admin */}
        <Route 
          path="/companies" 
          element={
            <ProtectedRoute>
              <CompaniesList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companies/new" 
          element={
            <ProtectedRoute>
              <CompanyForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companies/:id" 
          element={
            <ProtectedRoute>
              <CompanyForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companies/:id/edit" 
          element={
            <ProtectedRoute>
              <CompanyForm />
            </ProtectedRoute>
          } 
        />

        {/* Super Admin - Ventas y Facturación */}
        <Route 
          path="/sales" 
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/billing" 
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/system" 
          element={
            <ProtectedRoute>
              <SystemSettings />
            </ProtectedRoute>
          } 
        />

        {/* Branch Manager - Sucursales y Actividad */}
        <Route 
          path="/sub-companies" 
          element={
            <ProtectedRoute>
              <SubCompanies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/activity" 
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sub-companies/:id" 
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics/by-company" 
          element={
            <ProtectedRoute>
              <ByCompanyAnalytics />
            </ProtectedRoute>
          } 
        />

        {/* Gestión de equipos */}
        <Route 
          path="/teams" 
          element={
            <ProtectedRoute>
              <TeamsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teams/new" 
          element={
            <ProtectedRoute>
              <TeamForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teams/:id" 
          element={
            <ProtectedRoute>
              <TeamDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teams/:id/edit" 
          element={
            <ProtectedRoute>
              <TeamForm />
            </ProtectedRoute>
          } 
        />

        {/* Gestión de usuarios */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/new" 
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:id" 
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/users/:id/edit" 
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          } 
        />

        {/* Publicaciones */}
        <Route 
          path="/publications" 
          element={
            <ProtectedRoute>
              <PublicationsList />
            </ProtectedRoute>
          } 
        />

        {/* Analytics */}
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />

        {/* Configuración */}
        <Route 
          path="/settings/social-accounts" 
          element={
            <ProtectedRoute>
              <SocialAccounts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings/company" 
          element={
            <ProtectedRoute>
              <CompanySettings />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de prueba */}
        <Route 
          path="/test" 
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  🎉 ¡Aplicación Funcionando!
                </h1>
                <p className="text-gray-600 mb-6">
                  La aplicación React se está ejecutando correctamente.
                </p>
                <div className="space-y-4">
                  <div className="bg-green-100 text-green-800 p-3 rounded-lg">
                    ✅ React cargado
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
                    ✅ Tailwind CSS funcionando
                  </div>
                  <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
                    ✅ Componente renderizado
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Variables de entorno:{' '}
                  <br />
                  VITE_USE_MOCK_DATA: {import.meta.env.VITE_USE_MOCK_DATA || 'undefined'}
                  <br />
                  VITE_API_URL: {import.meta.env.VITE_API_URL || 'undefined'}
                </p>
              </div>
            </div>
          } 
        />

        {/* Ruta 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
                <Navigate to="/dashboard" replace />
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  )
}

export default App 