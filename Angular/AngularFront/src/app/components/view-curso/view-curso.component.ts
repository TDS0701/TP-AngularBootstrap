import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Curso } from '../../models/curso.model';
import { Alumno } from '../../models/alumno.model';

@Component({
  selector: 'app-view-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Cursos</h2>
      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>
      <table class="table table-striped" *ngIf="!error">
        <thead>
          <tr>
            <th>Tema</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Docente</th>
            <th>Precio</th>
            <th>Alumnos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let curso of cursos">
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.tema.nombre }}
              </ng-container>
              <input *ngIf="isEditing(curso)" [(ngModel)]="editingCurso!.tema.nombre" class="form-control">
            </td>
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.fechaInicio | date }}
              </ng-container>
              <input *ngIf="isEditing(curso)" type="date" [ngModel]="editingCurso!.fechaInicio | date:'yyyy-MM-dd'" (ngModelChange)="editingCurso!.fechaInicio = $event" class="form-control">
            </td>
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.fechaFin | date }}
              </ng-container>
              <input *ngIf="isEditing(curso)" type="date" [ngModel]="editingCurso!.fechaFin | date:'yyyy-MM-dd'" (ngModelChange)="editingCurso!.fechaFin = $event" class="form-control">
            </td>
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.docente.nombre }}
              </ng-container>
              <input *ngIf="isEditing(curso)" [(ngModel)]="editingCurso!.docente.nombre" class="form-control">
            </td>
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.precio | currency }}
              </ng-container>
              <input *ngIf="isEditing(curso)" type="number" [(ngModel)]="editingCurso!.precio" class="form-control">
            </td>
            <td>
              <ng-container *ngIf="!isEditing(curso)">
                {{ curso.alumnos.length }} alumnos
              </ng-container>
              <div *ngIf="isEditing(curso)" class="alumno-editor">
                <div class="mb-2">
                  <select class="form-control" [(ngModel)]="selectedAlumno">
                    <option [ngValue]="null">Seleccionar alumno...</option>
                    <option *ngFor="let alumno of availableAlumnos" [ngValue]="alumno">
                      {{ alumno.nombre }}
                    </option>
                  </select>
                  <button class="btn btn-sm btn-success mt-1" 
                          (click)="addAlumnoToCurso()"
                          [disabled]="!selectedAlumno">
                    Agregar Alumno
                  </button>
                </div>
                <div class="selected-alumnos">
                  <div *ngFor="let alumno of editingCurso!.alumnos" class="alumno-item">
                    {{ alumno.nombre }}
                    <button class="btn btn-sm btn-danger" (click)="removeAlumnoFromCurso(alumno)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="btn-group">
                <ng-container *ngIf="!isEditing(curso)">
                  <button class="btn btn-primary btn-sm" (click)="startEditing(curso)">
                    <i class="bi bi-pencil"></i> Editar
                  </button>
                  <button class="btn btn-danger btn-sm ms-1" (click)="deleteCurso(curso.id!)">
                    <i class="bi bi-trash"></i> Eliminar
                  </button>
                </ng-container>
                <ng-container *ngIf="isEditing(curso)">
                  <button class="btn btn-success btn-sm" (click)="saveCurso()">
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
  `,
  styles: [`
    .btn-group {
      display: flex;
      gap: 5px;
    }
    .form-control {
      width: 100%;
    }
    .alumno-editor {
      max-height: 200px;
      overflow-y: auto;
    }
    .alumno-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem;
      border-bottom: 1px solid #dee2e6;
    }
    .alumno-item:last-child {
      border-bottom: none;
    }
    .selected-alumnos {
      margin-top: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      padding: 0.5rem;
    }
  `]
})
export class ViewcursosComponent implements OnInit {
  cursos: Curso[] = [];
  editingCurso: Curso | null = null;
  error: string | null = null;
  availableAlumnos: Alumno[] = [];
  selectedAlumno: Alumno | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCursos();
    this.loadAlumnos();
  }

  loadCursos() {
    this.apiService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar los cursos: ' + error;
      }
    });
  }

  loadAlumnos() {
    this.apiService.getAlumnos().subscribe({
      next: (alumnos) => {
        this.availableAlumnos = alumnos;
      },
      error: (error) => {
        this.error = 'Error al cargar los alumnos: ' + error;
      }
    });
  }

  isEditing(curso: Curso): boolean {
    return this.editingCurso?.id === curso.id;
  }

  startEditing(curso: Curso) {
    this.editingCurso = JSON.parse(JSON.stringify(curso)); // Deep copy
    this.selectedAlumno = null;
  }

  cancelEditing() {
    this.editingCurso = null;
    this.selectedAlumno = null;
  }

  addAlumnoToCurso() {
    if (this.editingCurso && this.selectedAlumno) {
      if (!this.editingCurso.alumnos.some(a => a.id === this.selectedAlumno!.id)) {
        this.editingCurso.alumnos.push(this.selectedAlumno);
      }
      this.selectedAlumno = null;
    }
  }

  removeAlumnoFromCurso(alumno: Alumno) {
    if (this.editingCurso) {
      this.editingCurso.alumnos = this.editingCurso.alumnos.filter(a => a.id !== alumno.id);
    }
  }

  saveCurso() {
    if (!this.editingCurso || !this.editingCurso.id) return;

    this.apiService.updateCurso(this.editingCurso.id, this.editingCurso).subscribe({
      next: (updatedCurso) => {
        const index = this.cursos.findIndex(c => c.id === updatedCurso.id);
        if (index !== -1) {
          this.cursos[index] = updatedCurso;
        }
        this.editingCurso = null;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al actualizar el curso: ' + error;
      }
    });
  }

  deleteCurso(id: number) {
    if (confirm('¿Está seguro que desea eliminar este curso?')) {
      this.apiService.deleteCurso(id).subscribe({
        next: () => {
          this.cursos = this.cursos.filter(curso => curso.id !== id);
          this.error = null;
        },
        error: (error) => {
          this.error = 'Error al eliminar el curso: ' + error;
        }
      });
    }
  }
}