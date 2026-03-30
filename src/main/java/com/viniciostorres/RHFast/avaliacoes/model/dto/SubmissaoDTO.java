package com.viniciostorres.RHFast.avaliacoes.model.dto;

import java.util.List;

public class SubmissaoDTO {

    private Long testeId;
    private Long candidatoId;
    private List<RespostaDTO> respostas;

    // Getters e Setters

    public Long getTesteId() {
        return testeId;
    }

    public void setTesteId(Long testeId) {
        this.testeId = testeId;
    }

    public Long getCandidatoId() {
        return candidatoId;
    }

    public void setCandidatoId(Long candidatoId) {
        this.candidatoId = candidatoId;
    }

    public List<RespostaDTO> getRespostas() {
        return respostas;
    }

    public void setRespostas(List<RespostaDTO> respostas) {
        this.respostas = respostas;
    }

    // Inner class for answers
    public static class RespostaDTO {
        private Long perguntaId;
        private Object resposta; // Can be String or List<Integer>

        public Long getPerguntaId() {
            return perguntaId;
        }

        public void setPerguntaId(Long perguntaId) {
            this.perguntaId = perguntaId;
        }

        public Object getResposta() {
            return resposta;
        }

        public void setResposta(Object resposta) {
            this.resposta = resposta;
        }
    }
}