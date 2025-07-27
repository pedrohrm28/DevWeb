import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface ForumPostFormProps {
  materiaId: number;
  onPostCreated: () => void; // Função para avisar o pai que um post foi criado
}

const ForumPostForm = ({ materiaId, onPostCreated }: ForumPostFormProps) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post(`/forum/materia/${materiaId}`, { titulo, conteudo });
      toast({ title: "Sucesso!", description: "Seu tópico foi publicado." });
      onPostCreated(); // Avisa o componente pai para atualizar a lista
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível publicar o tópico.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Tópico</Label>
        <Input 
          id="titulo" 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          placeholder="Qual é a sua dúvida principal?" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="conteudo">Descreva sua Dúvida</Label>
        <Textarea 
          id="conteudo" 
          value={conteudo} 
          onChange={(e) => setConteudo(e.target.value)} 
          placeholder="Dê mais detalhes sobre o que você não entendeu." 
          required 
          rows={5}
        />
      </div>
      <Button type="submit">Publicar Tópico</Button>
    </form>
  );
};

export default ForumPostForm;