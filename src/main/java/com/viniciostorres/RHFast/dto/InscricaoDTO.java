package com.viniciostorres.RHFast.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InscricaoDTO {

    @NotNull(message = "O ID do candidato é obrigatório")
    private Long idCandidato;

    @NotNull(message = "O ID da vaga é obrigatório")
    private Long idVaga;
}