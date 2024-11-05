import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Curso } from '../models/curso.model';
import { Alumno } from '../models/alumno.model';
import { Docente } from '../models/docente.model';
import { Tema } from '../models/tema.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => error.message || 'Error del servidor');
  }

  // Cursos
  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`)
      .pipe(catchError(this.handleError));
  }

  getCursosByDocente(docenteId: number): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos`)
      .pipe(catchError(this.handleError));
  }

  addCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(`${this.apiUrl}/cursos`, curso)
      .pipe(catchError(this.handleError));
  }

  updateCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/cursos/${id}`, curso)
      .pipe(catchError(this.handleError));
  }

  deleteCurso(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cursos/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Alumnos
  getAlumnos(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/alumnos`)
      .pipe(catchError(this.handleError));
  }

  addAlumno(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(`${this.apiUrl}/alumnos`, alumno)
      .pipe(catchError(this.handleError));
  }

  updateAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/alumnos/${id}`, alumno)
      .pipe(catchError(this.handleError));
  }

  deleteAlumno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alumnos/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Docentes
  getDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/docentes`)
      .pipe(catchError(this.handleError));
  }

  addDocente(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(`${this.apiUrl}/docentes`, docente)
      .pipe(catchError(this.handleError));
  }

  updateDocente(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(`${this.apiUrl}/docentes/${id}`, docente)
      .pipe(catchError(this.handleError));
  }

  deleteDocente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/docentes/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Temas
  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(`${this.apiUrl}/temas`)
      .pipe(catchError(this.handleError));
  }

  addTema(tema: Tema): Observable<Tema> {
    return this.http.post<Tema>(`${this.apiUrl}/temas`, tema)
      .pipe(catchError(this.handleError));
  }

  updateTema(id: number, tema: Tema): Observable<Tema> {
    return this.http.put<Tema>(`${this.apiUrl}/temas/${id}`, tema)
      .pipe(catchError(this.handleError));
  }

  deleteTema(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/temas/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Search cursos by date
  searchCursosByDate(endDate: string): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.apiUrl}/cursos/fecha-fin?fecha=${endDate}`)
      .pipe(catchError(this.handleError));
  }

  getAlumnosByCurso(cursoId: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/cursos/${cursoId}/alumnos`)
      .pipe(catchError(this.handleError));}

  getAlumnosPorLegajoDocente(legajo: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(`${this.apiUrl}/cursos/docente/legajo/${legajo}/alumnos`)
        .pipe(catchError(this.handleError));}

}