import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-[--color-bg-app]">
      <Outlet />
    </div>
  )
}
