import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Tipos para os dados
interface Aluno {
  id: number;
  nome: string;
}
interface MateriaDetails {
  id: number;
  nome: string;
  descricao: string;
  professor: { nome: string } | null;
  alunos: Aluno[];
}

const MateriaDetailPage = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const { toast } = useToast();
  const [materia, setMateria] = useState<MateriaDetails | null>(null);
  const [allStudents, setAllStudents] = useState<Aluno[]>([]);
  const [studentToEnroll, setStudentToEnroll] = useState<string | undefined>();

  const fetchData = async () => {
    if (!id) return;
    try {
      const [materiaResponse, studentsResponse] = await Promise.all([
        api.get(`/materias/${id}`),
        api.get('/users/students')
      ]);
      setMateria(materiaResponse.data);
      setAllStudents(studentsResponse.data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os dados da matéria.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Roda sempre que o ID na URL mudar

  const handleEnroll = async () => {
    if (!studentToEnroll) {
      toast({ title: "Atenção", description: "Selecione um aluno para matricular." });
      return;
    }
    try {
      await api.post(`/materias/${id}/enroll`, { studentId: parseInt(studentToEnroll) });
      toast({ title: "Sucesso!", description: "Aluno matriculado com sucesso." });
      setStudentToEnroll(undefined);
      fetchData(); // Atualiza os dados da página
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível matricular o aluno.", variant: "destructive" });
    }
  };

  // Filtra a lista de alunos para mostrar apenas os que AINDA NÃO estão matriculados
  const availableStudents = allStudents.filter(
    student => !materia?.alunos.some(enrolled => enrolled.id === student.id)
  );

  if (!materia) return <div>Carregando matéria...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{materia.nome}</h1>
      <p className="text-muted-foreground">{materia.descricao}</p>
      <p><span className="font-semibold">Professor:</span> {materia.professor?.nome || 'Não definido'}</p>

      <Card>
        <CardHeader>
          <CardTitle>Matricular Aluno</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Select onValueChange={setStudentToEnroll} value={studentToEnroll}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecione um aluno..." />
            </SelectTrigger>
            <SelectContent>
              {availableStudents.length > 0 ? (
                availableStudents.map(student => (
                  <SelectItem key={student.id} value={String(student.id)}>{student.nome}</SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">Todos os alunos já estão matriculados.</div>
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleEnroll}>Matricular</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alunos Matriculados ({materia.alunos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Aluno</TableHead>
                <TableHead>Nome do Aluno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materia.alunos.map(aluno => (
                <TableRow key={aluno.id}>
                  <TableCell>{aluno.id}</TableCell>
                  <TableCell>{aluno.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriaDetailPage;