package com.viniciostorres.RHFast.repository;

import com.viniciostorres.RHFast.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

    Optional<Candidato> findByEmail(String email);
    Optional<Candidato> findByNumeroTelefone(String numeroTelefone);
    boolean existsByEmail(String email);
    boolean existsByNumeroTelefone(String numeroTelefone);
}
