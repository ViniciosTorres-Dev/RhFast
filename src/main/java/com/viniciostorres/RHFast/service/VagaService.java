package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Vaga;
import com.viniciostorres.RHFast.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;

    public List<Vaga> getAll() { return vagaRepository.findAll();}

    public Vaga save(Vaga vaga) {
        return vagaRepository.save(vaga);
    }

    public void delete(Long id) { vagaRepository.deleteById(id);}

    public Optional<Vaga> findById(Long id) {
        return vagaRepository.findById(id);
    }
}

