package com.viniciostorres.RHFast.controller;

import com.viniciostorres.RHFast.model.Vaga;
import com.viniciostorres.RHFast.service.VagaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VagaController {

    private final VagaService vagaService;

    @GetMapping
    public List<Vaga> getAll() {return vagaService.getAll();}

    @GetMapping("/{id}")
    public ResponseEntity<Vaga> getById(@PathVariable Long id) {
        return vagaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Vaga create(@Valid @RequestBody Vaga vaga) { return vagaService.save(vaga);}

    @PutMapping("/{id}")
    public ResponseEntity<Vaga> update(@PathVariable Long id, @Valid @RequestBody Vaga vaga) {
        return vagaService.findById(id)
                .map(existingVaga -> {
                    vaga.setId(id);
                    return ResponseEntity.ok(vagaService.save(vaga));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (vagaService.findById(id).isPresent()) {
            vagaService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
