package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.model.Vaga;
import com.viniciostorres.RHFast.model.enums.StatusVaga;
import com.viniciostorres.RHFast.repository.CandidatoRepository;
import com.viniciostorres.RHFast.repository.CandidaturaRepository;
import com.viniciostorres.RHFast.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository candidaturaRepository;
    private final VagaRepository vagaRepository;
    private final CandidatoRepository candidatoRepository;

    public Candidatura inscrever(Long idCandidato, Long idVaga) {
        Candidato candidato = candidatoRepository.findById(idCandidato)
                .orElseThrow(() -> new IllegalArgumentException("Candidato não encontrado"));

        Vaga vaga = vagaRepository.findById(idVaga)
                .orElseThrow(() -> new IllegalArgumentException("Vaga não encontrada"));

        if (vaga.getStatus() != StatusVaga.ABERTA) {
            throw new IllegalStateException("Esta vaga já foi encerrada ou cancelada.");
        }

        if (candidaturaRepository.existsByCandidatoAndVaga(candidato, vaga)) {
            throw new IllegalStateException("Você já se candidatou para esta vaga.");
        }

        Candidatura candidatura = new Candidatura();
        candidatura.setCandidato(candidato);
        candidatura.setVaga(vaga);

        return candidaturaRepository.save(candidatura);
    }
}