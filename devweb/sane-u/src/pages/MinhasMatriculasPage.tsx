import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Importando o Link para a navegação
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/use-toast";

interface Professor {
  nome: string;
}

interface Materia {
  id: number;
  nome: string;
  descricao: string;
  professor: Professor | null;
}

const MinhasMatriculasPage = () => {
  const [matriculas, setMatriculas] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMatriculas = async () => {
      try {
        const response = await api.get('/users/me/materias');
        setMatriculas(response.data);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar suas matrículas.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchMatriculas();
  }, [toast]);

  if (loading) {
    return <div>Carregando suas matrículas...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Matrículas</h1>
      {matriculas.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matriculas.map(materia => (
            // Cada Card agora é um link para a página de detalhes
            <Link key={materia.id} to={`/minhas-matriculas/${materia.id}`}>
              <Card className="hover:shadow-lg hover:border-violet-500 transition-all h-full">
                <CardHeader>
                  <CardTitle>{materia.nome}</CardTitle>
                  <CardDescription>{materia.descricao}</CardDescription>
                  <p className="text-sm text-muted-foreground pt-2">
                    Professor: {materia.professor?.nome || 'A definir'}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>Você ainda não foi matriculado em nenhuma matéria.</p>
      )}
    </div>
  );
};

export default MinhasMatriculasPage;