import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Definimos os tipos para os dados que esperamos da API
interface Autor {
  nome: string;
}

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  autor: Autor;
  createdAt: string;
}

const NoticiasRecentes = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Chamamos nosso endpoint GET /noticias
        const response = await api.get('/noticias');
        setNoticias(response.data);
      } catch (error) {
        toast({ title: "Erro", description: "Não foi possível carregar as notícias.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, [toast]);

  if (loading) {
    return <div>Carregando notícias...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notícias e Avisos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {noticias.length > 0 ? (
          noticias.map((noticia) => (
            <div key={noticia.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src="" alt={noticia.autor.nome} />
                <AvatarFallback>{noticia.autor.nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{noticia.titulo}</p>
                <p className="text-sm text-muted-foreground">{noticia.conteudo}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Postado por {noticia.autor.nome}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma notícia recente encontrada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NoticiasRecentes;