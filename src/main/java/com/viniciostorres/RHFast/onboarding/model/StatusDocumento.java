package com.viniciostorres.RHFast.onboarding.model;

public enum StatusDocumento {
    PENDENTE,   // Candidato ainda não enviou
    ENVIADO,    // Candidato enviou, aguardando validação
    APROVADO,   // Recrutador verificou e está OK
    REJEITADO   // Documento inválido (ex: foto borrada), candidato precisa reenviar
}
