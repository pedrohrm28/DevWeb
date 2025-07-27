import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const CadastroPage = () => {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!role) {
      alert("Por favor, selecione um tipo de usuário.");
      return;
    }
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      const userData = {
        nome,
        matricula: `${matricula}-${role.toUpperCase()}`,
        email,
        senha,
        role,
      };
      
      await axios.post('http://localhost:3000/auth/register', userData);

      alert('Usuário criado com sucesso!');
      navigate('/login');

    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Ocorreu um erro ao tentar cadastrar. Verifique o console do navegador para mais detalhes.");
    }
  };
  // --- FIM DA LÓGICA ---

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      {/* Adicionamos a tag <form> com o onSubmit */}
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Cadastro de Novo Usuário</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Adicionamos value e onChange em cada Input/Select */}
            <div className="grid gap-2">
              <Label htmlFor="nome-completo">Nome Completo</Label>
              <Input id="nome-completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="matricula">Matrícula (apenas números)</Label>
              <Input id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-type">Tipo de Usuário</Label>
              <Select onValueChange={(value) => setRole(value)} value={role}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ESTUDANTE">Estudante</SelectItem>
                  <SelectItem value="PROFESSOR">Professor</SelectItem>
                  <SelectItem value="COORDENADOR">Coordenador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input id="confirm-password" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            {/* Adicionamos type="submit" ao botão */}
            <Button type="submit" className="w-full">Criar Conta</Button>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <Link to="/login" className="underline">
                Faça o login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CadastroPage;