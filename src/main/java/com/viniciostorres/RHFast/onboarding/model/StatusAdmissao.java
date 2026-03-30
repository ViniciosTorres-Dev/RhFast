package com.viniciostorres.RHFast.onboarding.model;

public enum StatusAdmissao {
    AGUARDANDO_CANDIDATO, // Recrutador enviou as instruções, aguardando o candidato enviar tudo
    EM_ANALISE,           // Candidato enviou, recrutador precisa validar
    CONCLUIDO,            // Admissão finalizada com sucesso
    CANCELADO             // Processo cancelado
}
