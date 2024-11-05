package com.example.practica.controllers;

import java.util.List;
import java.util.Optional;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import com.example.practica.models.Curso;
import com.example.practica.models.Alumno;
import com.example.practica.services.CursoService;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/cursos")
public class CursosController {

	@Autowired
	private CursoService cursoService; // Inyectamos la dependencia del servicio para usar sus métodos

	@GetMapping
	public List<Curso> getCursos() {
		return this.cursoService.getCursos();
	}

	@PostMapping
	public ResponseEntity<Curso> saveCurso(@RequestBody Curso curso) {
		try {
			Curso savedCurso = cursoService.saveCurso(curso);
			return ResponseEntity.status(HttpStatus.CREATED).body(savedCurso);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@GetMapping(path = "/{id}")
	public ResponseEntity<Curso> getCursoByID(@PathVariable("id") Long id) {
		Optional<Curso> curso = this.cursoService.getById(id);
		if (curso.isPresent()) {
			return ResponseEntity.ok(curso.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PutMapping(path = "/{id}")
	public ResponseEntity<Curso> updateCursoById(@PathVariable("id") Long id, @RequestBody Curso request) {
		Curso updatedCurso = cursoService.updateById(request, id);

		if (updatedCurso != null) {
			return ResponseEntity.ok(updatedCurso);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<String> deleteById(@PathVariable("id") Long id) {
		boolean ok = this.cursoService.deleteCurso(id);

		if (ok) {
			return ResponseEntity.ok("Curso con id " + id + " eliminado.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al eliminar el curso con id " + id);
		}
	}

	@GetMapping("/fecha-fin")
	public ResponseEntity<List<Curso>> getCursosByFechaFin(@RequestParam("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
		List<Curso> cursos = cursoService.getCursosByFechaFin(fecha);
		return ResponseEntity.ok(cursos);
	}//http://localhost:8082/api/cursos/fecha-fin?fecha=2024-12-01

	@GetMapping("/docente/{id}/alumnos")
	public ResponseEntity<List<Alumno>> getAlumnosByDocenteId(@PathVariable("id") Long docenteId) {
		List<Alumno> alumnos = cursoService.getAlumnosByDocenteId(docenteId);
		return ResponseEntity.ok(alumnos);
	}//http://localhost:8082/api/cursos/docente/{id}/alumnos

	@GetMapping("/docente/legajo/{legajo}/alumnos")
	public ResponseEntity<List<Alumno>> getAlumnosByDocenteLegajo(@PathVariable("legajo") Long legajo) {
		List<Alumno> alumnos = cursoService.getAlumnosByDocenteLegajo(legajo);
		return ResponseEntity.ok(alumnos);
	}


}