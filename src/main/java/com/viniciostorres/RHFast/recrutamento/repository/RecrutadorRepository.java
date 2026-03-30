package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Recrutador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query("SELECT r FROM Recrutador r LEFT JOIN r.empresa e WHERE " +
            "lower(r.nome) LIKE lower(concat('%', :query, '%')) OR " +
            "lower(r.sobrenome) LIKE lower(concat('%', :query, '%')) OR " +
            "lower(concat(r.nome, ' ', r.sobrenome)) LIKE lower(concat('%', :query, '%')) OR " +
            "lower(e.nome) LIKE lower(concat('%', :query, '%'))")
    List<Recrutador> searchByNomeOrEmpresa(@Param("query") String query);
}
