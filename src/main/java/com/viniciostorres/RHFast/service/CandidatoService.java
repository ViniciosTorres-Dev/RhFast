package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.repository.CandidatoRepository;
import com.viniciostorres.RHFast.repository.RecrutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final RecrutadorRepository recrutadorRepository;
    private final EmailService emailService;

    public List<Candidato> getAll() { return candidatoRepository.findAll();}

    public Candidato save(Candidato candidato) {
        boolean isNovoCadastro = (candidato.getId() == null);

        String telefoneLimpo = limparTexto(candidato.getNumeroTelefone());
        String cpfLimpo = limparTexto(candidato.getCpf());

        candidato.setNumeroTelefone(telefoneLimpo);
        candidato.setCpf(cpfLimpo);

        if (recrutadorRepository.existsByEmail(candidato.getEmail())) {
            throw new IllegalArgumentException("Esse E-mail já está cadastrado");
        }

        if (recrutadorRepository.existsByNumeroTelefone(telefoneLimpo)) {
            throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
        }

        Optional<Candidato> candidatoComEmail = candidatoRepository.findByEmail(candidato.getEmail());
        if (candidatoComEmail.isPresent() && !candidatoComEmail.get().getId().equals(candidato.getId())) {
            throw new IllegalArgumentException("Esse E-mail já está cadastrado");
        }

        Optional<Candidato> candidatoComTelefone = candidatoRepository.findByNumeroTelefone(telefoneLimpo);
        if (candidatoComTelefone.isPresent() && !candidatoComTelefone.get().getId().equals(candidato.getId())) {
            throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
        }

        Candidato salvo = candidatoRepository.save(candidato);

        if (isNovoCadastro) {
            emailService.enviarEmailBoasVindas(salvo.getEmail(), salvo.getNome());
        }

        return salvo;
    }

    public void delete(Long id) { candidatoRepository.deleteById(id);}

    public Optional<Candidato> findById(Long id) {
        return candidatoRepository.findById(id);
    }

    private String limparTexto(String texto) {
        if (texto == null) return null;
        return texto.replaceAll("\\D", "");
    }
}
