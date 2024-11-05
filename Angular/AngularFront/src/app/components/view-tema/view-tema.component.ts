import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Tema } from '../../models/tema.model';

@Component({
  selector: 'app-view-temas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Temas</h2>
    <div *ngIf="error" class="alert alert-danger">
      {{ error }}
    </div>
    <table class="table table-striped" *ngIf="!error">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let tema of temas">
          <td>
            <ng-container *ngIf="!isEditing(tema)">
              {{ tema.nombre }}
            </ng-container>
            <input *ngIf="isEditing(tema)" [(ngModel)]="editingTema!.nombre" class="form-control">
          </td>
          <td>
            <ng-container *ngIf="!isEditing(tema)">
              {{ tema.descripcion }}
            </ng-container>
            <textarea *ngIf="isEditing(tema)" [(ngModel)]="editingTema!.descripcion" class="form-control"></textarea>
          </td>
          <td>
            <div class="btn-group">
              <ng-container *ngIf="!isEditing(tema)">
                <button class="btn btn-primary btn-sm" (click)="startEditing(tema)">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm ms-1" (click)="deleteTema(tema.id!)">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </ng-container>
              <ng-container *ngIf="isEditing(tema)">
                <button class="btn btn-success btn-sm" (click)="saveTema()">
                  <i class="bi bi-check"></i> Guardar
                </button>
                <button class="btn btn-secondary btn-sm ms-1" (click)="cancelEditing()">
                  <i class="bi  bi-x"></i> Cancelar
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
export class ViewtemasComponent implements OnInit {
  temas: Tema[] = [];
  editingTema: Tema | null = null;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadTemas();
  }

  loadTemas() {
    this.apiService.getTemas().subscribe({
      next: (temas) => {
        this.temas = temas;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al cargar los temas: ' + error;
      }
    });
  }

  isEditing(tema: Tema): boolean {
    return this.editingTema?.id === tema.id;
  }

  startEditing(tema: Tema) {
    this.editingTema = { ...tema };
  }

  cancelEditing() {
    this.editingTema = null;
  }

  saveTema() {
    if (!this.editingTema || !this.editingTema.id) return;

    this.apiService.updateTema(this.editingTema.id, this.editingTema).subscribe({
      next: (updatedTema) => {
        const index = this.temas.findIndex(t => t.id === updatedTema.id);
        if (index !== -1) {
          this.temas[index] = updatedTema;
        }
        this.editingTema = null;
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al actualizar el tema: ' + error;
      }
    });
  }

  deleteTema(id: number) {
    if (confirm('¿Está seguro que desea eliminar este tema?')) {
      this.apiService.deleteTema(id).subscribe({
        next: () => {
          this.temas = this.temas.filter(tema => tema.id !== id);
          this.error = null;
        },
        error: (error) => {
          this.error = 'Error al eliminar el tema: ' + error;
        }
      });
    }
  }
}