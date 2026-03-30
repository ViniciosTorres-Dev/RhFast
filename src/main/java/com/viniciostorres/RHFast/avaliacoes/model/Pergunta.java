package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

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

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }
    public String getTipoResposta() { return tipoResposta; }
    public void setTipoResposta(String tipoResposta) { this.tipoResposta = tipoResposta; }
    public List<String> getOpcoesResposta() { return opcoesResposta; }
    public void setOpcoesResposta(List<String> opcoesResposta) { this.opcoesResposta = opcoesResposta; }
    public Teste getTeste() { return teste; }
    public void setTeste(Teste teste) { this.teste = teste; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public List<Integer> getRespostasCorretas() { return respostasCorretas; }
    public void setRespostasCorretas(List<Integer> respostasCorretas) { this.respostasCorretas = respostasCorretas; }
    public String getRespostaCorreta() { return respostaCorreta; }
    public void setRespostaCorreta(String respostaCorreta) { this.respostaCorreta = respostaCorreta; }
}
