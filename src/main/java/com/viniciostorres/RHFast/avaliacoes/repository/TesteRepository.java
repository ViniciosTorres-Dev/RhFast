package com.viniciostorres.RHFast.avaliacoes.repository;

import com.viniciostorres.RHFast.avaliacoes.model.Teste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TesteRepository extends JpaRepository<Teste, Long> {
    List<Teste> findByVagas_Id(Long vagaId);
    List<Teste> findByVagas_IdIn(List<Long> vagaIds);
}
