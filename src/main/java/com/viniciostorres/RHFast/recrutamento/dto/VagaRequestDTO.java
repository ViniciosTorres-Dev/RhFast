package com.viniciostorres.RHFast.recrutamento.dto;

import com.viniciostorres.RHFast.avaliacoes.model.Teste;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class VagaRequestDTO {
    // Dados da Vaga
    private String nomeVaga;
    private String setorVaga;
    private String pais;
    private String estado;
    private String cidade;
    private String cep;
    private NivelExperiencia nivelExperiencia;
    private Modalidade modalidade;
    private Double salario;
    private String descricaoVaga;
    private Long empresaId;
    private Long recrutadorId;

    // Testes
    private List<Long> testesIds; // IDs de testes existentes
    private List<Teste> novosTestes; // Objetos de testes novos a serem criados
}
