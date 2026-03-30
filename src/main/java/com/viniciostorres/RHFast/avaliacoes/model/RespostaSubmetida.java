package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class RespostaSubmetida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "submissao_teste_id", nullable = false)
    @JsonIgnore
    private SubmissaoTeste submissaoTeste;

    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private Pergunta pergunta;

    @Column(columnDefinition = "TEXT")
    private String resposta;
}
