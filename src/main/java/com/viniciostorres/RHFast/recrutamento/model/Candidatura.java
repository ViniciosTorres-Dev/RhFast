package com.viniciostorres.RHFast.recrutamento.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.viniciostorres.RHFast.recrutamento.model.enums.StatusCandidatura;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidaturas", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidato_id", "vaga_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "candidato_id")
    private Candidato candidato;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "vaga_id")
    @JsonIgnore
    private Vaga vaga;

    @NotNull
    private LocalDateTime dataInscricao;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusCandidatura status;

    @PrePersist
    private void prePersist() {
        if (this.dataInscricao == null) {
            this.dataInscricao = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = StatusCandidatura.PENDENTE;
        }
    }
}