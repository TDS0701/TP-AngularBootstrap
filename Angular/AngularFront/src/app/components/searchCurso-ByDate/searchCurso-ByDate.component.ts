import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Curso } from '../../models/curso.model';

@Component({
  selector: 'app-search-cursos-by-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Buscar Cursos por Fecha de Fin</h2>
    <form (ngSubmit)="onSubmit()">
      <div class="form-group">
        <label for="endDate">Fecha de fin:</label>
        <input [(ngModel)]="endDate" name="endDate" type="date" id="endDate" required>
      </div>
      <button type="submit">Buscar</button>
    </form>
    <div *ngIf="error" class="error-message">
      {{ error }}
    </div>
    <table *ngIf="cursos.length > 0">
      <thead>
        <tr>
          <th>Tema</th>
          <th>Fecha de inicio</th>
          <th>Fecha de fin</th>
          <th>Docente</th>
          <th>Precio</th>
          <th>Cantidad de Alumnos</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let curso of cursos">
          <td>{{ curso.tema.nombre }}</td>
          <td>{{ curso.fechaInicio | date }}</td>
          <td>{{ curso.fechaFin | date }}</td>
          <td>{{ curso.docente.nombre }}</td>
          <td>{{ curso.precio | currency }}</td>
          <td>{{ curso.alumnos.length }}</td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="cursos.length === 0 && !error">No se encontraron cursos para la fecha especificada.</p>
  `,
  styles: [`
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; }
    .form-group input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    button { padding: 0.5rem 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #0056b3; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { padding: 0.5rem; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f2f2f2; }
    .error-message { color: red; padding: 1rem; margin: 1rem 0; background-color: #ffebee; border: 1px solid #ffcdd2; border-radius: 4px; }
  `]
})
export class SearchCursosByDateComponent {
  endDate: string = '';
  cursos: Curso[] = [];
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.error = null;
    this.cursos = [];
    this.apiService.searchCursosByDate(this.endDate).subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        if (cursos.length === 0) {
          this.error = 'No se encontraron cursos para la fecha especificada.';
        }
      },
      error: (error) => {
        console.error('Error al buscar cursos', error);
        this.error = 'Ocurrió un error al buscar los cursos. Por favor, intente nuevamente.';
      }
    });
  }
}