import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Tipos para nossos dados
interface Professor {
  id: number;
  nome: string;
}

interface Materia {
  id: number;
  nome: string;
  descricao: string;
  professor: Professor | null;
}

const MateriasPage = () => {
  const { toast } = useToast();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  
  // Estados para o formulário
  const [nomeMateria, setNomeMateria] = useState('');
  const [descricaoMateria, setDescricaoMateria] = useState('');
  const [professorId, setProfessorId] = useState<string | undefined>(undefined);

  // Função para buscar os dados do backend
  const fetchData = async () => {
    try {
      const [materiasResponse, professoresResponse] = await Promise.all([
        api.get('/materias'),
        api.get('/users/professors')
      ]);
      setMaterias(materiasResponse.data);
      setProfessores(professoresResponse.data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os dados.", variant: "destructive" });
    }
  };

  // Roda a busca de dados quando a página carrega
  useEffect(() => {
    fetchData();
  }, []);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/materias', { 
        nome: nomeMateria, 
        descricao: descricaoMateria,
        professorId: professorId ? parseInt(professorId) : null,
      });
      toast({ title: "Sucesso!", description: "Matéria criada com sucesso." });
      // Limpa o formulário e atualiza a lista
      setNomeMateria('');
      setDescricaoMateria('');
      setProfessorId(undefined);
      fetchData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível criar a matéria.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Matérias</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Matéria</Label>
              <Input id="nome" value={nomeMateria} onChange={(e) => setNomeMateria(e.target.value)} placeholder="Ex: Engenharia de Software" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" value={descricaoMateria} onChange={(e) => setDescricaoMateria(e.target.value)} placeholder="Uma breve descrição da matéria" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professor">Professor Responsável</Label>
              <Select onValueChange={setProfessorId} value={professorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {professores.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Criar Matéria</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Matérias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Professor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materias.map(materia => (
                <TableRow key={materia.id}>
                  <TableCell className="font-medium">
                    <Link to={`/materias/${materia.id}`} className="hover:underline">
                      {materia.nome}
                    </Link>
                  </TableCell>
                  <TableCell>{materia.descricao}</TableCell>
                  <TableCell>{materia.professor?.nome || 'Não atribuído'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriasPage;