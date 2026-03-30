package com.viniciostorres.RHFast.recrutamento.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "curriculos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curriculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String nomeCurriculo;

    @ManyToOne
    @JoinColumn(name = "candidato_id")
    @JsonIgnore // Evita loop infinito na serialização
    private Candidato candidato;

    private String urlCurriculo;
    private String tipoArquivo;
    @CreationTimestamp
    private LocalDateTime dataUpload;

    @PrePersist
    private void presalvarData() {
        if (this.dataUpload == null) {
            this.dataUpload = LocalDateTime.now();
        }
    }
}
