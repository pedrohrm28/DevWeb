import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SuportePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!assunto.trim() || !mensagem.trim()) {
      toast({ title: "Erro", description: "Por favor, preencha todos os campos.", variant: "destructive" });
      return;
    }

    try {
      await api.post('/suporte/tickets', { assunto, mensagem });
      toast({ title: "Sucesso!", description: "Seu ticket de suporte foi enviado. Entraremos em contato em breve." });
      // Limpa o formulário após o envio
      setAssunto('');
      setMensagem('');
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar seu ticket. Tente novamente mais tarde.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Suporte</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Abrir um Novo Ticket de Suporte</CardTitle>
          <CardDescription>
            Tem algum problema ou dúvida? Descreva abaixo e nossa equipe entrará em contato através do seu email cadastrado ({user?.email}).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assunto">Assunto</Label>
              <Input 
                id="assunto" 
                value={assunto} 
                onChange={(e) => setAssunto(e.target.value)} 
                placeholder="Ex: Problema ao acessar material de aula" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea 
                id="mensagem" 
                value={mensagem} 
                onChange={(e) => setMensagem(e.target.value)} 
                placeholder="Descreva seu problema com o máximo de detalhes possível." 
                required 
                rows={8}
              />
            </div>
            <Button type="submit">Enviar Ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuportePage;