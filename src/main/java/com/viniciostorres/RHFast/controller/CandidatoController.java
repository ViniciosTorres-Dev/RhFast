package com.viniciostorres.RHFast.controller;

import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.service.CandidatoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidatos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidatoController {

    private final CandidatoService candidatoService;

    @GetMapping
    public List<Candidato> getAll() {return candidatoService.getAll();}

    @GetMapping("/{id}")
    public ResponseEntity<Candidato> getById(@PathVariable Long id) {
        return candidatoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Candidato create(@Valid @RequestBody Candidato candidato) { return candidatoService.save(candidato);}

    @PostMapping("/login")
    public ResponseEntity<Candidato> login(@RequestBody Candidato loginData) {
        Candidato autenticado = candidatoService.autenticar(loginData.getEmail(), loginData.getSenha());

        return ResponseEntity.ok(autenticado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidato> update(@PathVariable Long id, @Valid @RequestBody Candidato candidato) {
        return candidatoService.findById(id)
                .map(existingCandidato -> {
                    candidato.setId(id);
                    return ResponseEntity.ok(candidatoService.save(candidato));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (candidatoService.findById(id).isPresent()) {
            candidatoService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
