
-- Criar tabela para mensagens de contato
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'respondido', 'em_andamento')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT
);

-- Habilitar RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para admins verem todas as mensagens
CREATE POLICY "Admins can view all contact messages" 
  ON public.contact_messages 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Política para permitir inserção pública de mensagens
CREATE POLICY "Anyone can create contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);
