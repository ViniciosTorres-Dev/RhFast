package com.viniciostorres.RHFast.recrutamento.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void enviarEmailBoasVindas(String destinatario, String nome) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinatario);
            message.setSubject("Bem-vindo ao RHFast!");
            message.setText("Olá " + nome + ",\n\nSeu cadastro foi realizado com sucesso!\n\nAtenciosamente,\nEquipe RHFast.");

            mailSender.send(message);
            System.out.println("E-mail enviado para: " + destinatario);
        } catch (Exception e) {
            System.err.println("Falha ao enviar email: " + e.getMessage());
        }
    }
}