package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Recrutador;
import com.viniciostorres.RHFast.model.Vaga;
import com.viniciostorres.RHFast.model.enums.Modalidade;
import com.viniciostorres.RHFast.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;
    private final RecrutadorService recrutadorService;

    public List<Vaga> findAll() { return vagaRepository.findAll();}

    public Vaga save(Vaga vaga) {
        if (vaga.getRecrutador() != null && vaga.getRecrutador().getId() != null && vaga.getEmpresa() == null) {
            Recrutador recrutador = recrutadorService.findById(vaga.getRecrutador().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Recrutador não encontrado"));
            
            if (recrutador.getEmpresa() != null) {
                vaga.setEmpresa(recrutador.getEmpresa());
            } else {
                throw new IllegalStateException("O recrutador não está vinculado a nenhuma empresa.");
            }
            vaga.setRecrutador(recrutador);
        }
        
        return vagaRepository.save(vaga);
    }

    public void delete(Long id) { vagaRepository.deleteById(id);}

    public Optional<Vaga> findById(Long id) {
        return vagaRepository.findById(id);
    }

    public List<Vaga> findByRecrutadorId(Long recrutadorId) {
        return vagaRepository.findByRecrutadorId(recrutadorId);
    }

    public List<Vaga> findByEmpresaId(Long empresaId) {
        return vagaRepository.findByEmpresaId(empresaId);
    }

    public List<Vaga> buscarVagas(String termo, String localizacao, NivelExperiencia nivel, Modalidade modalidade) {
        // Converte para minúsculas e adiciona os coringas %
        String termoLike = (termo != null && !termo.isEmpty()) ? "%" + termo.toLowerCase() + "%" : null;
        String localizacaoLike = (localizacao != null && !localizacao.isEmpty()) ? "%" + localizacao.toLowerCase() + "%" : null;
        
        return vagaRepository.buscarVagasComFiltro(termoLike, localizacaoLike, nivel, modalidade);
    }
}
