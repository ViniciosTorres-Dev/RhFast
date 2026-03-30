package com.viniciostorres.RHFast.onboarding.service;

import com.viniciostorres.RHFast.avaliacoes.service.FileStorageService;
import com.viniciostorres.RHFast.onboarding.model.dto.CriarProcessoAdmissaoDTO;
import com.viniciostorres.RHFast.onboarding.model.AnexoInstrucao;
import com.viniciostorres.RHFast.onboarding.model.DocumentoExigido;
import com.viniciostorres.RHFast.onboarding.model.ProcessoAdmissao;
import com.viniciostorres.RHFast.onboarding.model.StatusDocumento;
import com.viniciostorres.RHFast.onboarding.repository.DocumentoExigidoRepository;
import com.viniciostorres.RHFast.onboarding.repository.ProcessoAdmissaoRepository;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.VagaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OnboardingService {

    @Autowired
    private ProcessoAdmissaoRepository processoRepository;
    @Autowired
    private DocumentoExigidoRepository documentoRepository;
    @Autowired
    private VagaRepository vagaRepository;
    @Autowired
    private CandidatoRepository candidatoRepository;
    @Autowired
    private FileStorageService fileStorageService; 

    @Transactional
    public ProcessoAdmissao iniciarProcessoAdmissao(CriarProcessoAdmissaoDTO dto, Map<String, MultipartFile> arquivosInstrucao) {
        if (processoRepository.findByVagaIdAndCandidatoId(dto.getVagaId(), dto.getCandidatoId()).isPresent()) {
            throw new IllegalStateException("O candidato já está em processo de admissão para esta vaga.");
        }

        Vaga vaga = vagaRepository.findById(dto.getVagaId())
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        Candidato candidato = candidatoRepository.findById(dto.getCandidatoId())
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));

        ProcessoAdmissao processo = new ProcessoAdmissao();
        processo.setVaga(vaga);
        processo.setCandidato(candidato);
        processo.setInstrucoesGerais(dto.getInstrucoesGerais());

        List<DocumentoExigido> docsExigidos = new ArrayList<>();
        if (dto.getDocumentosExigidos() != null) {
            for (CriarProcessoAdmissaoDTO.DocumentoDTO docDto : dto.getDocumentosExigidos()) {
                DocumentoExigido doc = new DocumentoExigido();
                doc.setNomeDocumento(docDto.getNomeDocumento());
                doc.setFormatoEsperado(docDto.getFormatoEsperado());
                doc.setProcessoAdmissao(processo);
                doc.setStatus(StatusDocumento.PENDENTE);
                docsExigidos.add(doc);
            }
        }
        processo.setDocumentosExigidos(docsExigidos);

        List<AnexoInstrucao> anexos = new ArrayList<>();
        if (arquivosInstrucao != null) {
            for (Map.Entry<String, MultipartFile> entry : arquivosInstrucao.entrySet()) {
                String titulo = entry.getKey();
                MultipartFile file = entry.getValue();

                String caminho = fileStorageService.storeFile(file);

                AnexoInstrucao anexo = new AnexoInstrucao();
                anexo.setTituloGeral(titulo);
                anexo.setNomeArquivo(file.getOriginalFilename());
                anexo.setCaminhoArquivo(caminho);
                anexo.setProcessoAdmissao(processo);
                anexos.add(anexo);
            }
        }
        processo.setAnexosInstrucoes(anexos);

        return processoRepository.save(processo);
    }

    public List<ProcessoAdmissao> buscarProcessosDoCandidato(Long candidatoId) {
        return processoRepository.findByCandidatoId(candidatoId);
    }

    public List<ProcessoAdmissao> buscarProcessosPorVaga(Long vagaId) {
        return processoRepository.findByVagaId(vagaId);
    }

    public ProcessoAdmissao buscarProcessoPorId(Long processoId) {
        return processoRepository.findById(processoId)
                .orElseThrow(() -> new RuntimeException("Processo de Admissão não encontrado"));
    }

    @Transactional
    public DocumentoExigido candidatoEnviaDocumento(Long documentoId, MultipartFile arquivo) {
        DocumentoExigido doc = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento exigido não encontrado"));

        String caminho = fileStorageService.storeFile(arquivo);
        doc.setCaminhoArquivoEnviado(caminho);
        doc.setStatus(StatusDocumento.ENVIADO);

        return documentoRepository.save(doc);
    }

    @Transactional
    public DocumentoExigido recrutadorAvaliaDocumento(Long documentoId, StatusDocumento status, String observacao) {
        DocumentoExigido doc = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado"));

        if (status != StatusDocumento.APROVADO && status != StatusDocumento.REJEITADO) {
            throw new IllegalArgumentException("Status de avaliação inválido.");
        }

        doc.setStatus(status);
        doc.setObservacaoRecrutador(observacao);
        return documentoRepository.save(doc);
    }
}
