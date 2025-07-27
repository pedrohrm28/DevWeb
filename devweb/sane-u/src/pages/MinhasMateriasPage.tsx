import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/use-toast";

interface Materia {
  id: number;
  nome: string;
  descricao: string;
}

const MinhasMateriasPage = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await api.get('/materias/minhas-materias');
        setMaterias(response.data);
      } catch (error) {
        toast({ title: "Erro", description: "Você não tem permissão ou ocorreu um erro.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, [toast]);

  if (loading) {
    return <div>Carregando suas matérias...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Minhas Matérias</h1>
      {materias.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materias.map(materia => (
            <Link key={materia.id} to={`/minhas-materias/${materia.id}`}>
              <Card className="hover:shadow-lg hover:border-violet-500 transition-all h-full">
                <CardHeader>
                  <CardTitle>{materia.nome}</CardTitle>
                  <CardDescription>{materia.descricao}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p>Nenhuma matéria foi atribuída a você ainda.</p>
      )}
    </div>
  );
};

export default MinhasMateriasPage;