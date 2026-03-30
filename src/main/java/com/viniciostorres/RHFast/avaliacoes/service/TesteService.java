package com.viniciostorres.RHFast.avaliacoes.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciostorres.RHFast.avaliacoes.model.Pergunta;
import com.viniciostorres.RHFast.avaliacoes.model.RespostaSubmetida;
import com.viniciostorres.RHFast.avaliacoes.model.SubmissaoTeste;
import com.viniciostorres.RHFast.avaliacoes.model.Teste;
import com.viniciostorres.RHFast.avaliacoes.model.dto.SubmissaoDTO;
import com.viniciostorres.RHFast.avaliacoes.repository.PerguntaRepository;
import com.viniciostorres.RHFast.avaliacoes.repository.SubmissaoTesteRepository;
import com.viniciostorres.RHFast.avaliacoes.repository.TesteRepository;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.VagaRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Service
@RequiredArgsConstructor
public class TesteService {

    private final TesteRepository testeRepository;
    private final VagaRepository vagaRepository;
    private final PerguntaRepository perguntaRepository;
    private final CandidatoRepository candidatoRepository;
    private final SubmissaoTesteRepository submissaoTesteRepository;
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;

    @Transactional
    public Teste criarTesteComArquivos(Teste teste, Long vagaId, List<MultipartFile> arquivos) {
        if (arquivos != null && !arquivos.isEmpty()) {
            int fileIndex = 0;
            for (Pergunta pergunta : teste.getPerguntas()) {
                if (pergunta.getFilePath() != null && fileIndex < arquivos.size()) {
                    String storedPath = fileStorageService.storeFile(arquivos.get(fileIndex++));
                    pergunta.setFilePath(storedPath);
                }
            }
        }
        return criarTeste(teste, vagaId);
    }

    @Transactional(readOnly = true)
    public SubmissaoTeste buscarSubmissaoPorId(Long submissaoId) {
        return submissaoTesteRepository.findById(submissaoId)
                .orElseThrow(() -> new RuntimeException("Submissão não encontrada"));
    }

    @Transactional
    public Teste criarTeste(Teste teste, Long vagaId) {
        if (teste.getPerguntas() != null) {
            teste.getPerguntas().forEach(pergunta -> pergunta.setTeste(teste));
        }
        Teste testeSalvo = testeRepository.save(teste);

        if (vagaId != null) {
            Vaga vaga = vagaRepository.findById(vagaId)
                    .orElseThrow(() -> new RuntimeException("Vaga não encontrada para associar ao teste."));
            vaga.getTestes().add(testeSalvo);
            vagaRepository.save(vaga);
        }

        return testeSalvo;
    }

    @Transactional
    public Teste updateTeste(Long id, Teste testeAtualizado) {
        Teste testeExistente = testeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teste não encontrado para atualização."));

        testeExistente.setTitulo(testeAtualizado.getTitulo());
        testeExistente.setTipo(testeAtualizado.getTipo());
        testeExistente.setDescricao(testeAtualizado.getDescricao());

        testeExistente.getPerguntas().clear();

        if (testeAtualizado.getPerguntas() != null) {
            testeAtualizado.getPerguntas().forEach(p -> {
                p.setTeste(testeExistente);
                testeExistente.getPerguntas().add(p);
            });
        }

        return testeRepository.save(testeExistente);
    }

    @Transactional
    public void deletarTeste(Long id) {
        Teste teste = testeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teste não encontrado para exclusão."));

        for (Vaga vaga : teste.getVagas()) {
            vaga.getTestes().remove(teste);
        }

        List<SubmissaoTeste> submissoes = submissaoTesteRepository.findByTesteId(id);
        submissaoTesteRepository.deleteAll(submissoes);

        testeRepository.delete(teste);
    }

