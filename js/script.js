

document.getElementById('buscarDados').addEventListener('click', async function () {
    try {
        const apiResponse = await fetch('https://randomuser.me/api/');
        const data = await apiResponse.json();
        const user = data.results[0];

        document.getElementById('name').value = `${user.name.first} ${user.name.last}`;
        document.getElementById('email').value = user.email;
        document.getElementById('date').value = user.dob.date.split('T')[0];
        document.getElementById('age').value = user.dob.age;

        const photoUrl = user.picture.large;
        const userPhoto = document.getElementById('userPhoto');
        userPhoto.src = photoUrl;
        userPhoto.style.display = 'block';

    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }

    document.getElementById('message').textContent = '';
});

document.getElementById('btnReset').addEventListener('click', function () {
    document.getElementById('userPhoto').src = '';
});

document.getElementById('BtnCadastrar').addEventListener('click', async function () {

    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dataNascimento = document.getElementById('date').value;
    const idade = parseInt(document.getElementById('age').value);
    const photoUrl = document.getElementById('userPhoto').src;

    if (!nome || !email || !dataNascimento || !idade || !photoUrl) {
        console.error('Erro: Todos os campos precisam ser preenchidos.');
        return;
    }

    const dotLoading = document.getElementById('dot-loading');

    if (dotLoading.style.display = 'none') {
        dotLoading.style.display = 'flex';
    }     

    const userData = {
        name: nome,
        email: email,
        age: idade,
        dateOfBirth: dataNascimento,
        photo: photoUrl
    };

    try {
        const response = await fetch('https://registro-usuarios-w3k8.onrender.com/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        await document.getElementById('userForm').reset();
        document.getElementById('userPhoto').style.display = 'none';
        document.getElementById('message').textContent = 'Usuário Salvo !';

    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
    }

    dotLoading.textContent = '';
});

async function fetchUsers() {
    try {
        const response = await fetch('https://registro-usuarios-w3k8.onrender.com/usuarios');

        

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

async function renderUsers() {
    const userList = document.getElementById('userList');
    const loadingIndicator = document.createElement('div');

    loadingIndicator.textContent = 'Carregando usuários...';
    loadingIndicator.classList.add('loading');
    
    userList.innerHTML = '';
    userList.appendChild(loadingIndicator);

    try {
    
        const users = await fetchUsers();
        
        userList.innerHTML = '';

        if (users && users.length > 0) {
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('containerDate');
                userItem.id = `user-${user.id}`;
                userItem.innerHTML = ` 
                    <img id="imgsmall" src="${user.photo}" 
                    alt="Foto de ${user.name}" width="25" height="25" />
                    <span>Nome:</span> ${user.name}, 
                    <span>Email:</span> ${user.email}
                    <button class="btnRemover" onclick="deleteUser('${user.id}')">Excluir</button>`;
                userList.appendChild(userItem);
            });
        } else {
            userList.textContent = 'Nenhum usuário encontrado.';
        }
    } catch (error) {
        userList.textContent = 'Erro ao carregar usuários.';
        console.error(error);
    }
}

document.getElementById('getUsersdate').addEventListener('click', renderUsers);

async function recolherItens() {

    const listaUsuarios = document.getElementById('userList');
    const btnAlterarNome = document.getElementById('togglebtn');

    if (listaUsuarios.style.display === 'none') {
        listaUsuarios.style.display = 'flex';
        btnAlterarNome.textContent = 'Ocultar';
    } else {
        listaUsuarios.style.display = 'none';
        btnAlterarNome.textContent = 'Mostrar';
    }
}
document.querySelector('#togglebtn').addEventListener('click', recolherItens);


async function deleteUser(id) {

    try {
        const response = await fetch(`https://registro-usuarios-w3k8.onrender.com/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const userElement = document.getElementById(`user-${id}`);
        if (userElement) {
            userElement.remove();
            alert('Usuário deletado com sucesso!');
        } else {
            console.error('Elemento não encontrado no DOM para remoção');
        }
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário');
    }
}


