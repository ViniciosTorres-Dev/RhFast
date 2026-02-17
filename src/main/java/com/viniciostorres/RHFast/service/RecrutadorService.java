package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Recrutador;
import com.viniciostorres.RHFast.repository.CandidatoRepository;
import com.viniciostorres.RHFast.repository.RecrutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecrutadorService {

    private final RecrutadorRepository recrutadorRepository;
    private final CandidatoRepository candidatoRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<Recrutador> getAll() {
        return recrutadorRepository.findAll();
    }

    public Recrutador save(Recrutador recrutador) {
        String senhaCriptografada = bCryptPasswordEncoder.encode(recrutador.getSenha());
        recrutador.setSenha(senhaCriptografada);

        boolean isNovoCadastro = (recrutador.getId() == null);

        String telefoneLimpo = limparTexto(recrutador.getNumeroTelefone());
        String cpfLimpo = limparTexto(recrutador.getCpf());

        recrutador.setNumeroTelefone(telefoneLimpo);
        recrutador.setCpf(cpfLimpo);

        if (candidatoRepository.existsByEmail(recrutador.getEmail())) {
            throw new IllegalArgumentException("Esse E-mail já está cadastrado");
        }

        if (candidatoRepository.existsByNumeroTelefone(telefoneLimpo)) {
            throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
        }

        Optional<Recrutador> recrutadorComEmail = recrutadorRepository.findByEmail(recrutador.getEmail());
        if (recrutadorComEmail.isPresent() && !recrutadorComEmail.get().getId().equals(recrutador.getId())) {
            throw new IllegalArgumentException("Esse E-mail já está em uso por outro recrutador");
        }

        Optional<Recrutador> recrutadorComTelefone = recrutadorRepository.findByNumeroTelefone(telefoneLimpo);
        if (recrutadorComTelefone.isPresent() && !recrutadorComTelefone.get().getId().equals(recrutador.getId())) {
            throw new IllegalArgumentException("Esse telefone já está em uso por outro recrutador");
        }

        Recrutador salvo = recrutadorRepository.save(recrutador);

        if (isNovoCadastro) {
            emailService.enviarEmailBoasVindas(salvo.getEmail(), salvo.getNome());
        }

        return salvo;
    }

    public void delete(Long id) {
        recrutadorRepository.deleteById(id);
    }

    public Optional<Recrutador> findById(Long id) {
        return recrutadorRepository.findById(id);
    }

    private String limparTexto(String texto) {
        if (texto == null) return null;
        return texto.replaceAll("\\D", "");
    }
}