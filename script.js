
const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const toast = $("#toast");
let toastTimer;

// MOSTRAR AVISOS NA TELA
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// MENU PARA CELULAR
$("#menuToggle").addEventListener("click", () => {
  $("#nav").classList.toggle("open");
});

$$("#nav a").forEach(link => {
  link.addEventListener("click", () => {
    $("#nav").classList.remove("open");
  });
});

// PESQUISA E FILTRO DE ONGS
function filterOngs() {
  const query = $("#searchOng")
    .value.toLocaleLowerCase("pt-BR").trim();

  const cause = $("#causeFilter").value;

  let visible = 0;

  $$(".ong-card").forEach(card => {
    const text = (
      `${card.dataset.name} ${card.dataset.cause} ${card.dataset.city}`
    ).toLocaleLowerCase("pt-BR");

    const matches =
      text.includes(query) &&
      (!cause || card.dataset.cause === cause);

    card.classList.toggle("hidden", !matches);

    if (matches) {
      visible++;
    }
  });

  $("#ongCount").textContent =
    `${visible} organização(ões) encontrada(s)`;

  $("#emptyOng").classList.toggle("hidden", visible !== 0);
}

$("#searchOng").addEventListener("input", filterOngs);

$("#causeFilter").addEventListener("change", filterOngs);

// ALTERNAR ENTRE LOGIN E CADASTRO
$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach(item => {
      item.classList.toggle("active", item === tab);
    });

    const registering = tab.dataset.tab === "register";

    $("#loginForm").classList.toggle("hidden", registering);

    $("#registerForm").classList.toggle("hidden", !registering);
  });
});

// FORMULÁRIO DE LOGIN
$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();

  showToast(
    "Demonstração: o login precisa de um sistema de autenticação para funcionar de verdade."
  );
});

// FORMULÁRIO DE CADASTRO
$("#registerForm").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("#fullName").value.trim();

  const role = $('input[name="role"]:checked').value;

  showToast(
    `Cadastro demonstrativo preenchido para ${name} (${role}). Para salvar contas, conecte um banco de dados.`
  );

  event.target.reset();
});

// BOTÃO DO GOOGLE
$("#googleLogin").addEventListener("click", () => {
  showToast(
    "O acesso com Google precisa ser configurado com uma conta de desenvolvedor."
  );
});

// SISTEMA DE DOAÇÕES
const donationDialog = $("#donationDialog");

$$(".donate").forEach(button => {
  button.addEventListener("click", () => {
    $("#chosenCampaign").textContent = button.dataset.campaign;

    $("#customAmount").value = 25;

    $$(".amount").forEach(amount => {
      amount.classList.toggle(
        "active",
        amount.dataset.amount === "25"
      );
    });

    donationDialog.showModal();
  });
});

// SELECIONAR VALORES DE DOAÇÃO
$$(".amount").forEach(button => {
  button.addEventListener("click", () => {
    $$(".amount").forEach(amount => {
      amount.classList.toggle("active", amount === button);
    });

    $("#customAmount").value = button.dataset.amount;
  });
});

// PERMITIR VALOR PERSONALIZADO
$("#customAmount").addEventListener("input", () => {
  $$(".amount").forEach(amount => {
    amount.classList.toggle(
      "active",
      Number(amount.dataset.amount) ===
      Number($("#customAmount").value)
    );
  });
});

// CONFIRMAR DOAÇÃO DEMONSTRATIVA
$("#donationForm").addEventListener("submit", event => {
  event.preventDefault();

  const amount = Number($("#customAmount").value);

  if (!amount || amount < 1) {
    showToast("Digite um valor de doação válido.");
    return;
  }

  donationDialog.close();

  showToast(
    `Doação demonstrativa de R$ ${amount.toFixed(2).replace(".", ",")} para ${$("#chosenCampaign").textContent}. Nenhum pagamento foi feito.`
  );
});

// CANDIDATURA PARA VOLUNTARIADO
$$(".volunteer").forEach(button => {
  button.addEventListener("click", () => {
    const role = button.dataset.role;

    showToast(
      `Você escolheu a vaga "${role}". Entre ou crie uma conta para continuar a candidatura.`
    );

    $("#conta").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// FECHAR A JANELA AO CLICAR FORA DELA
donationDialog.addEventListener("click", event => {
  if (event.target === donationDialog) {
    donationDialog.close();
  }
});
