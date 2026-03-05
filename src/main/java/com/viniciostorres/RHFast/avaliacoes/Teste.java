package com.viniciostorres.RHFast.avaliacoes;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class Teste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String tipo; // TECNICO, COMPORTAMENTAL, LOGICA
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "vaga_id")
    private Vaga vaga;

    @OneToMany(mappedBy = "teste", cascade = CascadeType.ALL)
    private List<Pergunta> perguntas;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Vaga getVaga() {
        return vaga;
    }

    public void setVaga(Vaga vaga) {
        this.vaga = vaga;
    }

    public List<Pergunta> getPerguntas() {
        return perguntas;
    }

    public void setPerguntas(List<Pergunta> perguntas) {
        this.perguntas = perguntas;
    }
}
