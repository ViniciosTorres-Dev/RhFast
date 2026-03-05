package com.viniciostorres.RHFast.comunicacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query("SELECT m FROM Mensagem m WHERE " +
           "(m.remetenteId = :usuario1Id AND m.remetenteTipo = :usuario1Tipo AND m.destinatarioId = :usuario2Id AND m.destinatarioTipo = :usuario2Tipo) OR " +
           "(m.remetenteId = :usuario2Id AND m.remetenteTipo = :usuario2Tipo AND m.destinatarioId = :usuario1Id AND m.destinatarioTipo = :usuario1Tipo) " +
           "ORDER BY m.dataEnvio ASC")
    List<Mensagem> findConversa(Long usuario1Id, String usuario1Tipo, Long usuario2Id, String usuario2Tipo);

    @Query("SELECT DISTINCT m.destinatarioId, m.destinatarioTipo FROM Mensagem m WHERE m.remetenteId = :usuarioId AND m.remetenteTipo = :usuarioTipo")
    List<Object[]> findContatosEnviados(Long usuarioId, String usuarioTipo);

    @Query("SELECT DISTINCT m.remetenteId, m.remetenteTipo FROM Mensagem m WHERE m.destinatarioId = :usuarioId AND m.destinatarioTipo = :usuarioTipo")
    List<Object[]> findContatosRecebidos(Long usuarioId, String usuarioTipo);
}
