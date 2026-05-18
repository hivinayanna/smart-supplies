# Smart Supplies

Plataforma que conecta fornecedores a vendedores, facilitando o gerenciamento de produtos, pedidos e comunicação entre as partes.

### 🔗 Demo

Link de demonstração: http://projeto-web-1-xi.vercel.app

### 🛠 Tecnologias

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%2300A6FF.svg?style=for-the-badge&logo=vite&logoColor=white)

## Visão Geral

Monorepo com frontend em React (Vite) e backend em Django (REST API).

- Frontend: pasta `FrontEnd` (React + Vite)
- Backend: pasta `BackEnd` (Django)

## Funcionalidades Principais

- Cadastro e autenticação de usuários (fornecedores e vendedores)
- CRUD de produtos e gestão de estoque
- Listagem e busca de produtos
- Carrinho e finalização de pedidos
- Avaliações e comentários de produtos
- Notificações

## Estrutura do Projeto

```
README.md
FrontEnd/      # App React (Vite)
BackEnd/       # API Django
```

## Como rodar o projeto (Desenvolvimento)

Backend (Windows):

```powershell
cd BackEnd
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # opcional
python manage.py runserver
```

Frontend:

```bash
cd FrontEnd
npm install
npm run dev
```

## Testes

Backend (rápido):

```bash
cd BackEnd
python run_tests.py
# ou
pytest -q
```

## Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Niccofs">
        <img src="https://avatars.githubusercontent.com/u/106767229?v=4" width="120" alt="Nicolas Ferreira" style="border-radius: 50%;">
      </a>
      <p><strong>Nicolas Ferreira</strong></p>
      <a href="https://github.com/Niccofs">Perfil no GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/rudhaesmeraldo">
        <img src="https://avatars.githubusercontent.com/u/100231973?v=4" width="120" alt="Rudha Esmeraldo" style="border-radius: 50%;">
      </a>
      <p><strong>Rudha Esmeraldo</strong></p>
      <a href="https://github.com/rudhaesmeraldo">Perfil no GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/JohnOliverz">
        <img src="https://avatars.githubusercontent.com/u/171964865?v=4" width="120" alt="Jhonatan Sousa" style="border-radius: 50%;">
      </a>
      <p><strong>Jhonatan Sousa</strong></p>
      <a href="https://github.com/JohnOliverz">Perfil no GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/JeufoDev">
        <img src="https://avatars.githubusercontent.com/u/117694456?v=4" width="120" alt="Jefferson Lucas" style="border-radius: 50%;">
      </a>
      <p><strong>Jefferson Lucas</strong></p>
      <a href="https://github.com/JeufoDev">Perfil no GitHub</a>
    </td>
    <td align="center">
      <a href="https://github.com/hivinayanna">
        <img src="https://avatars.githubusercontent.com/u/90151294?v=4" width="120" alt="Hívina Yanna" style="border-radius: 50%;">
      </a>
      <p><strong>Hívina Yanna</strong></p>
      <a href="https://github.com/hivinayanna">Perfil no GitHub</a>
    </td>
  </tr>
</table>

## Contato

Para dúvidas ou contribuições, abra uma issue ou entre em contato pelos perfis dos contribuidores.




