package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.viniciostorres.RHFast.recrutamento.model.Candidato;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Teste getTeste() { return teste; }
    public void setTeste(Teste teste) { this.teste = teste; }
    public Candidato getCandidato() { return candidato; }
    public void setCandidato(Candidato candidato) { this.candidato = candidato; }
    public LocalDateTime getDataSubmissao() { return dataSubmissao; }
    public void setDataSubmissao(LocalDateTime dataSubmissao) { this.dataSubmissao = dataSubmissao; }
    public Double getPontuacao() { return pontuacao; }
    public void setPontuacao(Double pontuacao) { this.pontuacao = pontuacao; }
    public List<RespostaSubmetida> getRespostas() { return respostas; }
    public void setRespostas(List<RespostaSubmetida> respostas) { this.respostas = respostas; }
}
