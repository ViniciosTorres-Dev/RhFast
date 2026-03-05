package com.viniciostorres.RHFast.avaliacoes;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.repository.VagaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TesteService {

    @Autowired
    private TesteRepository testeRepository;

    @Autowired
    private VagaRepository vagaRepository;

    public Teste criarTeste(Long vagaId, Teste teste) {
        Vaga vaga = vagaRepository.findById(vagaId)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        teste.setVaga(vaga);
        return testeRepository.save(teste);
    }

    public List<Teste> listarTestesPorVaga(Long vagaId) {
        return testeRepository.findByVagaId(vagaId);
    }

    public Teste buscarTestePorId(Long id) {
        return testeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teste não encontrado"));
    }

    public void deletarTeste(Long id) {
        testeRepository.deleteById(id);
    }
}
