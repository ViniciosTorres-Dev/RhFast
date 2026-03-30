package com.viniciostorres.RHFast.onboarding.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DocumentoExigido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "processo_admissao_id", nullable = false)
    @JsonIgnoreProperties({"documentosExigidos", "anexosInstrucoes"})
    private ProcessoAdmissao processoAdmissao;

    private String nomeDocumento; // Ex: "Cópia do RG", "Comprovante de Residência"
    private String formatoEsperado; // Ex: "PDF", "PDF ou JPG"

    private String caminhoArquivoEnviado; // Preenchido quando o candidato faz upload

    @Enumerated(EnumType.STRING)
    private StatusDocumento status = StatusDocumento.PENDENTE;

    private String observacaoRecrutador; // Caso rejeite, o motivo.
}