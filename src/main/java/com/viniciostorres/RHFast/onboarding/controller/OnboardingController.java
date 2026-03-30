package com.viniciostorres.RHFast.onboarding.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciostorres.RHFast.onboarding.model.DocumentoExigido;
import com.viniciostorres.RHFast.onboarding.model.ProcessoAdmissao;
import com.viniciostorres.RHFast.onboarding.model.StatusDocumento;
import com.viniciostorres.RHFast.onboarding.model.dto.CriarProcessoAdmissaoDTO;
import com.viniciostorres.RHFast.onboarding.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    // ----- Ações do Recrutador -----

    @PostMapping(value = "/iniciar", consumes = "multipart/form-data")
    public ResponseEntity<ProcessoAdmissao> iniciarProcesso(
            @RequestPart("dados") String dadosJson,
            @RequestParam(required = false) Map<String, MultipartFile> arquivosInstrucao) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        CriarProcessoAdmissaoDTO dto = mapper.readValue(dadosJson, CriarProcessoAdmissaoDTO.class);

        ProcessoAdmissao processo = onboardingService.iniciarProcessoAdmissao(dto, arquivosInstrucao);
        return ResponseEntity.ok(processo);
    }

    @PutMapping("/documento/{docId}/avaliar")
    public ResponseEntity<DocumentoExigido> avaliarDocumento(
            @PathVariable Long docId,
            @RequestParam StatusDocumento status,
            @RequestParam(required = false) String observacao) {
        DocumentoExigido doc = onboardingService.recrutadorAvaliaDocumento(docId, status, observacao);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/vaga/{vagaId}") // Endpoint que estava faltando
    public ResponseEntity<List<ProcessoAdmissao>> listarProcessosPorVaga(@PathVariable Long vagaId) {
        List<ProcessoAdmissao> processos = onboardingService.buscarProcessosPorVaga(vagaId);
        return ResponseEntity.ok(processos);
    }

    // ----- Ações do Candidato -----

    @GetMapping("/candidato/{candidatoId}")
    public ResponseEntity<List<ProcessoAdmissao>> listarProcessosDoCandidato(@PathVariable Long candidatoId) {
        List<ProcessoAdmissao> processos = onboardingService.buscarProcessosDoCandidato(candidatoId);
        return ResponseEntity.ok(processos);
    }

    @GetMapping("/processo/{processoId}")
    public ResponseEntity<ProcessoAdmissao> buscarProcessoPorId(@PathVariable Long processoId) {
        ProcessoAdmissao processo = onboardingService.buscarProcessoPorId(processoId);
        return ResponseEntity.ok(processo);
    }

    @PostMapping(value = "/documento/{docId}/enviar", consumes = "multipart/form-data")
    public ResponseEntity<DocumentoExigido> enviarDocumento(
            @PathVariable Long docId,
            @RequestParam("arquivo") MultipartFile arquivo) {
        DocumentoExigido doc = onboardingService.candidatoEnviaDocumento(docId, arquivo);
        return ResponseEntity.ok(doc);
    }
}
