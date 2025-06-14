import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import './index.css'
import './styles/global.scss'
import { CalendarPage } from './pages/CalendarPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <CalendarPage />
    </Provider>
  </StrictMode>,
)
