function logout() {
    localStorage.removeItem('candidatoId');
    localStorage.removeItem('recrutadorId');
    window.location.href = 'index.html';
}
