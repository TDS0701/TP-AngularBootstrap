import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Docente } from '../../models/docente.model';

@Component({
  selector: 'app-view-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Docentes</h2>
    <div *ngIf="error" class="alert alert-danger">
      {{ error }}
    </div>
    <table class="table table-striped" *ngIf="!error">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Legajo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let docente of docentes">
          <td>
            <ng-container *ngIf="!isEditing(docente)">
              {{ docente.nombre }}
            </ng-container>
            <input *ngIf="isEditing(docente)" [(ngModel)]="editingDocente!.nombre" class="form-control">
          </td>
          <td>
            <ng-container *ngIf="!isEditing(docente)">
              {{ docente.legajo }}
            </ng-container>
            <input *ngIf="isEditing(docente)" type="number" [(ngModel)]="editingDocente!.legajo" class="form-control">
          </td>
          <td>
            <div class="btn-group">
              <ng-container *ngIf="!isEditing(docente)">
                <button class="btn btn-primary btn-sm" (click)="startEditing(docente)">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm ms-1" (click)="deleteDocente(docente.id!)">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </ng-container>
              <ng-container *ngIf="isEditing(docente)">
                <button class="btn btn-success btn-sm" (click)="saveDocente()">
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
  `,
  styles: [`
    .btn-group {
      display: flex;
      gap: 5px;
    }
    .form-control {
      width: 100%;
    }
  `]
})
export class ViewdocentesComponent implements OnInit {
  docentes: Docente[] = [];
  editingDocente: Docente | null = null;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDocentes();
  }

  loadDocentes() {
    this.apiService.getDocentes().subscribe({
      next: (docentes) => {
        this.docentes = docentes;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar los docentes: ' + error;
      }
    });
  }

  isEditing(docente: Docente): boolean {
    return this.editingDocente?.id === docente.id;
  }

  startEditing(docente: Docente) {
    this.editingDocente = { ...docente };
  }

  cancelEditing() {
    this.editingDocente = null;
  }

  saveDocente() {
    if (!this.editingDocente || !this.editingDocente.id) return;

    this.apiService.updateDocente(this.editingDocente.id, this.editingDocente).subscribe({
      next: (updatedDocente) => {
        const index = this.docentes.findIndex(d => d.id === updatedDocente.id);
        if (index !== -1) {
          this.docentes[index] = updatedDocente;
        }
        this.editingDocente = null;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al actualizar el docente: ' + error;
      }
    });
  }

  deleteDocente(id: number) {
    if (confirm('¿Está seguro que desea eliminar este docente?')) {
      this.apiService.deleteDocente(id).subscribe({
        next: () => {
          this.docentes = this.docentes.filter(docente => docente.id !== id);
          this.error = null;
        },
        error: (error) => {
          this.error = 'Error al eliminar el docente: ' + error;
        }
      });
    }
  }
}