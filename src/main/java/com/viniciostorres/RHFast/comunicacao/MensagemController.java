package com.viniciostorres.RHFast.comunicacao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensagens")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @PostMapping
    public ResponseEntity<Mensagem> enviarMensagem(@RequestBody Mensagem mensagem) {
        Mensagem novaMensagem = mensagemService.enviarMensagem(mensagem);
        return ResponseEntity.ok(novaMensagem);
    }

    @GetMapping("/conversa")
    public ResponseEntity<List<Mensagem>> obterConversa(
            @RequestParam Long usuario1Id,
            @RequestParam String usuario1Tipo,
            @RequestParam Long usuario2Id,
            @RequestParam String usuario2Tipo) {
        
        List<Mensagem> conversa = mensagemService.obterConversa(usuario1Id, usuario1Tipo, usuario2Id, usuario2Tipo);
        return ResponseEntity.ok(conversa);
    }

    @GetMapping("/contatos")
    public ResponseEntity<List<ContatoDTO>> listarContatos(
            @RequestParam Long usuarioId,
            @RequestParam String usuarioTipo) {
        List<ContatoDTO> contatos = mensagemService.listarContatos(usuarioId, usuarioTipo);
        return ResponseEntity.ok(contatos);
    }
}
