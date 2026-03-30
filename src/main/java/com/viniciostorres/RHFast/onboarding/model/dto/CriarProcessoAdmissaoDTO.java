package com.viniciostorres.RHFast.onboarding.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CriarProcessoAdmissaoDTO {
    private Long vagaId;
    private Long candidatoId;
    private String instrucoesGerais;
    private List<DocumentoDTO> documentosExigidos;
    // Anexos serão enviados via MultipartFile

    @Getter
    @Setter
    public static class DocumentoDTO {
        private String nomeDocumento;
        private String formatoEsperado;
    }
}