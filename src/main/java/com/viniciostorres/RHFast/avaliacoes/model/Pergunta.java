package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Pergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;
    private String tipoResposta;
    private String filePath;

    @ElementCollection
    private List<String> opcoesResposta;

    @ElementCollection
    private List<Integer> respostasCorretas;

    private String respostaCorreta;

    @ManyToOne
    @JoinColumn(name = "teste_id")
    @JsonIgnoreProperties("perguntas")
    private Teste teste;
}
