package com.viniciostorres.RHFast.comunicacao.repository;

import com.viniciostorres.RHFast.comunicacao.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Long> {

    @Query("SELECT m FROM Mensagem m WHERE " +
            "((m.remetenteId = :usuario1Id AND m.remetenteTipo = :usuario1Tipo AND m.destinatarioId = :usuario2Id AND m.destinatarioTipo = :usuario2Tipo AND m.apagadaParaRemetente = false) OR " +
            "(m.remetenteId = :usuario2Id AND m.remetenteTipo = :usuario2Tipo AND m.destinatarioId = :usuario1Id AND m.destinatarioTipo = :usuario1Tipo AND m.apagadaParaDestinatario = false)) " +
            "ORDER BY m.dataEnvio ASC")
    List<Mensagem> findConversa(@Param("usuario1Id") Long usuario1Id, @Param("usuario1Tipo") String usuario1Tipo, @Param("usuario2Id") Long usuario2Id, @Param("usuario2Tipo") String usuario2Tipo);

    @Query("SELECT DISTINCT m.destinatarioId, m.destinatarioTipo FROM Mensagem m WHERE m.remetenteId = :usuarioId AND m.remetenteTipo = :usuarioTipo AND m.apagadaParaRemetente = false")
    List<Object[]> findContatosEnviados(@Param("usuarioId") Long usuarioId, @Param("usuarioTipo") String usuarioTipo);

    @Query("SELECT DISTINCT m.remetenteId, m.remetenteTipo FROM Mensagem m WHERE m.destinatarioId = :usuarioId AND m.destinatarioTipo = :usuarioTipo AND m.apagadaParaDestinatario = false")
    List<Object[]> findContatosRecebidos(@Param("usuarioId") Long usuarioId, @Param("usuarioTipo") String usuarioTipo);

    long countByDestinatarioIdAndDestinatarioTipoAndLidaIsFalseAndRemetenteIdAndRemetenteTipoAndApagadaParaDestinatarioIsFalse(
            Long destinatarioId, String destinatarioTipo, Long remetenteId, String remetenteTipo);

    @Modifying
    @Transactional
    @Query("UPDATE Mensagem m SET m.lida = true WHERE m.remetenteId = :remetenteId AND m.remetenteTipo = :remetenteTipo AND m.destinatarioId = :destinatarioId AND m.destinatarioTipo = :destinatarioTipo AND m.lida = false AND m.apagadaParaDestinatario = false")
    void marcarComoLidas(@Param("remetenteId") Long remetenteId, @Param("remetenteTipo") String remetenteTipo,
                         @Param("destinatarioId") Long destinatarioId, @Param("destinatarioTipo") String destinatarioTipo);

    // Novos métodos para apagar conversa inteira
    @Modifying
    @Transactional
    @Query("UPDATE Mensagem m SET m.apagadaParaRemetente = true WHERE m.remetenteId = :usuarioId AND m.remetenteTipo = :usuarioTipo AND m.destinatarioId = :outroId AND m.destinatarioTipo = :outroTipo")
    void apagarConversaComoRemetente(@Param("usuarioId") Long usuarioId, @Param("usuarioTipo") String usuarioTipo, @Param("outroId") Long outroId, @Param("outroTipo") String outroTipo);

    @Modifying
    @Transactional
    @Query("UPDATE Mensagem m SET m.apagadaParaDestinatario = true WHERE m.destinatarioId = :usuarioId AND m.destinatarioTipo = :usuarioTipo AND m.remetenteId = :outroId AND m.remetenteTipo = :outroTipo")
    void apagarConversaComoDestinatario(@Param("usuarioId") Long usuarioId, @Param("usuarioTipo") String usuarioTipo, @Param("outroId") Long outroId, @Param("outroTipo") String outroTipo);
}