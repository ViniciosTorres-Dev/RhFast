package com.viniciostorres.RHFast.user.service;

import com.viniciostorres.RHFast.recrutamento.repository.CandidatoRepository;
import com.viniciostorres.RHFast.recrutamento.repository.RecrutadorRepository;
import com.viniciostorres.RHFast.user.model.dto.UserSearchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UserService {

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private RecrutadorRepository recrutadorRepository;

    public List<UserSearchDTO> searchUsers(String query) {
        List<UserSearchDTO> candidatos = candidatoRepository.searchByNome(query).stream()
                .map(c -> new UserSearchDTO(c.getId(), c.getNome() + " " + c.getSobrenome(), "CANDIDATO", null))
                .collect(Collectors.toList());

        List<UserSearchDTO> recrutadores = recrutadorRepository.searchByNomeOrEmpresa(query).stream()
                .map(r -> new UserSearchDTO(r.getId(), r.getNome() + " " + r.getSobrenome(), "RECRUTADOR", r.getEmpresa() != null ? r.getEmpresa().getNome() : null))
                .collect(Collectors.toList());

        return Stream.concat(candidatos.stream(), recrutadores.stream())
                .collect(Collectors.toList());
    }
}