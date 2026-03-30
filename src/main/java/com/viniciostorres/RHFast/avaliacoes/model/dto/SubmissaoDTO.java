package com.viniciostorres.RHFast.avaliacoes.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Data
public class SubmissaoDTO {

    private Long testeId;
    private Long candidatoId;
    private List<RespostaDTO> respostas;

    // Inner class for answers
    @Data
    public static class RespostaDTO {
        private Long perguntaId;
        private Object resposta; // Can be String or List<Integer>
    }
}