    @Transactional
    public SubmissaoTeste salvarSubmissao(SubmissaoDTO submissaoDTO) {
        submissaoTesteRepository.findByTesteIdAndCandidatoId(submissaoDTO.getTesteId(), submissaoDTO.getCandidatoId())
                .ifPresent(s -> {
                    throw new IllegalStateException("Este teste já foi submetido por este candidato.");
                });

        Teste teste = testeRepository.findById(submissaoDTO.getTesteId())
                .orElseThrow(() -> new RuntimeException("Teste não encontrado"));
        Candidato candidato = candidatoRepository.findById(submissaoDTO.getCandidatoId())
                .orElseThrow(() -> new RuntimeException("Candidato não encontrado"));

        SubmissaoTeste submissao = new SubmissaoTeste();
        submissao.setTeste(teste);
        submissao.setCandidato(candidato);

        List<RespostaSubmetida> respostas = new ArrayList<>();
        double pontuacaoTotal = 0;
        int perguntasCorrigiveis = 0;

        for (SubmissaoDTO.RespostaDTO respDTO : submissaoDTO.getRespostas()) {
            Pergunta pergunta = perguntaRepository.findById(respDTO.getPerguntaId())
                    .orElseThrow(() -> new RuntimeException("Pergunta não encontrada: " + respDTO.getPerguntaId()));

            RespostaSubmetida respostaSubmetida = new RespostaSubmetida();
            respostaSubmetida.setPergunta(pergunta);
            respostaSubmetida.setSubmissaoTeste(submissao);

            try {
                respostaSubmetida.setResposta(objectMapper.writeValueAsString(respDTO.getResposta()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erro ao serializar resposta para a pergunta: " + pergunta.getId());
            }

            if ("MULTIPLA_ESCOLHA".equals(pergunta.getTipoResposta())) {
                perguntasCorrigiveis++;
                if (isRespostaMultiplaEscolhaCorreta(pergunta, respDTO.getResposta())) {
                    pontuacaoTotal++;
                }
            }
            respostas.add(respostaSubmetida);
        }

        submissao.setRespostas(respostas);
        if (perguntasCorrigiveis > 0) {
            submissao.setPontuacao((pontuacaoTotal / perguntasCorrigiveis) * 100);
        } else {
            submissao.setPontuacao(null);
        }

        return submissaoTesteRepository.save(submissao);
    }

    private boolean isRespostaMultiplaEscolhaCorreta(Pergunta pergunta, Object resposta) {
        if (!(resposta instanceof List)) return false;
        try {
            @SuppressWarnings("unchecked")
            List<Integer> respostasCandidato = ((List<Object>) resposta).stream()
                    .map(o -> Integer.parseInt(o.toString()))
                    .collect(Collectors.toList());

            List<Integer> respostasCorretas = pergunta.getRespostasCorretas();

            Collections.sort(respostasCandidato);
            Collections.sort(respostasCorretas);

            return respostasCandidato.equals(respostasCorretas);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean verificarSeTesteFoiConcluido(Long testeId, Long candidatoId) {
        return submissaoTesteRepository.findByTesteIdAndCandidatoId(testeId, candidatoId).isPresent();
    }

    public List<Teste> listarTestesPorVaga(Long vagaId) {
        return vagaRepository.findById(vagaId).map(Vaga::getTestes).orElse(Collections.emptyList());
    }

    public List<Teste> listarTodosTestes() {
        return testeRepository.findAll();
    }

    public Teste buscarTestePorId(Long id) {
        return testeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teste não encontrado"));
    }

    @Transactional(readOnly = true)
    public long contarTestesConcluidosPorVagas(List<Long> vagaIds) {
        if (vagaIds == null || vagaIds.isEmpty()) {
            return 0;
        }
        return submissaoTesteRepository.countByVagasIds(vagaIds);
    }

    @Transactional(readOnly = true)
    public List<SubmissaoTeste> listarSubmissoesPorTeste(Long testeId) {
        return submissaoTesteRepository.findByTesteId(testeId);
    }

    public List<Teste> listarTodosOsTestes() {
        return null;
    }
}
