import { createBrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import MachineDetail from '../pages/MachineDetail.jsx'
import NotFound from '../pages/NotFound.jsx'

export default createBrowserRouter([
  { path: '/', element: <Dashboard /> },
  { path: '/machine/:id', element: <MachineDetail /> },
  { path: '*', element: <NotFound /> }
])
