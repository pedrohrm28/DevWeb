import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Autor { nome: string; role: string; }
interface Comment { id: number; conteudo: string; autor: Autor; createdAt: string; }
interface PostDetails {
  id: number;
  titulo: string;
  conteudo: string;
  autor: Autor;
  createdAt: string;
  comentarios: Comment[];
}

const ForumPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { toast } = useToast();

  const [post, setPost] = useState<PostDetails | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!postId) return;
    try {
      const response = await api.get(`/forum/post/${postId}`);
      setPost(response.data);
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível carregar o post.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/forum/post/${postId}/comment`, { conteudo: newComment });
      toast({ title: "Sucesso!", description: "Seu comentário foi publicado." });
      setNewComment("");
      fetchData();
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível publicar seu comentário.", variant: "destructive" });
    }
  };

  if (loading) return <div>Carregando discussão...</div>;
  if (!post) return <div>Post não encontrado.</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.titulo}</CardTitle>
          <CardDescription>Postado por: {post.autor.nome}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{post.conteudo}</p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Respostas ({post.comentarios.length})</h2>
      <div className="space-y-4">
        {post.comentarios.map(comment => (
          <div key={comment.id} className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{comment.autor.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 p-4 border rounded-lg">
              <p className="font-semibold text-sm">{comment.autor.nome} <span className="text-xs text-muted-foreground">({comment.autor.role})</span></p>
              <p className="text-sm mt-1">{comment.conteudo}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escreva uma Resposta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <Textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              rows={4}
              required
            />
            <Button type="submit">Enviar Resposta</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForumPostPage;