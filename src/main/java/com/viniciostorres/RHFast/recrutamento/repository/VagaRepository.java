package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VagaRepository extends JpaRepository<Vaga, Long> {
    List<Vaga> findByRecrutadorId(Long recrutadorId);
    List<Vaga> findByEmpresaId(Long empresaId);

    // Nova consulta para encontrar vagas onde o candidato NÃO se inscreveu
    @Query("SELECT v FROM Vaga v WHERE v.status = 'ABERTA' AND v.id NOT IN " +
           "(SELECT c.vaga.id FROM Candidatura c WHERE c.candidato.id = :candidatoId)")
    List<Vaga> findVagasNaoInscritas(@Param("candidatoId") Long candidatoId);
}
