
-- Corrigir a função handle_new_user para usar a coluna 'document' em vez de 'cpf'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Inserir profile do usuário
  INSERT INTO public.profiles (
    id, 
    name, 
    document, 
    birth_date, 
    email, 
    phone, 
    address, 
    city, 
    state, 
    zip_code,
    person_type
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'document',
    (new.raw_user_meta_data ->> 'birthDate')::date,
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'zipCode',
    COALESCE(new.raw_user_meta_data ->> 'personType', 'fisica')
  );
  
  -- Inserir role padrão de usuário
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$function$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
