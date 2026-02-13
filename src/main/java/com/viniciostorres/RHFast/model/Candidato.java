package com.viniciostorres.RHFast.model;

import com.viniciostorres.RHFast.model.enums.Situacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Entity
@Table(name = "candidatos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank
    private String sobrenome;

    @NotBlank
    private String pais;

    @NotBlank
    private String estado;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Situacao situacao;

    @CPF(message = "CPF inválido")
    @NotBlank
    @Column(unique = true)
    private String cpf;

    @NotBlank
    private String cidade;

    @NotBlank
    private String cep;

    @NotNull(message = "É necessária colocar sua data de nascimento")
    @Past(message = "Data de nascimento inválida")
    private LocalDate dataNascimento;

    @Email(message = "Digite um E-mail válido")
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(unique = true)
    private String numeroTelefone;
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
    }
}