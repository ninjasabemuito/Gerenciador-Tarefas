const apiUrl = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

if (!token) window.location.href = 'login.html';

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadTasks();
    const taskForm = document.getElementById('taskForm');
    if (taskForm) taskForm.onsubmit = createTask;
});

async function loadProfile() {
    try {
        const res = await fetch(`${apiUrl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = await res.json();
        document.getElementById('profileName').innerText = user.name;
        
        document.getElementById('profileActions').innerHTML = `
            <button type="button" onclick="logout()" class="btn-logout">Sair</button>
            <button type="button" onclick="deleteUserAccount()" class="btn-delete-user">Excluir Conta</button>
        `;
    } catch (err) {
        console.error(err);
    }
}

async function loadTasks() {
    try {
        const res = await fetch(`${apiUrl}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const tasks = await res.json();
        const container = document.getElementById('userPosts');

        container.innerHTML = tasks.length === 0
            ? '<p>Nenhuma tarefa encontrada.</p>'
            : '';

        tasks.forEach(task => {
            const isDone = task.concluida === true || task.concluida === 1;

            const card = document.createElement('div');
            card.className = `post-card ${isDone ? 'completed' : ''}`;

            card.innerHTML = `
                <div class="task-content">
                    <input
                        type="checkbox"
                        ${isDone ? 'checked' : ''}
                        onchange="toggleTask(${task.id}, this.checked)"
                    >
                    <div class="task-text">
                        <h3>${task.titulo}</h3>
                        <p class="task-desc">${task.descricao || ''}</p>
                    </div>
                </div>
                <button type="button" class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
    }
}

async function toggleTask(id, checked) {
    try {
        const res = await fetch(`${apiUrl}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ concluida: checked })
        });

        if (res.ok) {
            loadTasks();
        }
    } catch (err) {
        console.error(err);
    }
}

async function createTask(e) {
    e.preventDefault();

    const titulo = document.getElementById('taskTitle').value;
    const descricao = document.getElementById('taskDescription').value;

    const res = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ titulo, descricao })
    });

    if (res.ok) {
        document.getElementById('taskForm').reset();
        loadTasks();
    }
}

async function deleteTask(id) {
    if (!confirm('Excluir tarefa?')) return;

    await fetch(`${apiUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });

    loadTasks();
}

async function deleteUserAccount() {
    if (confirm("⚠️ Excluir sua conta permanentemente?")) {
        await fetch(`${apiUrl}/users/me`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        logout();
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
