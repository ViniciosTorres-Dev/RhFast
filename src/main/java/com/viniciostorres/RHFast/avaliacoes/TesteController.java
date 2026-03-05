package com.viniciostorres.RHFast.avaliacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testes")
public class TesteController {

    @Autowired
    private TesteService testeService;

    @PostMapping("/vaga/{vagaId}")
    public ResponseEntity<Teste> criarTeste(@PathVariable Long vagaId, @RequestBody Teste teste) {
        Teste novoTeste = testeService.criarTeste(vagaId, teste);
        return ResponseEntity.ok(novoTeste);
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
}
