package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.repository.CandidatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;

    public List<Candidato> getAll() { return candidatoRepository.findAll();}

    public Candidato save(Candidato candidato) {
        if (candidatoRepository.existsByEmail(candidato.getEmail())) {
            throw new IllegalArgumentException("Esse E-mail já está cadastrado");
        }

        if (candidatoRepository.existsByNumeroTelefone(candidato.getNumeroTelefone())) {
            throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
        }

        return candidatoRepository.save(candidato);
        }

    public void delete(Long id) { candidatoRepository.deleteById(id);}

    public Optional<Candidato> findById(Long id) {
        return candidatoRepository.findById(id);
    }
}
