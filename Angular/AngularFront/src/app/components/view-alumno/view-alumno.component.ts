import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-view-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Lista de Alumnos</h2>
        </div>
        <div class="card-body">
          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha de Nacimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let alumno of alumnos">
                <td>
                  <ng-container *ngIf="!isEditing(alumno)">
                    {{ alumno.nombre }}
                  </ng-container>
                  <input *ngIf="isEditing(alumno)"
                         type="text"
                         class="form-control"
                         [(ngModel)]="editingAlumno!.nombre">
                </td>
                <td>
                  <ng-container *ngIf="!isEditing(alumno)">
                    {{ formatDate(alumno.fecha_nacimiento) }}
                  </ng-container>
                  <input *ngIf="isEditing(alumno)"
                         type="date"
                         class="form-control"
                         [ngModel]="editingAlumno!.fecha_nacimiento | date:'yyyy-MM-dd'"
                         (ngModelChange)="editingAlumno!.fecha_nacimiento = $event">
                </td>
                <td>
                  <div class="btn-group">
                    <ng-container *ngIf="!isEditing(alumno)">
                      <button class="btn btn-primary btn-sm" (click)="startEditing(alumno)">
                        <i class="bi bi-pencil"></i> Editar
                      </button>
                      <button class="btn btn-danger btn-sm ms-1" (click)="deleteAlumno(alumno.id!)">
                        <i class="bi bi-trash"></i> Eliminar
                      </button>
                    </ng-container>
                    <ng-container *ngIf="isEditing(alumno)">
                      <button class="btn btn-success btn-sm" (click)="saveAlumno()">
                        <i class="bi bi-check"></i> Guardar
                      </button>
                      <button class="btn btn-secondary btn-sm ms-1" (click)="cancelEditing()">
                        <i class="bi bi-x"></i> Cancelar
                      </button>
                    </ng-container>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-top: 20px;
    }
    .btn-group {
      display: flex;
      gap: 5px;
    }
    .form-control {
      width: 100%;
    }
  `]
})
export class ViewalumnosComponent implements OnInit {
  alumnos: Alumno[] = [];
  editingAlumno: Alumno | null = null;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAlumnos();
  }

  loadAlumnos() {
    this.apiService.getAlumnos().subscribe({
      next: (data) => {
        this.alumnos = data;
      },
      error: (err) => {
        this.error = 'Error al cargar los alumnos: ' + err;
      }
    });
  }

  isEditing(alumno: Alumno): boolean {
    return this.editingAlumno?.id === alumno.id;
  }

  startEditing(alumno: Alumno) {
    this.editingAlumno = { ...alumno };
  }

  cancelEditing() {
    this.editingAlumno = null;
  }

  saveAlumno() {
    if (!this.editingAlumno || !this.editingAlumno.id) return;

    this.apiService.updateAlumno(this.editingAlumno.id, this.editingAlumno).subscribe({
      next: (updatedAlumno) => {
        const index = this.alumnos.findIndex(a => a.id === updatedAlumno.id);
        if (index !== -1) {
          this.alumnos[index] = updatedAlumno;
        }
        this.editingAlumno = null;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Error al actualizar el alumno: ' + err;
      }
    });
  }

  deleteAlumno(id: number) {
    if (confirm('¿Está seguro que desea eliminar este alumno?')) {
      this.apiService.deleteAlumno(id).subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(a => a.id !== id);
          this.error = null;
        },
        error: (err) => {
          this.error = 'Error al eliminar el alumno: ' + err;
        }
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
}