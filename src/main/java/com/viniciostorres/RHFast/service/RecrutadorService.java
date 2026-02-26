package com.viniciostorres.RHFast.service;

import com.viniciostorres.RHFast.model.Empresa;
import com.viniciostorres.RHFast.model.Recrutador;
import com.viniciostorres.RHFast.repository.CandidatoRepository;
import com.viniciostorres.RHFast.repository.EmpresaRepository;
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
    private final EmpresaRepository empresaRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public List<Recrutador> getAll() {
        return recrutadorRepository.findAll();
    }

    public Recrutador save(Recrutador recrutador) {
        boolean isNovoCadastro = (recrutador.getId() == null);

        String telefoneLimpo = limparTexto(recrutador.getNumeroTelefone());
        String cpfLimpo = limparTexto(recrutador.getCpf());
        recrutador.setNumeroTelefone(telefoneLimpo);
        recrutador.setCpf(cpfLimpo);
        
        if (recrutador.getEmpresa() != null) {
            Empresa empresaRecebida = recrutador.getEmpresa();
            
            if (empresaRecebida.getId() != null) {
                Empresa empresaExistente = empresaRepository.findById(empresaRecebida.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Empresa não encontrada com o ID informado."));
                recrutador.setEmpresa(empresaExistente);
            } else if (empresaRecebida.getCnpj() != null) {
                String cnpjLimpo = limparTexto(empresaRecebida.getCnpj());
                empresaRecebida.setCnpj(cnpjLimpo);
                
                Optional<Empresa> empresaExistente = empresaRepository.findByCnpj(cnpjLimpo);
                
                if (empresaExistente.isPresent()) {
                    recrutador.setEmpresa(empresaExistente.get());
                } else {
                    if(empresaRecebida.getCep() != null) empresaRecebida.setCep(limparTexto(empresaRecebida.getCep()));
                    
                    Empresa novaEmpresa = empresaRepository.save(empresaRecebida);
                    recrutador.setEmpresa(novaEmpresa);
                }
            } else {
                throw new IllegalArgumentException("Dados da empresa inválidos (CNPJ ou ID obrigatórios).");
            }
        } else {
             throw new IllegalArgumentException("É obrigatório informar os dados da empresa.");
        }

        if (isNovoCadastro) {
            if (recrutadorRepository.existsByEmail(recrutador.getEmail())) {
                throw new IllegalArgumentException("Esse E-mail já está cadastrado");
            }
            if (recrutadorRepository.existsByNumeroTelefone(telefoneLimpo)) {
                throw new IllegalArgumentException("Esse número de telefone já está cadastrado");
            }
            String senhaCriptografada = bCryptPasswordEncoder.encode(recrutador.getSenha());
            recrutador.setSenha(senhaCriptografada);
        } else {
            Optional<Recrutador> recrutadorComEmail = recrutadorRepository.findByEmail(recrutador.getEmail());
            if (recrutadorComEmail.isPresent() && !recrutadorComEmail.get().getId().equals(recrutador.getId())) {
                throw new IllegalArgumentException("Esse E-mail já está em uso por outro recrutador");
            }

            Optional<Recrutador> recrutadorComTelefone = recrutadorRepository.findByNumeroTelefone(telefoneLimpo);
            if (recrutadorComTelefone.isPresent() && !recrutadorComTelefone.get().getId().equals(recrutador.getId())) {
                throw new IllegalArgumentException("Esse telefone já está em uso por outro recrutador");
            }
            
             String senhaCriptografada = bCryptPasswordEncoder.encode(recrutador.getSenha());
             recrutador.setSenha(senhaCriptografada);
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

    public List<Recrutador> findByEmpresaId(Long empresaId) {
        return recrutadorRepository.findByEmpresaId(empresaId);
    }

    public Recrutador autenticar(String email, String senhaDigitada) {
        Recrutador recrutador = recrutadorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("E-mail ou senha inválidos"));

        if (!bCryptPasswordEncoder.matches(senhaDigitada, recrutador.getSenha())) {
            throw new IllegalArgumentException("E-mail ou senha inválidos");
        }

        return recrutador;
    }

    private String limparTexto(String texto) {
        if (texto == null) return null;
        return texto.replaceAll("\\D", "");
    }
}
