package com.viniciostorres.RHFast.recrutamento.service;

import com.viniciostorres.RHFast.recrutamento.model.Empresa;
import com.viniciostorres.RHFast.recrutamento.repository.EmpresaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmpresaService {

    private final EmpresaRepository empresaRepository;

    public List<Empresa> findAll() {
        return empresaRepository.findAll();
    }

    public Optional<Empresa> findById(Long id) {
        return empresaRepository.findById(id);
    }

    public Empresa save(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    public void delete(Long id) {
        empresaRepository.deleteById(id);
    }

    public Optional<Empresa> findByCnpj(String cnpj) {
        return empresaRepository.findByCnpj(cnpj);
    }
}
