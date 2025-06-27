
-- Garantir que o usuário específico seja admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('5a905d9e-bff6-4bcb-96de-9a773a203975', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Habilitar RLS na tabela profiles se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Política para admins visualizarem todos os perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para usuários visualizarem apenas seu próprio perfil
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT
  USING (auth.uid() = id);

-- Política para admins atualizarem todos os perfis
CREATE POLICY "Admins can update all profiles" 
  ON public.profiles 
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para usuários atualizarem apenas seu próprio perfil
CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE
  USING (auth.uid() = id);
