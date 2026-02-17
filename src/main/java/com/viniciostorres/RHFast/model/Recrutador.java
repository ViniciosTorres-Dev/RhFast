package com.viniciostorres.RHFast.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.validator.constraints.br.CNPJ;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Entity
@Table(name = "recrutadores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recrutador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank
    private String sobrenome;

    @CPF(message = "CPF inválido")
    @NotBlank
    @Column(unique = true)
    private String cpf;

    @NotBlank
    private String cargo;

    @Email(message = "Digite um E-mail válido")
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(unique = true)
    private String numeroTelefone;

    @NotBlank
    @CNPJ(message = "CNPJ inválido")
    private String cnpj;

    @NotBlank
    private String empresa;

    @NotBlank
    private String cep;

    @NotBlank
    private String estado;

    @NotBlank
    private String cidade;

    @NotBlank
    private String logradouro;

    @NotBlank
    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
    private String senha;

    @PrePersist
    @PreUpdate
    private void limparFormatacao() {
        if (this.numeroTelefone != null) {
            this.numeroTelefone = this.numeroTelefone.replaceAll("\\D", "");
        }
        if (this.cpf != null) {
            this.cpf = this.cpf.replaceAll("\\D", "");
        }
        if (this.cep != null) {
            this.cep = this.cep.replaceAll("\\D", "");
        }
        if (this.cnpj != null) {
            this.cnpj = this.cnpj.replaceAll("\\D", "");
        }
    }
}