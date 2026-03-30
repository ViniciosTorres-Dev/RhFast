package com.viniciostorres.RHFast.onboarding.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class ProcessoAdmissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vaga_id", nullable = false)
    @JsonIgnoreProperties({"candidaturas", "testes"}) // Evita loop na vaga
    private Vaga vaga;

    @ManyToOne
    @JoinColumn(name = "candidato_id", nullable = false)
    @JsonIgnoreProperties({"curriculos", "senha", "candidaturas"}) // Evita dados sensíveis ou loops no candidato
    private Candidato candidato;

    private String instrucoesGerais;

    @Enumerated(EnumType.STRING)
    private StatusAdmissao status = StatusAdmissao.AGUARDANDO_CANDIDATO;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    @OneToMany(mappedBy = "processoAdmissao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("processoAdmissao")
    private List<DocumentoExigido> documentosExigidos;

    @OneToMany(mappedBy = "processoAdmissao", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("processoAdmissao")
    private List<AnexoInstrucao> anexosInstrucoes;

}
