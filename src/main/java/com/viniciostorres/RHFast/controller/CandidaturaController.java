package com.viniciostorres.RHFast.controller;

import com.viniciostorres.RHFast.dto.InscricaoDTO;
import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.service.CandidaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidaturas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    @PostMapping
    public ResponseEntity<Candidatura> inscrever(@RequestBody @Valid InscricaoDTO dto) {
        Candidatura novaCandidatura = candidaturaService.inscrever(dto.getIdCandidato(), dto.getIdVaga());

        return ResponseEntity.status(HttpStatus.CREATED).body(novaCandidatura);
    }
}