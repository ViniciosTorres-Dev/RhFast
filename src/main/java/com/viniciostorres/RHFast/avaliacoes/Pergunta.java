package com.viniciostorres.RHFast.avaliacoes;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Pergunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;
    private String tipoResposta; // TEXTO, MULTIPLA_ESCOLHA

    @ElementCollection
    private List<String> opcoesResposta;

    @ManyToOne
    @JoinColumn(name = "teste_id")
    private Teste teste;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getTipoResposta() {
        return tipoResposta;
    }

    public void setTipoResposta(String tipoResposta) {
        this.tipoResposta = tipoResposta;
    }

    public List<String> getOpcoesResposta() {
        return opcoesResposta;
    }

    public void setOpcoesResposta(List<String> opcoesResposta) {
        this.opcoesResposta = opcoesResposta;
    }

    public Teste getTeste() {
        return teste;
    }

    public void setTeste(Teste teste) {
        this.teste = teste;
    }
}
