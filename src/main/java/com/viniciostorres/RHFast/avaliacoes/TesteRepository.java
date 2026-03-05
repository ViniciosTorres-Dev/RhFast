package com.viniciostorres.RHFast.avaliacoes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TesteRepository extends JpaRepository<Teste, Long> {
    List<Teste> findByVagaId(Long vagaId);
}
