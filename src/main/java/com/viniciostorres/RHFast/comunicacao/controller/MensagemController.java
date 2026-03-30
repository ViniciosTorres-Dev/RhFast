package com.viniciostorres.RHFast.comunicacao.controller;

import com.viniciostorres.RHFast.comunicacao.model.Mensagem;
import com.viniciostorres.RHFast.comunicacao.model.dto.ContatoDTO;
import com.viniciostorres.RHFast.comunicacao.service.MensagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/marcar-como-lida")
    public ResponseEntity<Void> marcarComoLida(@RequestBody Map<String, Object> payload) {
        Long usuarioLogadoId = Long.parseLong(payload.get("usuarioLogadoId").toString());
        String usuarioLogadoTipo = payload.get("usuarioLogadoTipo").toString();
        Long outroUsuarioId = Long.parseLong(payload.get("outroUsuarioId").toString());
        String outroUsuarioTipo = payload.get("outroUsuarioTipo").toString();

        mensagemService.marcarConversaComoLida(usuarioLogadoId, usuarioLogadoTipo, outroUsuarioId, outroUsuarioTipo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{mensagemId}/apagar-para-mim")
    public ResponseEntity<Void> apagarMensagemParaMim(
            @PathVariable Long mensagemId,
            @RequestBody Map<String, Object> payload) {
        Long usuarioLogadoId = Long.parseLong(payload.get("usuarioLogadoId").toString());
        String usuarioLogadoTipo = payload.get("usuarioLogadoTipo").toString();

        mensagemService.apagarMensagemParaMim(mensagemId, usuarioLogadoId, usuarioLogadoTipo);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/conversa/apagar-para-mim")
    public ResponseEntity<Void> apagarConversaParaMim(@RequestBody Map<String, Object> payload) {
        Long usuarioLogadoId = Long.parseLong(payload.get("usuarioLogadoId").toString());
        String usuarioLogadoTipo = payload.get("usuarioLogadoTipo").toString();
        Long outroUsuarioId = Long.parseLong(payload.get("outroUsuarioId").toString());
        String outroUsuarioTipo = payload.get("outroUsuarioTipo").toString();

        mensagemService.apagarConversaParaMim(usuarioLogadoId, usuarioLogadoTipo, outroUsuarioId, outroUsuarioTipo);
        return ResponseEntity.ok().build();
    }
}
