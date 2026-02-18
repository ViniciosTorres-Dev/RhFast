package com.viniciostorres.RHFast.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.br.CNPJ;

import java.util.List;

@Entity
@Table(name = "empresas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da empresa é obrigatório")
    private String nome;

    @NotBlank
    @CNPJ(message = "CNPJ inválido")
    @Column(unique = true)
    private String cnpj;

    @NotBlank
    private String cep;

    @NotBlank
    private String estado;

    @NotBlank
    private String cidade;

    @NotBlank
    private String logradouro;

    @PrePersist
    @PreUpdate
    private void limparFormatacao() {
        if (this.cnpj != null) {
            this.cnpj = this.cnpj.replaceAll("\\D", "");
        }
        if (this.cep != null) {
            this.cep = this.cep.replaceAll("\\D", "");
        }
    }
}
