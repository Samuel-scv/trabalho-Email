export interface cliente {
  nome: string;
  email: string;
  senha: string;
  saldo: number;
  tipo: "CLIENTE" | "ADMIN";
}