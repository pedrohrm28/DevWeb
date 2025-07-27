import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        matricula,
        senha,
      });

      const { access_token } = response.data;

      // Chama a função de login do contexto para atualizar o estado global
      await login(access_token);
      
      alert('Login bem-sucedido!');

      // A própria página de login redireciona após o sucesso
      navigate('/dashboard'); 

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Matrícula ou senha inválidas.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Digite seu número de matrícula e senha para acessar.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input 
                id="matricula" 
                value={matricula} 
                onChange={(e) => setMatricula(e.target.value)} 
                placeholder="Ex: 202412345-EST" 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">Entrar</Button>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="underline">
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default LoginPage;