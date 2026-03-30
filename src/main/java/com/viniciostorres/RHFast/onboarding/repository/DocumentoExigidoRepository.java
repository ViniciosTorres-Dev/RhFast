package com.viniciostorres.RHFast.onboarding.repository;

import com.viniciostorres.RHFast.onboarding.model.DocumentoExigido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoExigidoRepository extends JpaRepository<DocumentoExigido, Long> {
    List<DocumentoExigido> findByProcessoAdmissaoId(Long processoAdmissaoId);
}