package com.viniciostorres.RHFast.repository;

import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {

    boolean existsByCandidatoAndVaga(Candidato candidato, Vaga vaga);

    @Query("SELECT c.vaga.id FROM Candidatura c WHERE c.candidato.id = :candidatoId")
    List<Long> findVagaIdsByCandidatoId(@Param("candidatoId") Long candidatoId);

    List<Candidatura> findByVagaId(Long vagaId);
}
