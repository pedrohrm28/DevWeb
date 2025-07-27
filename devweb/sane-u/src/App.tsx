import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Importando nossos guardiões de rotas
import ProtectedRoute from './components/ProtectedRoute'; 
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Importando Layouts e Páginas
import RootLayout from './layout/RootLayout';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/Dashboard';
import AgendaPage from './pages/Agenda';
import ConfiguracoesPage from './pages/Configuracoes';
import DocumentosPage from './pages/Documentos';
import FaqPage from './pages/FAQ';
import MentoriaPage from './pages/Mentoria';
import PerfilPage from './pages/Perfil';
import SuportePage from './pages/SuportePage';
import TrilhaIntegracaoPage from './pages/TrilhaIntegracao';
import NotFoundPage from './pages/NotFound';
import MateriasPage from './pages/MateriasPage';
import MinhasMateriasPage from './pages/MinhasMateriasPage';
import CriarNoticiaPage from './pages/CriarNoticiaPage';
import MateriaDetailPage from './pages/MateriaDetailPage';
import MinhasMatriculasPage from './pages/MinhasMatriculasPage';
import MateriaEstudantePage from './pages/MateriaEstudantePage';
import MateriaProfessorPage from './pages/MateriaProfessorPage';
import ForumPostPage from './pages/ForumPostPage';

const router = createBrowserRouter([
  // Grupo de rotas protegidas por login
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFoundPage />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> }, 
          { path: "dashboard", element: <DashboardPage /> },
          { path: "agenda", element: <AgendaPage /> },
          { path: "documentos", element: <DocumentosPage /> },
          { path: "mentoria", element: <MentoriaPage /> },
          { path: "perfil", element: <PerfilPage /> },
          { path: "suporte", element: <SuportePage /> },
          { path: "trilha-integracao", element: <TrilhaIntegracaoPage /> },
          { path: "faq", element: <FaqPage /> },
          { path: "forum/post/:postId", element: <ForumPostPage /> }, // <-- ROTA ADICIONADA
          
          // Grupo de rotas protegidas para Coordenadores e Diretores
          {
            element: <RoleProtectedRoute allowedRoles={['COORDENADOR', 'DIRETOR']} />,
            children: [
                { path: "materias", element: <MateriasPage /> },
                { path: "materias/:id", element: <MateriaDetailPage /> },
                { path: "configuracoes", element: <ConfiguracoesPage /> },
                { path: "noticias/criar", element: <CriarNoticiaPage /> },
            ]
          },

          // Grupo de rotas protegidas para Professores
          {
            element: <RoleProtectedRoute allowedRoles={['PROFESSOR']} />,
            children: [
                { path: "minhas-materias", element: <MinhasMateriasPage /> },
                { path: "minhas-materias/:id", element: <MateriaProfessorPage /> }
            ]
          },
          
          // Grupo de rotas protegidas para Estudantes
          {
            element: <RoleProtectedRoute allowedRoles={['ESTUDANTE']} />,
            children: [
                { path: "minhas-matriculas", element: <MinhasMatriculasPage /> },
                { path: "minhas-matriculas/:id", element: <MateriaEstudantePage /> }
            ]
          }
        ]
      },
    ]
  },
  // Grupo de rotas públicas
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cadastro",
    element: <CadastroPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;