import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.services';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-add-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Agregar Alumno</h2>
        </div>
        <div class="card-body">
          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          
          <form (ngSubmit)="onSubmit()" #alumnoForm="ngForm">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre:</label>
              <input type="text"
                     class="form-control"
                     id="nombre"
                     name="nombre"
                     [(ngModel)]="alumno.nombre"
                     required>
            </div>
            
            <div class="mb-3">
              <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento:</label>
              <input type="date"
                     class="form-control"
                     id="fechaNacimiento"
                     name="fechaNacimiento"
                     [(ngModel)]="alumno.fecha_nacimiento"
                     required>
            </div>
            
            <div class="d-flex gap-2">
              <button type="submit" 
                      class="btn btn-primary" 
                      [disabled]="!alumnoForm.form.valid || loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
              </button>
              <button type="button" 
                      class="btn btn-secondary" 
                      (click)="cancel()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-top: 20px;
    }
    .form-label {
      font-weight: 500;
    }
  `]
})
export class AddalumnoComponent {
  alumno: Alumno = {
    nombre: '',
    fecha_nacimiento: ''
  };
  loading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = null;

    this.apiService.addAlumno(this.alumno).subscribe({
      next: () => {
        this.router.navigate(['/alumnos']);
      },
      error: (err) => {
        this.error = 'Error al guardar el alumno: ' + err;
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/alumnos']);
  }
}