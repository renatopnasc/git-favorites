import { GitHubUser } from "./GitHubUser.js";

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class FavoritesUser {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    // JSON.parse() é um método para transformar um json em um objeto
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  // Para eu usar o await, eu preciso informar que é um método assincrono com a palavra reservada async. Com o await eu elimino o .then()
  async add(username) {
    try {
      // função find retorna um Object caso encontre ele dentro da lista, caso não encontre o item na lista ele irá retornar undefined
      const userExists = this.entries.find((entry) => entry.login === username);
      console.log(userExists);

      if (userExists) throw new Error("Usuário já cadastrado");

      const user = await GitHubUser.search(username);

      if (user.login === undefined) {
        throw new Error("User not found");
      }

      this.entries = [user, ...this.entries];

      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter((entry) => {
      return entry.login !== user.login;
    });

    this.entries = filteredEntries;

    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesUserView extends FavoritesUser {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector("table tbody");

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addUserBtn = this.root.querySelector(".search button");
    addUserBtn.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow(
        user.login,
        user.name,
        user.public_repos,
        user.followers
      );

      row.querySelector(".btn-delete").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOk) {
          this.delete(user);
        }
      };

      // O append está adicionando o elemento HTML criado com a DOM dentro do tbody
      this.tbody.append(row);
    });
  }

  createRow(user, name, repositories, followers) {
    const tr = document.createElement("tr");
    const data = `
    <td class="profile">
      <img src="https://github.com/${user}.png" alt="Imagem de ${name}" />
      <a href="https://github.com/${user}" target="_blank">
        <p>${name}</p>
        <span>${user}</span>
      </a>
    </td>
    <td class="repositories">${repositories}</td>
    <td class="followers">${followers}</td>
    <td>
      <button class="btn-delete">&times;</button>
    </td>
    `;

    tr.innerHTML = data;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
