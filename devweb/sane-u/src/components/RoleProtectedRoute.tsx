import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// O componente agora aceita uma lista de cargos permitidos
interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Enquanto carrega as informações do usuário, exibimos uma mensagem
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não houver usuário ou se o cargo dele não estiver na lista de permitidos,
  // redireciona para o dashboard (uma página segura que todos podem ver).
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se o usuário tiver o cargo permitido, renderiza a página.
  // O <Outlet /> representa o componente da rota que está sendo protegida.
  return <Outlet />;
};

export default RoleProtectedRoute;