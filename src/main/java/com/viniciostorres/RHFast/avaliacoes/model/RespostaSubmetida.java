package com.viniciostorres.RHFast.avaliacoes.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SubmissaoTeste getSubmissaoTeste() { return submissaoTeste; }
    public void setSubmissaoTeste(SubmissaoTeste submissaoTeste) { this.submissaoTeste = submissaoTeste; }
    public Pergunta getPergunta() { return pergunta; }
    public void setPergunta(Pergunta pergunta) { this.pergunta = pergunta; }
    public String getResposta() { return resposta; }
    public void setResposta(String resposta) { this.resposta = resposta; }
}
