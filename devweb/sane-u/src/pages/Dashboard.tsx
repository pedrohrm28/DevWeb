import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import NoticiasRecentes from "@/components/NoticiasRecentes";
import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";

// Tipo para os dados que esperamos da nossa API
interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalProfessors: number;
  totalMaterias: number;
}

const DashboardPage = () => {
  const { user } = useAuth(); // Pega o usuário logado para verificar o cargo
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Carregando estatísticas...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Botão para criar notícia, visível apenas para os cargos certos */}
        {user && (user.role === 'COORDENADOR' || user.role === 'DIRETOR') && (
          <Link to="/noticias/criar">
            <Button>Criar Nova Notícia</Button>
          </Link>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={stats?.totalUsers.toString() || '0'}
          description="Todos os perfis cadastrados"
          Icon={Users}
        />
        <StatCard
          title="Total de Alunos"
          value={stats?.totalStudents.toString() || '0'}
          description="Usuários com perfil de estudante"
          Icon={GraduationCap}
        />
         <StatCard
          title="Total de Professores"
          value={stats?.totalProfessors.toString() || '0'}
          description="Usuários com perfil de professor"
          Icon={UserCheck}
        />
        <StatCard
          title="Total de Matérias"
          value={stats?.totalMaterias.toString() || '0'}
          description="Matérias disponíveis no sistema"
          Icon={BookOpen}
        />
      </div>

      <NoticiasRecentes />

    </div>
  );
};

export default DashboardPage;