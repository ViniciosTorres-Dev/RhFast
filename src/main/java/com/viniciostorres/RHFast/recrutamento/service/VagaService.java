package com.viniciostorres.RHFast.recrutamento.service;

import com.viniciostorres.RHFast.avaliacoes.model.Teste;
import com.viniciostorres.RHFast.avaliacoes.repository.TesteRepository;
import com.viniciostorres.RHFast.avaliacoes.service.TesteService;
import com.viniciostorres.RHFast.recrutamento.dto.DashboardRecrutadorDTO;
import com.viniciostorres.RHFast.recrutamento.dto.VagaRequestDTO;
import com.viniciostorres.RHFast.recrutamento.model.Candidatura;
import com.viniciostorres.RHFast.recrutamento.model.Empresa;
import com.viniciostorres.RHFast.recrutamento.model.Recrutador;
import com.viniciostorres.RHFast.recrutamento.model.Vaga;
import com.viniciostorres.RHFast.recrutamento.model.enums.Modalidade;
import com.viniciostorres.RHFast.recrutamento.model.enums.NivelExperiencia;
import com.viniciostorres.RHFast.recrutamento.model.enums.StatusCandidatura;
import com.viniciostorres.RHFast.recrutamento.model.enums.StatusVaga;
import com.viniciostorres.RHFast.recrutamento.repository.CandidaturaRepository;
import com.viniciostorres.RHFast.recrutamento.repository.EmpresaRepository;
import com.viniciostorres.RHFast.recrutamento.repository.RecrutadorRepository;
import com.viniciostorres.RHFast.recrutamento.repository.VagaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class VagaService {

    private final VagaRepository vagaRepository;
    private final TesteRepository testeRepository;
    private final TesteService testeService;
    private final EmpresaRepository empresaRepository;
    private final RecrutadorRepository recrutadorRepository;
    private final CandidaturaRepository candidaturaRepository;

    public List<Vaga> findVagasDisponiveisParaCandidato(Long candidatoId) {
        return vagaRepository.findVagasNaoInscritas(candidatoId);
    }

    @Transactional
    public Vaga updateStatus(Long id, StatusVaga status) {
        Vaga vaga = vagaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        vaga.setStatus(status);
        return vagaRepository.save(vaga);
    }

    @Transactional(readOnly = true)
    public DashboardRecrutadorDTO getDashboardData(Long recrutadorId) {
        DashboardRecrutadorDTO dto = new DashboardRecrutadorDTO();

        List<Vaga> vagasDoRecrutador = vagaRepository.findByRecrutadorId(recrutadorId);
        List<Candidatura> candidaturasDoRecrutador = candidaturaRepository.findByRecrutadorId(recrutadorId);

        LocalDate hoje = LocalDate.now();

        dto.setTotalVagasAbertas(vagasDoRecrutador.stream().filter(v -> "ABERTA".equals(v.getStatus().toString())).count());
        dto.setVagasEncerradas(vagasDoRecrutador.stream().filter(v -> "ENCERRADA".equals(v.getStatus().toString())).count());

        dto.setTotalCandidatosInscritos(candidaturasDoRecrutador.size());
        dto.setCandidaturasHoje(candidaturasDoRecrutador.stream().filter(c -> c.getDataInscricao().toLocalDate().isEqual(hoje)).count());
        dto.setCandidatosEmAnalise(candidaturasDoRecrutador.stream().filter(c -> c.getStatus() == StatusCandidatura.PENDENTE || c.getStatus() == StatusCandidatura.ANALISE_RH).count());
        dto.setCandidatosAprovados(candidaturasDoRecrutador.stream().filter(c -> c.getStatus() == StatusCandidatura.APROVADO).count());
        dto.setCandidatosReprovados(candidaturasDoRecrutador.stream().filter(c -> c.getStatus() == StatusCandidatura.REPROVADO).count());

        Map<String, Long> candidaturasPorMes = IntStream.rangeClosed(1, 12)
                .mapToObj(month -> Month.of(month).name())
                .collect(Collectors.toMap(
                        monthName -> monthName.substring(0, 3),
                        monthName -> candidaturasDoRecrutador.stream()
                                .filter(c -> c.getDataInscricao().getMonth() == Month.valueOf(monthName))
                                .count(),
                        (v1, v2) -> v1,
                        java.util.LinkedHashMap::new
                ));
        dto.setCandidaturasPorMes(candidaturasPorMes);

        List<Long> vagaIds = vagasDoRecrutador.stream().map(Vaga::getId).collect(Collectors.toList());
        dto.setTotalTestesConcluidos(testeService.contarTestesConcluidosPorVagas(vagaIds));

        return dto;
    }

    public List<Vaga> findAll() {
        return vagaRepository.findAll();
    }

    public Optional<Vaga> findById(Long id) {
        return vagaRepository.findById(id);
    }

    public List<Vaga> findByRecrutadorId(Long recrutadorId) {
        return vagaRepository.findByRecrutadorId(recrutadorId);
    }

    public List<Vaga> findByEmpresaId(Long empresaId) {
        return vagaRepository.findByEmpresaId(empresaId);
    }

    public void delete(Long id) {
        vagaRepository.deleteById(id);
    }

    public List<Vaga> buscarVagas(String termo, String localizacao, NivelExperiencia nivel, Modalidade modalidade) {
        return vagaRepository.findAll().stream()
                .filter(v -> termo == null || v.getNomeVaga().toLowerCase().contains(termo.toLowerCase()))
                .filter(v -> localizacao == null || v.getCidade().toLowerCase().contains(localizacao.toLowerCase()))
                .filter(v -> nivel == null || v.getNivelExperiencia() == nivel)
                .filter(v -> modalidade == null || v.getModalidade() == modalidade)
                .collect(Collectors.toList());
    }

    @Transactional
    public Vaga save(VagaRequestDTO dto) {
        Empresa empresa = empresaRepository.findById(dto.getEmpresaId()).orElseThrow(() -> new RuntimeException("Empresa não encontrada"));
        Recrutador recrutador = recrutadorRepository.findById(dto.getRecrutadorId()).orElseThrow(() -> new RuntimeException("Recrutador não encontrado"));

        List<Teste> testes = new ArrayList<>();
        if (dto.getTestesIds() != null) {
            testes.addAll(testeRepository.findAllById(dto.getTestesIds()));
        }
        if (dto.getNovosTestes() != null) {
            dto.getNovosTestes().forEach(novoTeste -> testes.add(testeService.criarTeste(novoTeste, null)));
        }

        Vaga vaga = new Vaga();
        vaga.setNomeVaga(dto.getNomeVaga());
        vaga.setSetorVaga(dto.getSetorVaga());
        vaga.setPais(dto.getPais());
        vaga.setEstado(dto.getEstado());
        vaga.setCidade(dto.getCidade());
        vaga.setCep(dto.getCep());
        vaga.setNivelExperiencia(dto.getNivelExperiencia());
        vaga.setModalidade(dto.getModalidade());
        vaga.setSalario(dto.getSalario());
        vaga.setDescricaoVaga(dto.getDescricaoVaga());
        vaga.setEmpresa(empresa);
        vaga.setRecrutador(recrutador);
        vaga.setTestes(testes);

        return vagaRepository.save(vaga);
    }

    @Transactional
    public Vaga update(Long id, VagaRequestDTO dto) {
        Vaga vagaExistente = vagaRepository.findById(id).orElseThrow(() -> new RuntimeException("Vaga não encontrada"));
        List<Teste> testes = new ArrayList<>();
        if (dto.getTestesIds() != null) {
            testes.addAll(testeRepository.findAllById(dto.getTestesIds()));
        }
        if (dto.getNovosTestes() != null) {
            dto.getNovosTestes().forEach(novoTeste -> testes.add(testeService.criarTeste(novoTeste, id)));
        }

        vagaExistente.setNomeVaga(dto.getNomeVaga());
        vagaExistente.setSetorVaga(dto.getSetorVaga());
        vagaExistente.setPais(dto.getPais());
        vagaExistente.setEstado(dto.getEstado());
        vagaExistente.setCidade(dto.getCidade());
        vagaExistente.setCep(dto.getCep());
        vagaExistente.setNivelExperiencia(dto.getNivelExperiencia());
        vagaExistente.setModalidade(dto.getModalidade());
        vagaExistente.setSalario(dto.getSalario());
        vagaExistente.setDescricaoVaga(dto.getDescricaoVaga());
        vagaExistente.setTestes(testes);

        return vagaRepository.save(vagaExistente);
    }
}
