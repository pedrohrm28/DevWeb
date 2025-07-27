import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PerfilPage = () => {
  const { user } = useAuth(); // Pega o usuário logado do nosso contexto
  const { toast } = useToast();

  // Estados para o formulário de senha
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (newPass.length < 8) {
        toast({ title: "Erro", description: "A nova senha deve ter no mínimo 8 caracteres.", variant: "destructive" });
        return;
    }

    if (newPass !== confirmPass) {
      toast({ title: "Erro", description: "As novas senhas não coincidem.", variant: "destructive" });
      return;
    }

    try {
      await api.patch('/profile/change-password', { oldPass, newPass });
      toast({ title: "Sucesso!", description: "Sua senha foi alterada." });
      // Limpa os campos após o sucesso
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível alterar a senha. Verifique sua senha antiga.", variant: "destructive" });
    }
  };

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{user.nome}</CardTitle>
          <CardDescription>Aqui estão suas informações de cadastro.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-semibold">Email:</span> {user.email}</p>
          <p><span className="font-semibold">Matrícula:</span> {user.matricula}</p>
          <p><span className="font-semibold">Cargo:</span> {user.role}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Para sua segurança, digite sua senha antiga e a nova.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPass">Senha Antiga</Label>
              <Input id="oldPass" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPass">Nova Senha</Label>
              <Input id="newPass" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPass">Confirmar Nova Senha</Label>
              <Input id="confirmPass" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
            </div>
            <Button type="submit">Alterar Senha</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilPage;