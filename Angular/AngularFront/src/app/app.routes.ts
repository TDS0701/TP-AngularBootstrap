import { Routes } from '@angular/router';
import { ViewalumnosComponent } from './components/view-alumno/view-alumno.component';
import { AddalumnoComponent } from './components/add-alumno/add-alumno.component';
import { ViewcursosComponent } from './components/view-curso/view-curso.component';
import { AddcursoComponent } from './components/add-curso/add-curso.component';
import { ViewdocentesComponent } from './components/view-docente/view-docente.component';
import { AdddocenteComponent } from './components/add-docente/add-docente.component';
import { ViewtemasComponent } from './components/view-tema/view-tema.component';
import { AddtemaComponent } from './components/add-tema/add-tema.component';
import { SearchCursosByDateComponent } from './components/searchCurso-ByDate/searchCurso-ByDate.component';
import { ViewalumnosByDocenteLegajoComponent } from './components/view-alumnoByDocenteLegajo/view-alumnoByDocenteLegajo.component'

export const routes: Routes = [
  { path: '', redirectTo: '/cursos', pathMatch: 'full' },
  { path: 'alumnos', component: ViewalumnosComponent },
  { path: 'alumnos/add', component: AddalumnoComponent },
  { path: 'cursos', component: ViewcursosComponent },
  { path: 'cursos/add', component: AddcursoComponent },
  { path: 'cursos/search', component: SearchCursosByDateComponent },
  { path: 'docentes', component: ViewdocentesComponent },
  { path: 'docentes/add', component: AdddocenteComponent },
  { path: 'temas', component: ViewtemasComponent },
  { path: 'temas/add', component: AddtemaComponent },
  { path: 'alumnos/search-by-docente', component: ViewalumnosByDocenteLegajoComponent } 
];
