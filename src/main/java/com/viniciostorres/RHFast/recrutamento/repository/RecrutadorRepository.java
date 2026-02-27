package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Recrutador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecrutadorRepository extends JpaRepository<Recrutador, Long> {

    Optional<Recrutador> findByEmail(String email);
    Optional<Recrutador> findByNumeroTelefone(String numeroTelefone);
    boolean existsByEmail(String email);
    boolean existsByNumeroTelefone(String numeroTelefone);
    List<Recrutador> findByEmpresaId(Long empresaId);
}
