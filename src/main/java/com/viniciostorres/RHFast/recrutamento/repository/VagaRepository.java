package com.viniciostorres.RHFast.recrutamento.repository;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VagaRepository extends JpaRepository<Vaga, Long> {
    List<Vaga> findByRecrutadorId(Long recrutadorId);
    List<Vaga> findByEmpresaId(Long empresaId);

    @Query("SELECT v FROM Vaga v WHERE " +
            "(:termo IS NULL OR LOWER(v.nomeVaga) LIKE :termo OR LOWER(v.descricaoVaga) LIKE :termo) AND " +
            "(:localizacao IS NULL OR LOWER(v.cidade) LIKE :localizacao OR LOWER(v.estado) LIKE :localizacao) AND " +
            "(:nivel IS NULL OR v.nivelExperiencia = :nivel) AND " +
            "(:modalidade IS NULL OR v.modalidade = :modalidade)")
    List<Vaga> buscarVagasComFiltro(
            @Param("termo") String termo,
            @Param("localizacao") String localizacao,
            @Param("nivel") NivelExperiencia nivel,
            @Param("modalidade") Modalidade modalidade
    );
}
