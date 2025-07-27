import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ForumPostForm from "@/components/ForumPostForm";
import { FileText, MessageSquare } from "lucide-react";

// --- Tipos para os dados ---
interface MateriaDetails {
  id: number;
  nome: string;
  descricao: string;
  professor: { nome: string } | null;
}
interface MaterialDeAula {
  id: number;
  nome: string;
  path: string;
}
interface Autor { nome: string; }
interface ForumPost {
  id: number;
  titulo: string;
  conteudo: string;
  autor: Autor;
  createdAt: string;
  _count: { comentarios: number };
}
// --------------------------

const MateriaEstudantePage = () => {
  const { id: materiaId } = useParams<{ id: string }>();
  const [materia, setMateria] = useState<MateriaDetails | null>(null);
  const [materiais, setMateriais] = useState<MaterialDeAula[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!materiaId) return;
    try {
      setLoading(true);
      const [materiaResponse, materiaisResponse, forumResponse] = await Promise.all([
        api.get(`/materias/${materiaId}`),
        api.get(`/materias/${materiaId}/materiais`),
        api.get(`/forum/materia/${materiaId}`)
      ]);
      setMateria(materiaResponse.data);
      setMateriais(materiaisResponse.data);
      setPosts(forumResponse.data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar os dados da matéria.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [materiaId]);

  if (loading) {
    return <div>Carregando detalhes da matéria...</div>;
  }
  if (!materia) {
    return <div>Matéria não encontrada.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{materia.nome}</h1>
        <p className="text-lg text-muted-foreground">{materia.descricao}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Professor: {materia.professor?.nome || 'A definir'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materiais de Aula</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiais.length > 0 ? (
                materiais.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <a 
                        href={`http://localhost:3000/uploads/${material.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        {material.nome}
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>Nenhum material de aula disponível no momento.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Fórum de Dúvidas</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>Criar Novo Tópico</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Dúvida</DialogTitle>
                  <DialogDescription>
                    Descreva sua dúvida para o professor e outros alunos.
                  </DialogDescription>
                </DialogHeader>
                <ForumPostForm 
                  materiaId={parseInt(materiaId!)} 
                  onPostCreated={() => {
                    setIsFormOpen(false);
                    fetchData();
                  }} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} to={`/forum/post/${post.id}`}>
                <div className="flex items-start justify-between gap-3 p-3 rounded-lg border hover:bg-muted/50 w-full">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">{post.titulo}</p>
                      <p className="text-sm text-muted-foreground">Postado por: {post.autor.nome}</p>
                    </div>
                  </div>
                   <div className="text-sm text-muted-foreground text-right">
                    {post._count.comentarios} respostas
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhuma dúvida postada ainda. Seja o primeiro!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriaEstudantePage;