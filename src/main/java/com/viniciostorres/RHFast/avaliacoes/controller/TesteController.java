package com.viniciostorres.RHFast.avaliacoes.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viniciostorres.RHFast.avaliacoes.service.FileStorageService;
import com.viniciostorres.RHFast.avaliacoes.service.TesteService;
import com.viniciostorres.RHFast.avaliacoes.model.Pergunta;
import com.viniciostorres.RHFast.avaliacoes.model.SubmissaoTeste;
import com.viniciostorres.RHFast.avaliacoes.model.Teste;
import com.viniciostorres.RHFast.avaliacoes.model.dto.SubmissaoDTO;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/testes")
@RequiredArgsConstructor
public class TesteController {

    private final TesteService testeService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;
    private final VagaRepository vagaRepository;

    @PostMapping
    public ResponseEntity<Teste> criarTesteSimples(@RequestBody Teste teste, @RequestParam(required = false) Long vagaId) {
        Teste novoTeste = testeService.criarTeste(teste, vagaId);
        return ResponseEntity.ok(novoTeste);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teste> atualizarTeste(@PathVariable Long id, @RequestBody Teste teste) {
        Teste testeAtualizado = testeService.updateTeste(id, teste);
        return ResponseEntity.ok(testeAtualizado);
    }

    @PostMapping(value = "/com-arquivos", consumes = "multipart/form-data")
    public ResponseEntity<Teste> criarTesteComArquivos(
            @RequestParam("vagaId") Long vagaId,
            @RequestPart("teste") String testeJson,
            @RequestPart(name = "arquivos", required = false) List<MultipartFile> arquivos) throws IOException {
        
        Teste teste = objectMapper.readValue(testeJson, Teste.class);
        
        if (arquivos != null && !arquivos.isEmpty()) {
            int fileIndex = 0;
            for (Pergunta pergunta : teste.getPerguntas()) {
                if (pergunta.getFilePath() != null && !pergunta.getFilePath().isEmpty() && fileIndex < arquivos.size()) {
                    String storedPath = fileStorageService.storeFile(arquivos.get(fileIndex++));
                    pergunta.setFilePath(storedPath); // Correção: Atualiza o filePath com o nome real
                }
            }
        }
        
        Teste novoTeste = testeService.criarTeste(teste, vagaId);
        return ResponseEntity.ok(novoTeste);
    }

    @GetMapping
    public ResponseEntity<List<Teste>> listarTodosOsTestes() {
        List<Teste> testes = testeService.listarTodosOsTestes();
        return ResponseEntity.ok(testes);
    }

    @GetMapping("/vaga/{vagaId}")
    public ResponseEntity<List<Teste>> listarTestesPorVaga(@PathVariable Long vagaId) {
        List<Teste> testes = testeService.listarTestesPorVaga(vagaId);
        return ResponseEntity.ok(testes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teste> buscarTestePorId(@PathVariable Long id) {
        Teste teste = testeService.buscarTestePorId(id);
        return ResponseEntity.ok(teste);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTeste(@PathVariable Long id) {
        testeService.deletarTeste(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submeter")
    public ResponseEntity<SubmissaoTeste> submeterTeste(@RequestBody SubmissaoDTO submissaoDTO) {
        SubmissaoTeste submissaoSalva = testeService.salvarSubmissao(submissaoDTO);
        return ResponseEntity.ok(submissaoSalva);
    }

    @GetMapping("/submissoes/{submissaoId}")
    public ResponseEntity<SubmissaoTeste> getSubmissaoPorId(@PathVariable Long submissaoId) {
        SubmissaoTeste submissao = testeService.buscarSubmissaoPorId(submissaoId);
        return ResponseEntity.ok(submissao);
    }

    @GetMapping("/{testeId}/candidato/{candidatoId}/status")
    public ResponseEntity<Map<String, Boolean>> verificarStatusTeste(@PathVariable Long testeId, @PathVariable Long candidatoId) {
        boolean concluido = testeService.verificarSeTesteFoiConcluido(testeId, candidatoId);
        return ResponseEntity.ok(Map.of("concluido", concluido));
    }

    @GetMapping("/recrutador/{recrutadorId}/concluidos/count")
    public ResponseEntity<Long> contarTestesConcluidosPorRecrutador(@PathVariable Long recrutadorId) {
        List<Long> vagaIds = vagaRepository.findByRecrutadorId(recrutadorId).stream().map(Vaga::getId).collect(Collectors.toList());
        long count = testeService.contarTestesConcluidosPorVagas(vagaIds);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{testeId}/submissoes")
    public ResponseEntity<List<SubmissaoTeste>> listarSubmissoesPorTeste(@PathVariable Long testeId) {
        List<SubmissaoTeste> submissoes = testeService.listarSubmissoesPorTeste(testeId);
        return ResponseEntity.ok(submissoes);
    }
}
