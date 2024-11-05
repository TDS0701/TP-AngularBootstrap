import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.services';
import { Tema } from '../../models/tema.model';

@Component({
  selector: 'app-add-tema',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Agregar Tema</h2>
    <div *ngIf="error" class="error-message">{{ error }}</div>
    <form (ngSubmit)="onSubmit()" *ngIf="!loading">
      <div class="form-group">
        <label>Nombre:</label>
        <input [(ngModel)]="tema.nombre" name="nombre" placeholder="Nombre del tema" required>
      </div>
      <div class="form-group">
        <label>Descripción:</label>
        <textarea [(ngModel)]="tema.descripcion" name="descripcion" placeholder="Descripción del tema" required></textarea>
      </div>
      <button type="submit" [disabled]="loading">Agregar Tema</button>
    </form>
    <div *ngIf="loading" class="loading">Cargando...</div>
  `,
  styles: [/* estilos iguales a AddalumnoComponent */]
})
export class AddtemaComponent {
  tema: Tema = { nombre: '', descripcion: '' };
  error: string | null = null;
  loading = false;

  constructor(private apiService: ApiService) {}

  onSubmit() {
    this.loading = true;
    this.apiService.addTema(this.tema).subscribe({
      next: (response) => {
        console.log('Tema agregado', response);
        this.tema = { nombre: '', descripcion: '' };
        this.error = null;
      },
      error: (error) => {
        this.error = 'Error al agregar el tema: ' + error;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
