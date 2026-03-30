package com.viniciostorres.RHFast.recrutamento.service;

import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.RecrutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final RecrutadorRepository recrutadorRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<Candidato> getAll() { return candidatoRepository.findAll();}

    public Candidato save(Candidato candidato) {
        boolean isNovoCadastro = (candidato.getId() == null);

        String telefoneLimpo = limparTexto(candidato.getNumeroTelefone());
        String cpfLimpo = limparTexto(candidato.getCpf());

        candidato.setNumeroTelefone(telefoneLimpo);
        candidato.setCpf(cpfLimpo);

        if (isNovoCadastro) {
            if (candidatoRepository.existsByEmail(candidato.getEmail()) || recrutadorRepository.existsByEmail(candidato.getEmail())) {
                throw new IllegalArgumentException("Esse E-mail já está cadastrado");
            }
            if (candidatoRepository.existsByNumeroTelefone(telefoneLimpo) || recrutadorRepository.existsByNumeroTelefone(telefoneLimpo)) {
                throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
            }
            String senhaCriptografada = bCryptPasswordEncoder.encode(candidato.getSenha());
            candidato.setSenha(senhaCriptografada);
        } else {
            Candidato existingCandidato = candidatoRepository.findById(candidato.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Candidato não encontrado para atualização."));

            if (!existingCandidato.getEmail().equals(candidato.getEmail())) {
                if (candidatoRepository.existsByEmail(candidato.getEmail()) || recrutadorRepository.existsByEmail(candidato.getEmail())) {
                    throw new IllegalArgumentException("Esse E-mail já está cadastrado");
                }
            }

            if (!existingCandidato.getNumeroTelefone().equals(telefoneLimpo)) {
                 if (candidatoRepository.existsByNumeroTelefone(telefoneLimpo) || recrutadorRepository.existsByNumeroTelefone(telefoneLimpo)) {
                    throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
                }
            }

            if (candidato.getSenha() != null && !candidato.getSenha().isEmpty()) {
                String senhaCriptografada = bCryptPasswordEncoder.encode(candidato.getSenha());
                candidato.setSenha(senhaCriptografada);
            } else {
                candidato.setSenha(existingCandidato.getSenha());
            }
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

    public Candidato autenticar(String email, String senhaDigitada) {
        Candidato candidato = candidatoRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));

        if (!bCryptPasswordEncoder.matches(senhaDigitada, candidato.getSenha())) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }

        return candidato;
    }

    private String limparTexto(String texto) {
        if (texto == null) return null;
        return texto.replaceAll("\\D", "");
    }
}
