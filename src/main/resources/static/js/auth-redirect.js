(function() {
    const candidatoId = localStorage.getItem('candidatoId');
    const recrutadorId = localStorage.getItem('recrutadorId');

    if (candidatoId) {
        window.location.href = 'mainCandidato.html';
    } else if (recrutadorId) {
        window.location.href = 'mainRecrutador.html';
    }
})();
