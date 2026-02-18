package com.viniciostorres.RHFast.controller;

import com.viniciostorres.RHFast.dto.InscricaoDTO;
import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.model.Vaga;
import com.viniciostorres.RHFast.service.CandidaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidaturas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    @GetMapping
    public List<Candidatura> getAll() {return candidaturaService.getAll();}

    @GetMapping("/{id}")
    public ResponseEntity<Candidatura> getById(@PathVariable Long id) {
        return candidaturaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/candidato/{candidatoId}/vagas")
    public List<Long> getVagasInscritas(@PathVariable Long candidatoId) {
        return candidaturaService.getVagasInscritasPorCandidato(candidatoId);
    }

    @GetMapping("/vaga/{vagaId}")
    public List<Candidatura> getCandidaturasPorVaga(@PathVariable Long vagaId) {
        return candidaturaService.getCandidaturasPorVaga(vagaId);
    }

    @PostMapping
    public ResponseEntity<Candidatura> inscrever(@RequestBody @Valid InscricaoDTO dto) {
        Candidatura novaCandidatura = candidaturaService.inscrever(dto.getIdCandidato(), dto.getIdVaga());

        return ResponseEntity.status(HttpStatus.CREATED).body(novaCandidatura);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (candidaturaService.findById(id).isPresent()) {
            candidaturaService.delete(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Candidatura> update(@PathVariable Long id, @Valid @RequestBody Candidatura candidatura) {
        return candidaturaService.findById(id)
                .map(existingCandidatura -> {
                    candidatura.setId(id);
                    return ResponseEntity.ok(candidaturaService.save(candidatura));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
