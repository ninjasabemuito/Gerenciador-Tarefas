document.addEventListener('DOMContentLoaded', () => {
    // URL base da API (ajuste a porta se o seu servidor estiver em outra)
    const apiUrl = 'http://localhost:3000/api';

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- LÓGICA DE LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${apiUrl}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // SUCESSO: Salva o token no navegador
                    localStorage.setItem('token', data.token);
                    // Redireciona para o painel de tarefas
                    window.location.href = 'profile.html';
                } else {
                    // ERRO: Exibe mensagem do servidor (ex: Senha incorreta)
                    alert(data.message || 'Erro ao realizar login.');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.');
            }
        });
    }

    // --- LÓGICA DE REGISTRO (CADASTRO) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${apiUrl}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Cadastro realizado com sucesso! Agora faça seu login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Erro ao cadastrar usuário.');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Erro ao conectar com o servidor.');
            }
        });
    }
});