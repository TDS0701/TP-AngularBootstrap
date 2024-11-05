import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Docente } from '../../models/docente.model';

@Component({
  selector: 'app-add-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Agregar Docente</h2>
    <div *ngIf="error" class="error-message">{{ error }}</div>
    <form (ngSubmit)="onSubmit()" *ngIf="!loading">
      <div class="form-group">
        <label>Nombre:</label>
        <input [(ngModel)]="docente.nombre" name="nombre" placeholder="Nombre del docente" required>
      </div>
      <div class="form-group">
        <label>Legajo:</label>
        <input [(ngModel)]="docente.legajo" name="legajo" type="number" required>
      </div>
      <button type="submit" [disabled]="loading">Agregar Docente</button>
    </form>
    <div *ngIf="loading" class="loading">Cargando...</div>
  `,
  styles: [/* estilos iguales a AddalumnoComponent */]
})
export class AdddocenteComponent {
  docente: Docente = { nombre: '', legajo: 0 };
  error: string | null = null;
  loading = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.loading = true;
    this.apiService.addDocente(this.docente).subscribe({
      next: (response) => {
        console.log('Docente agregado', response);
        this.docente = { nombre: '', legajo: 0 };
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al agregar el docente: ' + error;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
