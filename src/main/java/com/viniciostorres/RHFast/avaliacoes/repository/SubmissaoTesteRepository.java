package com.viniciostorres.RHFast.avaliacoes.repository;

import com.viniciostorres.RHFast.avaliacoes.model.SubmissaoTeste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissaoTesteRepository extends JpaRepository<SubmissaoTeste, Long> {
    Optional<SubmissaoTeste> findByTesteIdAndCandidatoId(Long testeId, Long candidatoId);

    long countByTesteIdIn(List<Long> testeIds);

    List<SubmissaoTeste> findByTesteId(Long testeId);

    @Query("SELECT count(s) FROM SubmissaoTeste s JOIN s.teste t JOIN t.vagas v WHERE v.id IN :vagaIds")
    long countByVagasIds(@Param("vagaIds") List<Long> vagaIds);
}
