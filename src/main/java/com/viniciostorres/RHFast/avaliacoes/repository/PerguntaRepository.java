package com.viniciostorres.RHFast.avaliacoes.repository;

import com.viniciostorres.RHFast.avaliacoes.model.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, Long> {
}
