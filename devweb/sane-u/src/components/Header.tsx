import { Menu, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user } = useAuth(); // Pegando o usuário do nosso "cofre" (Contexto)

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      {/* Botão do Menu (só aparece em telas médias e pequenas) */}
      <button onClick={onMenuClick} className="md:hidden">
        <Menu size={24} />
      </button>
      
      {/* Deixamos um espaço vazio no lugar do botão em telas grandes */}
      <div className="hidden md:block"></div>

      {/* Usamos o nome do usuário do contexto e criamos o link para o perfil */}
      <Link to="/perfil" className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
        <span>{user?.nome || 'Usuário'}</span>
        <UserCircle size={24} />
      </Link>
    </header>
  );
};

export default Header;