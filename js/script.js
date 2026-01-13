const tarefaInput = document.getElementById("tarefa-input");
const listaContainer = document.getElementById("lista-container");
const pastaInput = document.getElementById("input-pastas");
const listaPastas = document.getElementById("lista-pastas");
const painelTarefas = document.querySelector(".lista-de-tarefas");

let pastas = JSON.parse(localStorage.getItem("pastas") || "{}");
let pastaAtiva = null;

function salvarTudo() {
  localStorage.setItem("pastas", JSON.stringify(pastas));
}

function renderPastas() {
  listaPastas.innerHTML = "";
  const nomes = Object.keys(pastas);

  if (nomes.length === 0) {
    painelTarefas.classList.remove("ativa");
    pastaAtiva = null;
    listaContainer.innerHTML = "";
    return;
  }

  painelTarefas.classList.add("ativa");

  nomes.forEach((nome) => {
    const div = document.createElement("div");
    div.className = "pastas-itens";

    if (nome === pastaAtiva) {
      div.classList.add("ativa");
    }

    const p = document.createElement("p");
    p.textContent = nome;

    const span = document.createElement("span");
    span.textContent = "×";

    span.onclick = (e) => {
      e.stopPropagation();
      delete pastas[nome];

      if (pastaAtiva === nome) {
        pastaAtiva = Object.keys(pastas)[0] || null;
        renderTarefas();
      }

      salvarTudo();
      renderPastas();
    };

    div.onclick = () => {
      pastaAtiva = nome;
      renderPastas();
      renderTarefas();
    };

    div.appendChild(p);
    div.appendChild(span);
    listaPastas.appendChild(div);
  });
}

function adicionarPasta() {
  const nome = pastaInput.value.trim();

  if (!nome) {
    alert("Digite um nome para a pasta!");
    return;
  }

  if (pastas[nome]) {
    alert("Essa pasta já existe!");
    return;
  }

  pastas[nome] = [];
  pastaAtiva = nome;
  pastaInput.value = "";

  salvarTudo();
  renderPastas();
  renderTarefas();
}

function renderTarefas() {
  listaContainer.innerHTML = "";
  if (!pastaAtiva) return;

  pastas[pastaAtiva].forEach((tarefa, index) => {
    const li = document.createElement("li");
    li.textContent = tarefa.texto;

    if (tarefa.feita) li.classList.add("check");

    li.onclick = () => {
      tarefa.feita = !tarefa.feita;
      salvarTudo();
      renderTarefas();
    };

    const span = document.createElement("span");
    span.textContent = "×";

    span.onclick = (e) => {
      e.stopPropagation();
      pastas[pastaAtiva].splice(index, 1);
      salvarTudo();
      renderTarefas();
    };

    li.appendChild(span);
    listaContainer.appendChild(li);
  });
}

function adicionarTarefa() {
  if (!pastaAtiva) {
    alert("Crie ou selecione uma pasta primeiro!");
    return;
  }

  const texto = tarefaInput.value.trim();

  if (!texto) {
    alert("Digite uma tarefa!");
    return;
  }

  pastas[pastaAtiva].push({
    texto: texto,
    feita: false,
  });

  tarefaInput.value = "";
  salvarTudo();
  renderTarefas();
}

renderPastas();
