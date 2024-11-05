import { Tema } from './tema.model';
import { Docente } from './docente.model';
import { Alumno } from './alumno.model';

export interface Curso {
  id?: number;
  tema: Tema;
  fechaInicio: string;
  fechaFin: string;
  docente: Docente;
  precio: number;
  alumnos: Alumno[];
}