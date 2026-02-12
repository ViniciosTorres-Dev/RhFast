package com.viniciostorres.RHFast.controller;

import com.viniciostorres.RHFast.model.Recrutador;
import com.viniciostorres.RHFast.service.RecrutadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recrutadores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecrutadorController {

    private final RecrutadorService recrutadorService;

    @GetMapping
    public List<Recrutador> getAll() {return recrutadorService.getAll();}

    @GetMapping("/{id}")
    public ResponseEntity<Recrutador> getById(@PathVariable Long id) {
        return recrutadorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Recrutador create(@Valid @RequestBody Recrutador recrutador) { return recrutadorService.save(recrutador);}

    @PutMapping("/{id}")
    public ResponseEntity<Recrutador> update(@PathVariable Long id, @Valid @RequestBody Recrutador recrutador) {
        return recrutadorService.findById(id)
                .map(existingRecrutador -> {
                    recrutador.setId(id);
                    return ResponseEntity.ok(recrutadorService.save(recrutador));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (recrutadorService.findById(id).isPresent()) {
            recrutadorService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
