package com.viniciostorres.RHFast.recrutamento.controller;

import com.viniciostorres.RHFast.recrutamento.dto.DashboardRecrutadorDTO;
import com.viniciostorres.RHFast.recrutamento.dto.VagaRequestDTO;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.recrutamento.model.enums.StatusVaga;
import com.viniciostorres.RHFast.recrutamento.service.VagaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@RequiredArgsConstructor
public class VagaController {

    private final VagaService vagaService;

    @GetMapping("/dashboard/{recrutadorId}")
    public ResponseEntity<DashboardRecrutadorDTO> getDashboardData(@PathVariable Long recrutadorId) {
        DashboardRecrutadorDTO data = vagaService.getDashboardData(recrutadorId);
        return ResponseEntity.ok(data);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Vaga> updateStatus(@PathVariable Long id, @RequestParam StatusVaga status) {
        Vaga vagaAtualizada = vagaService.updateStatus(id, status);
        return ResponseEntity.ok(vagaAtualizada);
    }

    @GetMapping
    public List<Vaga> getAll() {
        return vagaService.findAll();
    }

    @GetMapping("/disponiveis/{candidatoId}")
    public List<Vaga> getVagasDisponiveis(@PathVariable Long candidatoId) {
        return vagaService.findVagasDisponiveisParaCandidato(candidatoId);
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
    public Vaga create(@Valid @RequestBody VagaRequestDTO vagaDto) {
        return vagaService.save(vagaDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaga> update(@PathVariable Long id, @Valid @RequestBody VagaRequestDTO vagaDto) {
        try {
            Vaga vagaAtualizada = vagaService.update(id, vagaDto);
            return ResponseEntity.ok(vagaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
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
