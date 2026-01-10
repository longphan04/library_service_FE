import { createBrowserRouter } from 'react-router-dom'
import UserLayout from '@/layouts/UserLayout'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        children: [],
    },
])
