package com.viniciostorres.RHFast.repository;

import com.viniciostorres.RHFast.model.Recrutador;
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
