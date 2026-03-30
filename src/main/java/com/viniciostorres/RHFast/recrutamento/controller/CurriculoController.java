package com.viniciostorres.RHFast.recrutamento.controller;

import com.viniciostorres.RHFast.recrutamento.model.Curriculo;
import com.viniciostorres.RHFast.recrutamento.service.CurriculoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/curriculos")
@RequiredArgsConstructor
public class CurriculoController {

    private final CurriculoService curriculoService;

    @PostMapping("/upload/{candidatoId}")
    public ResponseEntity<Curriculo> uploadCurriculo(@PathVariable Long candidatoId, @RequestParam("arquivo") MultipartFile arquivo) {
        Curriculo novoCurriculo = curriculoService.salvarCurriculo(candidatoId, arquivo);
        return ResponseEntity.ok(novoCurriculo);
    }

    @GetMapping("/candidato/{candidatoId}")
    public ResponseEntity<List<Curriculo>> listarCurriculos(@PathVariable Long candidatoId) {
        List<Curriculo> curriculos = curriculoService.listarCurriculosPorCandidato(candidatoId);
        return ResponseEntity.ok(curriculos);
    }

    @DeleteMapping("/{curriculoId}")
    public ResponseEntity<Void> deletarCurriculo(@PathVariable Long curriculoId) {
        curriculoService.deletarCurriculo(curriculoId);
        return ResponseEntity.noContent().build();
    }
}
