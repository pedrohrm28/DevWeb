import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Paperclip, Trash2, MessageSquare } from "lucide-react";

interface MaterialDeAula {
  id: number;
  nome: string;
  path: string;
}

interface Autor {
  nome: string;
}

interface ForumPost {
  id: number;
  titulo: string;
  autor: Autor;
  _count: { comentarios: number };
}

const MateriaProfessorPage = () => {
  const { id: materiaId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [materiais, setMateriais] = useState<MaterialDeAula[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!materiaId) return;
    try {
      setLoading(true);
      const [materiaisResponse, forumResponse] = await Promise.all([
        api.get(`/materias/${materiaId}/materiais`),
        api.get(`/forum/materia/${materiaId}`),
      ]);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({ title: "Atenção", description: "Por favor, selecione um arquivo PDF.", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await api.post(`/uploads/materia/${materiaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast({ title: "Sucesso!", description: "Material enviado com sucesso." });
      setSelectedFile(null);
      if (document.getElementById('file-input')) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }
      fetchData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar o material.", variant: "destructive" });
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gerenciar Material da Matéria</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Enviar Novo Material (PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUploadSubmit} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Label 
                htmlFor="file-input"
                className="flex-shrink-0 cursor-pointer rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium"
              >
                Escolher Arquivo
              </Label>
              <Input 
                id="file-input" 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf" 
                className="sr-only"
              />
              <span className="text-sm text-muted-foreground truncate">
                {selectedFile ? selectedFile.name : 'Nenhum arquivo selecionado'}
              </span>
            </div>
            
            <Button type="submit" disabled={!selectedFile}>
              <Paperclip className="mr-2 h-4 w-4" /> Enviar Material
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Materiais Enviados</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Arquivo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materiais.length > 0 ? materiais.map(material => (
                <TableRow key={material.id}>
                  <TableCell>{material.nome}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">Nenhum material encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fórum de Dúvidas</CardTitle>
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
            <p className="text-muted-foreground text-center py-4">Nenhum tópico no fórum desta matéria.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriaProfessorPage;