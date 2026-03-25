

import { Toaster } from 'sonner'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import LoginPage from '../pages/LoginPage';
import SharePage from '../pages/SharePage';



const AppRouter = () => {
  const NotFoundPage = () => {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    );
  };


  return (

    <BrowserRouter>
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 1000

        }}
      />

      <Routes>
        <Route path="/s" element={<NotFoundPage />} />
        <Route path="/s/:id" element={<SharePage />} />

        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:email" element={<MainPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>

  )

}

export default AppRouter
