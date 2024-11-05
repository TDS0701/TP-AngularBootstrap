import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    HttpClientModule
  ],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Sistema Escolar</a>
        <button class="navbar-toggler" type="button" (click)="isMenuCollapsed = !isMenuCollapsed">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" [class.show]="!isMenuCollapsed">
          <ul class="navbar-nav">
            <!-- Cursos -->
            <li class="nav-item dropdown" (click)="toggleDropdown('cursos')" [class.show]="activeDropdown === 'cursos'">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)">Cursos</a>
              <ul class="dropdown-menu" [class.show]="activeDropdown === 'cursos'">
                <li><a class="dropdown-item" routerLink="/cursos" (click)="closeMenus()">Ver Cursos</a></li>
                <li><a class="dropdown-item" routerLink="/cursos/add" (click)="closeMenus()">Agregar Curso</a></li>
                <li><a class="dropdown-item" routerLink="/cursos/search" (click)="closeMenus()">Buscar Cursos</a></li>
              </ul>
            </li>

            <!-- Alumnos -->
              <li class="nav-item dropdown" (click)="toggleDropdown('alumnos')" [class.show]="activeDropdown === 'alumnos'">
                <a class="nav-link dropdown-toggle" href="javascript:void(0)">Alumnos</a>
                <ul class="dropdown-menu" [class.show]="activeDropdown === 'alumnos'">
                  <li><a class="dropdown-item" routerLink="/alumnos" (click)="closeMenus()">Ver Alumnos</a></li>
                  <li><a class="dropdown-item" routerLink="/alumnos/add" (click)="closeMenus()">Agregar Alumno</a></li>
                  <li><a class="dropdown-item" routerLink="/alumnos/search-by-docente" (click)="closeMenus()">Buscar por Id de Docente</a></li>
                </ul>
              </li>


            <!-- Docentes -->
            <li class="nav-item dropdown" (click)="toggleDropdown('docentes')" [class.show]="activeDropdown === 'docentes'">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)">Docentes</a>
              <ul class="dropdown-menu" [class.show]="activeDropdown === 'docentes'">
                <li><a class="dropdown-item" routerLink="/docentes" (click)="closeMenus()">Ver Docentes</a></li>
                <li><a class="dropdown-item" routerLink="/docentes/add" (click)="closeMenus()">Agregar Docente</a></li>
              </ul>
            </li>

            <!-- Temas -->
            <li class="nav-item dropdown" (click)="toggleDropdown('temas')" [class.show]="activeDropdown === 'temas'">
              <a class="nav-link dropdown-toggle" href="javascript:void(0)">Temas</a>
              <ul class="dropdown-menu" [class.show]="activeDropdown === 'temas'">
                <li><a class="dropdown-item" routerLink="/temas" (click)="closeMenus()">Ver Temas</a></li>
                <li><a class="dropdown-item" routerLink="/temas/add" (click)="closeMenus()">Agregar Tema</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .dropdown-menu.show {
      display: block;
    }
    .nav-item.dropdown {
      position: relative;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
    }
  `]
})
export class AppComponent {
  isMenuCollapsed = true;
  activeDropdown: string | null = null;

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeMenus() {
    this.activeDropdown = null;
    this.isMenuCollapsed = true;
  }
}