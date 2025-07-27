import { useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from "@/components/use-toast";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 

const CriarNoticiaPage = () => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/noticias', { titulo, conteudo });
      toast({ title: "Sucesso!", description: "Notícia publicada com sucesso." });
      navigate('/dashboard'); // Volta para o dashboard após criar
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível publicar a notícia.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Criar Nova Notícia</h1>
      <Card>
        <CardHeader>
          <CardTitle>Nova Publicação</CardTitle>
          <CardDescription>Escreva o título e o conteúdo da notícia abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input 
                id="titulo" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                placeholder="Título da notícia" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Textarea 
                id="conteudo" 
                value={conteudo} 
                onChange={(e) => setConteudo(e.target.value)} 
                placeholder="Escreva o conteúdo da notícia aqui." 
                required 
                rows={10}
              />
            </div>
            <Button type="submit">Publicar Notícia</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriarNoticiaPage;