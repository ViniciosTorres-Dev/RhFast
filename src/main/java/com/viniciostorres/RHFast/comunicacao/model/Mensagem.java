package com.viniciostorres.RHFast.comunicacao.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long remetenteId;
    private String remetenteTipo; // "RECRUTADOR" ou "CANDIDATO"

    private Long destinatarioId;
    private String destinatarioTipo; // "RECRUTADOR" ou "CANDIDATO"

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    private LocalDateTime dataEnvio;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean lida = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean apagadaParaRemetente = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean apagadaParaDestinatario = false;

    public Mensagem() {
        this.dataEnvio = LocalDateTime.now();
    }
}