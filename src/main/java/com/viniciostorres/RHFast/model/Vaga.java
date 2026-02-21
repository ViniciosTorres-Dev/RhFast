package com.viniciostorres.RHFast.model;

import com.viniciostorres.RHFast.model.enums.Modalidade;
import com.viniciostorres.RHFast.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.model.enums.StatusVaga;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "vagas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nomeVaga;
    @NotBlank
    private String setorVaga;
    @NotBlank
    private String pais;
    @NotBlank
    private String estado;
    @NotBlank
    private String cidade;
    @NotBlank
    private String cep;
    
    private LocalDate dataPostagem;
    
    @Enumerated(EnumType.STRING)
    private StatusVaga status;

    @NotNull
    @Enumerated(EnumType.STRING)
    private NivelExperiencia nivelExperiencia;
    
    @ManyToOne
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Modalidade modalidade;
    @NotNull
    private Double salario;
    @NotBlank
    private String descricaoVaga;

    @ManyToOne
    @JoinColumn(name = "recrutador_id")
    private Recrutador recrutador;

    @OneToMany(mappedBy = "vaga", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidatura> candidaturas;

    @PrePersist
    private void preCreate() {
        if (this.status == null) {
            this.status = StatusVaga.ABERTA;
        }

        if (this.dataPostagem == null) {
            this.dataPostagem = LocalDate.now();
        }

        limparCep();
    }

    @PreUpdate
    private void preUpdate() {
        limparCep();
    }

    private void limparCep() {
        if (this.cep != null) {
            this.cep = this.cep.replaceAll("\\D", "");
        }
    }
}
