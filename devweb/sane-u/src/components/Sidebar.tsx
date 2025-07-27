import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Links visíveis para a maioria dos usuários
const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/suporte', label: 'Suporte' },
];

// Links visíveis apenas para Coordenadores e Diretores
const adminLinks = [
    { href: '/materias', label: 'Matérias', roles: ['COORDENADOR', 'DIRETOR'] },
    { href: '/configuracoes', label: 'Configurações', roles: ['COORDENADOR', 'DIRETOR'] },
];

// Links visíveis apenas para Professores
const professorLinks = [
  { href: '/minhas-materias', label: 'Minhas Matérias', roles: ['PROFESSOR'] },
];

// Links visíveis apenas para Estudantes
const estudanteLinks = [
  { href: '/minhas-matriculas', label: 'Minhas Matrículas', roles: ['ESTUDANTE'] },
];

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLinks = (links: {href: string, label: string}[]) => {
    return links.map((link) => {
        const isActive = location.pathname === link.href;
        return (
            <li key={link.href} className="mb-2">
            <Link 
                to={link.href} 
                className={`block p-2 rounded-md transition-colors duration-200 ${isActive ? 'bg-violet-500' : 'hover:bg-gray-700'}`}
            >
                {link.label}
            </Link>
            </li>
        );
    });
  };
  
  const renderRoleLinks = (links: {href: string, label: string, roles: string[]}[]) => {
     return links.map((link) => (
      user && link.roles.includes(user.role) && (
        <li key={link.href} className="mb-2">
          <Link
            to={link.href}
            className={`block p-2 rounded-md transition-colors duration-200 ${location.pathname === link.href ? 'bg-violet-500' : 'hover:bg-gray-700'}`}
          >
            {link.label}
          </Link>
        </li>
      )
    ))
  };

  return (
    <aside 
      className={`
        w-64 bg-gray-900 text-white p-4 flex flex-col
        fixed inset-y-0 left-0 z-50 
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div>
        <h2 className="text-xl font-bold mb-6 text-center">DEVWEB</h2>
        <nav>
          <ul>
            {renderLinks(navLinks)}
            {renderRoleLinks(adminLinks)}
            {renderRoleLinks(professorLinks)}
            {renderRoleLinks(estudanteLinks)}
          </ul>
        </nav>
      </div>
      
      <div className="mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-md transition-colors duration-200 hover:bg-red-500"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;