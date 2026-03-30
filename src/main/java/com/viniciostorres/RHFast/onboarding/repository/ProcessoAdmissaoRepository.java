package com.viniciostorres.RHFast.onboarding.repository;

import com.viniciostorres.RHFast.onboarding.model.ProcessoAdmissao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProcessoAdmissaoRepository extends JpaRepository<ProcessoAdmissao, Long> {
    List<ProcessoAdmissao> findByCandidatoId(Long candidatoId);
    List<ProcessoAdmissao> findByVagaId(Long vagaId);
    Optional<ProcessoAdmissao> findByVagaIdAndCandidatoId(Long vagaId, Long candidatoId);
}