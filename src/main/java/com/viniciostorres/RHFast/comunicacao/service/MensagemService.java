package com.viniciostorres.RHFast.comunicacao.service;

import com.viniciostorres.RHFast.comunicacao.model.Mensagem;
import com.viniciostorres.RHFast.comunicacao.model.dto.ContatoDTO;
import com.viniciostorres.RHFast.comunicacao.repository.MensagemRepository;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Recrutador;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.RecrutadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private RecrutadorRepository recrutadorRepository;

    public Mensagem enviarMensagem(Mensagem mensagem) {
        mensagem.setDataEnvio(LocalDateTime.now());
        mensagem.setLida(false); // Garante que a nova mensagem não está lida
        return mensagemRepository.save(mensagem);
    }

    @Transactional(readOnly = true)
    public List<Mensagem> obterConversa(Long usuario1Id, String usuario1Tipo, Long usuario2Id, String usuario2Tipo) {
        return mensagemRepository.findConversa(usuario1Id, usuario1Tipo, usuario2Id, usuario2Tipo);
    }

    @Transactional
    public void marcarConversaComoLida(Long usuarioLogadoId, String usuarioLogadoTipo, Long outroUsuarioId, String outroUsuarioTipo) {
        mensagemRepository.marcarComoLidas(outroUsuarioId, outroUsuarioTipo, usuarioLogadoId, usuarioLogadoTipo);
    }

    @Transactional(readOnly = true)
    public List<ContatoDTO> listarContatos(Long usuarioId, String usuarioTipo) {
        Set<String> contatosUnicos = new HashSet<>();

        // Combina contatos de mensagens enviadas e recebidas
        Stream<Object[]> contatosStream = Stream.concat(
                mensagemRepository.findContatosEnviados(usuarioId, usuarioTipo).stream(),
                mensagemRepository.findContatosRecebidos(usuarioId, usuarioTipo).stream()
        );

        return contatosStream
                .map(obj -> {
                    Long id = (Long) obj[0];
                    String tipo = (String) obj[1];
                    return id + "-" + tipo;
                })
                .filter(contatosUnicos::add) // Filtra para ter apenas contatos únicos
                .map(chave -> {
                    String[] partes = chave.split("-");
                    Long id = Long.parseLong(partes[0]);
                    String tipo = partes[1];
                    return criarContatoDTO(id, tipo, usuarioId, usuarioTipo);
                })
                .collect(Collectors.toList());
    }

    private ContatoDTO criarContatoDTO(Long id, String tipo, Long usuarioLogadoId, String usuarioLogadoTipo) {
        String nome = "Desconhecido";
        String empresa = null;

        if ("CANDIDATO".equals(tipo)) {
            Candidato c = candidatoRepository.findById(id).orElse(null);
            if (c != null) nome = c.getNome() + " " + c.getSobrenome();
        } else if ("RECRUTADOR".equals(tipo)) {
            Recrutador r = recrutadorRepository.findById(id).orElse(null);
            if (r != null) {
                nome = r.getNome() + " " + r.getSobrenome();
                if (r.getEmpresa() != null) {
                    empresa = r.getEmpresa().getNome();
                }
            }
        }
        
        // Conta as mensagens não lidas recebidas deste contato
        long mensagensNaoLidas = mensagemRepository.countByDestinatarioIdAndDestinatarioTipoAndLidaIsFalseAndRemetenteIdAndRemetenteTipoAndApagadaParaDestinatarioIsFalse(
            usuarioLogadoId, usuarioLogadoTipo, id, tipo);

        return new ContatoDTO(id, nome, tipo, empresa, mensagensNaoLidas);
    }

    @Transactional
    public void apagarMensagemParaMim(Long mensagemId, Long usuarioLogadoId, String usuarioLogadoTipo) {
        Mensagem mensagem = mensagemRepository.findById(mensagemId).orElse(null);
        if (mensagem != null) {
            if (mensagem.getRemetenteId().equals(usuarioLogadoId) && mensagem.getRemetenteTipo().equals(usuarioLogadoTipo)) {
                mensagem.setApagadaParaRemetente(true);
            } else if (mensagem.getDestinatarioId().equals(usuarioLogadoId) && mensagem.getDestinatarioTipo().equals(usuarioLogadoTipo)) {
                mensagem.setApagadaParaDestinatario(true);
            }
            mensagemRepository.save(mensagem);
        }
    }

    @Transactional
    public void apagarConversaParaMim(Long usuarioLogadoId, String usuarioLogadoTipo, Long outroUsuarioId, String outroUsuarioTipo) {
        mensagemRepository.apagarConversaComoRemetente(usuarioLogadoId, usuarioLogadoTipo, outroUsuarioId, outroUsuarioTipo);
        mensagemRepository.apagarConversaComoDestinatario(usuarioLogadoId, usuarioLogadoTipo, outroUsuarioId, outroUsuarioTipo);
    }
}