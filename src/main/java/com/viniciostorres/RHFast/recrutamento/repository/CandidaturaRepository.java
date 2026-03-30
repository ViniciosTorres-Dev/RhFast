package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Candidatura;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {

    List<Candidatura> findByCandidatoId(Long candidatoId);

    List<Candidatura> findByVagaId(Long vagaId);

    List<Candidatura> findByVagaIdIn(List<Long> vagaIds);

    @Query("SELECT c.vaga.id FROM Candidatura c WHERE c.candidato.id = :candidatoId")
    List<Long> findVagaIdsByCandidatoId(@Param("candidatoId") Long candidatoId);

    boolean existsByCandidatoAndVaga(Candidato candidato, Vaga vaga);

    // Nova consulta para buscar candidaturas de um recrutador específico
    @Query("SELECT c FROM Candidatura c WHERE c.vaga.recrutador.id = :recrutadorId")
    List<Candidatura> findByRecrutadorId(@Param("recrutadorId") Long recrutadorId);
}
