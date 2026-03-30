package com.viniciostorres.RHFast.recrutamento.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class DashboardRecrutadorDTO {
    private long totalVagasAbertas;
    private long vagasEncerradas;
    private long totalCandidatosInscritos;
    private long candidaturasHoje;
    private long candidatosEmAnalise;
    private long candidatosAprovados;
    private long candidatosReprovados;
    private long totalTestesConcluidos;
    private Map<String, Long> candidaturasPorMes; // Novo campo para o gráfico de linha
}
