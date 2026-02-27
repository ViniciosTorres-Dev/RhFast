package com.viniciostorres.RHFast.recrutamento.controller;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.recrutamento.service.VagaService;
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
    public List<Vaga> getAll() {
        return vagaService.findAll();
    }

    @GetMapping("/buscar")
    public List<Vaga> buscarVagas(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String localizacao,
            @RequestParam(required = false) NivelExperiencia nivel,
            @RequestParam(required = false) Modalidade modalidade
    ) {
        return vagaService.buscarVagas(termo, localizacao, nivel, modalidade);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaga> getById(@PathVariable Long id) {
        return vagaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recrutador/{recrutadorId}")
    public List<Vaga> getByRecrutadorId(@PathVariable Long recrutadorId) {
        return vagaService.findByRecrutadorId(recrutadorId);
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Vaga> getByEmpresaId(@PathVariable Long empresaId) {
        return vagaService.findByEmpresaId(empresaId);
    }

    @PostMapping
    public Vaga create(@Valid @RequestBody Vaga vaga) {
        return vagaService.save(vaga);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaga> update(@PathVariable Long id, @Valid @RequestBody Vaga vaga) {
        return vagaService.findById(id)
                .map(existingVaga -> {
                    vaga.setId(id);
                    vaga.setDataPostagem(existingVaga.getDataPostagem());
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
