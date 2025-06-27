
-- Inserir o usuário específico como admin fixo
INSERT INTO public.user_roles (user_id, role)
VALUES ('5a905d9e-bff6-4bcb-96de-9a773a203975', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Remover políticas existentes se existirem e recriar
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

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
