export interface Curso {
  id: number;
  titulo: string;
  descripcion: string | null;
  instructor: string;
  imagen: string | null;
  precio: number;
  created_at?: string;
  updated_at?: string;
}
