package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
public class SubmissaoTeste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teste_id", nullable = false)
    @JsonIgnore
    private Teste teste;

    @ManyToOne
    @JoinColumn(name = "candidato_id", nullable = false)
    private Candidato candidato;

    @Column(nullable = false)
    private LocalDateTime dataSubmissao;

    private Double pontuacao;

    @OneToMany(mappedBy = "submissaoTeste", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaSubmetida> respostas;

    @PrePersist
    public void prePersist() {
        dataSubmissao = LocalDateTime.now();
    }
}
