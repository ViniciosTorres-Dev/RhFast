package com.viniciostorres.RHFast.repository;

import com.viniciostorres.RHFast.model.Candidatura;
import com.viniciostorres.RHFast.model.Candidato;
import com.viniciostorres.RHFast.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {

    boolean existsByCandidatoAndVaga(Candidato candidato, Vaga vaga);

}