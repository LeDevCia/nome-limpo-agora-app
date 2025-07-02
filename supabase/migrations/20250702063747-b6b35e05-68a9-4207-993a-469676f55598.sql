
-- Corrigir a função handle_new_user para usar os nomes corretos dos campos
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
    (new.raw_user_meta_data ->> 'birth_date')::date,
    new.email,
    new.raw_user_meta_data ->> 'phone',
    COALESCE(new.raw_user_meta_data ->> 'address', ''),
    COALESCE(new.raw_user_meta_data ->> 'city', ''),
    COALESCE(new.raw_user_meta_data ->> 'state', ''),
    COALESCE(new.raw_user_meta_data ->> 'zip_code', ''),
    COALESCE(new.raw_user_meta_data ->> 'person_type', 'fisica')
  );
  
  -- Inserir role padrão de usuário
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$function$;
