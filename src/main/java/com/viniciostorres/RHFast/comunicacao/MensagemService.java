package com.viniciostorres.RHFast.comunicacao;

import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Recrutador;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.RecrutadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
        return mensagemRepository.save(mensagem);
    }

    public List<Mensagem> obterConversa(Long usuario1Id, String usuario1Tipo, Long usuario2Id, String usuario2Tipo) {
        return mensagemRepository.findConversa(usuario1Id, usuario1Tipo, usuario2Id, usuario2Tipo);
    }

    public List<ContatoDTO> listarContatos(Long usuarioId, String usuarioTipo) {
        Set<String> contatosUnicos = new HashSet<>();
        List<ContatoDTO> contatos = new ArrayList<>();

        // Buscar contatos para quem enviou mensagem
        List<Object[]> enviados = mensagemRepository.findContatosEnviados(usuarioId, usuarioTipo);
        for (Object[] obj : enviados) {
            Long id = (Long) obj[0];
            String tipo = (String) obj[1];
            String chave = id + "-" + tipo;
            if (!contatosUnicos.contains(chave)) {
                contatosUnicos.add(chave);
                contatos.add(criarContatoDTO(id, tipo));
            }
        }

        // Buscar contatos de quem recebeu mensagem
        List<Object[]> recebidos = mensagemRepository.findContatosRecebidos(usuarioId, usuarioTipo);
        for (Object[] obj : recebidos) {
            Long id = (Long) obj[0];
            String tipo = (String) obj[1];
            String chave = id + "-" + tipo;
            if (!contatosUnicos.contains(chave)) {
                contatosUnicos.add(chave);
                contatos.add(criarContatoDTO(id, tipo));
            }
        }

        return contatos;
    }

    private ContatoDTO criarContatoDTO(Long id, String tipo) {
        String nome = "Desconhecido";
        if ("CANDIDATO".equals(tipo)) {
            Candidato c = candidatoRepository.findById(id).orElse(null);
            if (c != null) nome = c.getNome() + " " + c.getSobrenome();
        } else if ("RECRUTADOR".equals(tipo)) {
            Recrutador r = recrutadorRepository.findById(id).orElse(null);
            if (r != null) nome = r.getNome() + " " + r.getSobrenome();
        }
        return new ContatoDTO(id, nome, tipo, "", "");
    }
}
