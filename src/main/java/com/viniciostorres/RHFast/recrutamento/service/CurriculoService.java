package com.viniciostorres.RHFast.recrutamento.service;

import com.viniciostorres.RHFast.avaliacoes.service.FileStorageService;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Curriculo;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.CurriculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CurriculoService {

    private final CurriculoRepository curriculoRepository;
    private final CandidatoRepository candidatoRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public Curriculo salvarCurriculo(Long candidatoId, MultipartFile arquivo) {
        Candidato candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));

        String caminho = fileStorageService.storeFile(arquivo);

        Curriculo curriculo = new Curriculo();
        curriculo.setCandidato(candidato);
        curriculo.setNomeCurriculo(arquivo.getOriginalFilename());
        curriculo.setTipoArquivo(arquivo.getContentType());
        curriculo.setUrlCurriculo(caminho);

        return curriculoRepository.save(curriculo);
    }

    public List<Curriculo> listarCurriculosPorCandidato(Long candidatoId) {
        Candidato candidato = candidatoRepository.findById(candidatoId)
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));
        return candidato.getCurriculos();
    }

    @Transactional
    public void deletarCurriculo(Long curriculoId) {
        curriculoRepository.deleteById(curriculoId);
    }
}
