import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Verificamos se o token existe no armazenamento local do navegador
  const token = localStorage.getItem('authToken');

  // Se o token não existir, redirecionamos o usuário para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se o token existir, permitimos que a página solicitada seja renderizada
  // O <Outlet /> representa o componente da rota aninhada (no nosso caso, o RootLayout)
  return <Outlet />;
};

export default ProtectedRoute;