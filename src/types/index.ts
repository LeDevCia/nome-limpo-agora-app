
export interface UserProfile {
  id: string;
  name: string;
  cpf: string;
  birth_date: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  person_type: string;
  status: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Debt {
  id: string;
  user_id: string;
  cpf: string;
  creditor: string;
  amount: number;
  status: string;
  created_at: string;
}
