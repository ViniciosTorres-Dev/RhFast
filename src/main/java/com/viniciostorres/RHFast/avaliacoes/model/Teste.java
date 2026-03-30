package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class Teste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String tipo;
    private String descricao;

    @ManyToMany(mappedBy = "testes", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Vaga> vagas;

    @OneToMany(mappedBy = "teste", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("teste")
    private List<Pergunta> perguntas;
}
