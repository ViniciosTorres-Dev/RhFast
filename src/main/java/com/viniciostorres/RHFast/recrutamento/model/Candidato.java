package com.viniciostorres.RHFast.recrutamento.model;

import com.viniciostorres.RHFast.recrutamento.model.enums.Situacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotNull
    @Enumerated(EnumType.STRING)
    private Situacao situacao;

    @CPF(message = "CPF inválido")
    @NotBlank
    @Column(unique = true)
    private String cpf;

    @NotBlank
    private String cep;

    @NotBlank
    private String estado;

    @NotBlank
    private String cidade;

    @NotBlank
    private String logradouro;

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
    }
}