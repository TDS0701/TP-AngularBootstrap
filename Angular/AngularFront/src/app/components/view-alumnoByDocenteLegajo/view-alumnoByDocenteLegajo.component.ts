import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Alumno } from '../../models/alumno.model';

@Component({
    selector: 'app-view-alumno-by-docente-legajo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Estudiantes por legajo del Docente</h2>
        </div>
        <div class="card-body">
          <form (ngSubmit)="cargarAlumnosPorDocente()" class="mb-4">
            <div class="form-group">
              <label for="docentelegajo" class="form-label">legajo del Docente:</label>
              <input
                type="number"
                legajo="docentelegajo"
                class="form-control"
                [(ngModel)]="docentelegajo"
                name="docentelegajo"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary mt-3">Ver Alumnos</button>
          </form>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <table class="table table-striped" *ngIf="alumnos.length > 0">
            <thead>
              <tr>
                <th>legajo</th>
                <th>Nombre</th>
                <th>Fecha de Nacimiento</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let alumno of alumnos">
                <td>{{ alumno.id }}</td>
                <td>{{ alumno.nombre }}</td>
                <td>{{ alumno.fecha_nacimiento | date: "dd/MM/yyyy" }}</td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="alumnos.length === 0 && docentelegajo && !loading" class="alert alert-info">
            No se encontraron estudiantes para este docente.
          </div>

          <div *ngIf="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hlegajoden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .form-label {
      font-weight: 500;
    }
  `]
})
export class ViewalumnosByDocenteLegajoComponent {
  alumnos: Alumno[] = [];
  docentelegajo: string = "";
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  cargarAlumnosPorDocente() {
    if (!this.docentelegajo) {
      this.error = "Por favor ingrese un legajo de docente";
      return;
    }

    this.loading = true;
    this.error = null;
    
    this.apiService.getAlumnosPorLegajoDocente(Number(this.docentelegajo)).subscribe({
      next: (alumnos) => {
        this.alumnos = alumnos;
        this.loading = false;
      },
      error: (error) => {
        this.error = "Error cargando alumnos: " + error;
        this.loading = false;
        this.alumnos = [];
      }
    });
  }
}