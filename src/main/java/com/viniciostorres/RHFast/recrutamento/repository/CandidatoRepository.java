package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {

    Optional<Candidato> findByEmail(String email);
    Optional<Candidato> findByNumeroTelefone(String numeroTelefone);
    boolean existsByEmail(String email);
    boolean existsByNumeroTelefone(String numeroTelefone);

    @Query("SELECT c FROM Candidato c WHERE " +
           "lower(c.nome) LIKE lower(concat('%', :query, '%')) OR " +
           "lower(c.sobrenome) LIKE lower(concat('%', :query, '%')) OR " +
           "lower(concat(c.nome, ' ', c.sobrenome)) LIKE lower(concat('%', :query, '%'))")
    List<Candidato> searchByNome(@Param("query") String query);
}
