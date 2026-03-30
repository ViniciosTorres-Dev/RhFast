package com.viniciostorres.RHFast.onboarding.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class AnexoInstrucao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "processo_admissao_id", nullable = false)
    @JsonIgnoreProperties({"documentosExigidos", "anexosInstrucoes"})
    private ProcessoAdmissao processoAdmissao;

    private String tituloGeral; // Ex: "Manual de Integração" ou "Guia do Exame Médico"
    private String nomeArquivo;
    private String caminhoArquivo; // Caminho para download
}