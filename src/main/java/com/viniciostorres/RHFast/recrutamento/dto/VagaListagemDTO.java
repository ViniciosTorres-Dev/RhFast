package com.viniciostorres.RHFast.recrutamento.dto;

import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.recrutamento.model.enums.StatusVaga;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class VagaListagemDTO {
    private Long id;
    private String nomeVaga;
    private String setorVaga;
    private String cidade;
    private String estado;
    private StatusVaga status;
    private NivelExperiencia nivelExperiencia;
    private Modalidade modalidade;
    private Double salario;
    private LocalDate dataPostagem;
    private int quantidadeCandidatos;

    public VagaListagemDTO(Vaga vaga) {
        this.id = vaga.getId();
        this.nomeVaga = vaga.getNomeVaga();
        this.setorVaga = vaga.getSetorVaga();
        this.cidade = vaga.getCidade();
        this.estado = vaga.getEstado();
        this.status = vaga.getStatus();
        this.nivelExperiencia = vaga.getNivelExperiencia();
        this.modalidade = vaga.getModalidade();
        this.salario = vaga.getSalario();
        this.dataPostagem = vaga.getDataPostagem();
        this.quantidadeCandidatos = vaga.getCandidaturas() != null ? vaga.getCandidaturas().size() : 0;
    }
}
