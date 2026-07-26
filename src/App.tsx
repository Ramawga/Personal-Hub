import { AppShell } from './layouts/AppShell'
import { appRoutes, useAppRoute } from './routes'

function App() {
  const { activeRoute, navigateTo } = useAppRoute(appRoutes)

  return <AppShell activeRoute={activeRoute} routes={appRoutes} onNavigate={navigateTo} />
}

export default App
