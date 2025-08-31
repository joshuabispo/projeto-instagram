// ===== MOSTRAR SENHA =====
const senhaInput = document.getElementById('senha');
const inputGroup = senhaInput.parentElement;
const toggleBtn = inputGroup.querySelector('.toggle-senha');

// Exibe o botão "Mostrar" apenas quando há texto
senhaInput.addEventListener('input', () => {
  if (senhaInput.value.trim() !== "") {
    inputGroup.classList.add('has-value');
  } else {
    inputGroup.classList.remove('has-value');
  }
});

// Alterna tipo de input (password/text) ao clicar
toggleBtn.addEventListener('click', () => {
  senhaInput.type = senhaInput.type === 'password' ? 'text' : 'password';
});

// ===== AJUSTES OPCIONAIS AO REDIMENSIONAR A TELA =====
window.addEventListener('resize', () => {
  // Se você quiser, pode adicionar ajustes específicos quando a tela mudar
  // Por exemplo, esconder dropdown em telas pequenas ou resetar estilos
  if (window.innerWidth <= 945) {
    linguagens.style.display = 'none'; // reset para telas pequenas
  }
});

function resetAtivo(seletor) {
  document.querySelectorAll(seletor).forEach(el => el.classList.remove('ativo-texto'));
}

const h2Esqueceu = document.querySelector('nav ul h2');
h2Esqueceu.addEventListener('click', () => {
  resetAtivo('nav ul h2, nav ul, .textos-finais h4');
  h2Esqueceu.classList.toggle('ativo-texto');
});

const h3Cadastrar = document.querySelector('nav ul');
h3Cadastrar.addEventListener('click', () => {
  resetAtivo('nav ul h2, nav ul, .textos-finais h4');
  h3Cadastrar.classList.toggle('ativo-texto');
});

const textosFinais = document.querySelectorAll('.textos-finais h4');
textosFinais.forEach(texto => {
  texto.addEventListener('click', () => {
    resetAtivo('nav ul h2, nav ul, .textos-finais h4');
    texto.classList.toggle('ativo-texto');
  });
});

const acessoFac = document.querySelector('.acesso-fac');
const cadastreSe = document.querySelector('nav ul h3 span');

function addPressEffectSmallScreens(el) {
  if (!el) return;

  function isSmallScreen() {
    return window.innerWidth <= 600;
  }

  // ao pressionar: só aplica se tela ≤600px
  el.addEventListener('pointerdown', () => {
    if (isSmallScreen()) el.classList.add('pressed');
  });

  const removePress = () => el.classList.remove('pressed');
  el.addEventListener('pointerup', removePress);
  el.addEventListener('pointercancel', removePress);
  el.addEventListener('pointerleave', removePress);

  // teclado
  el.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && isSmallScreen()) el.classList.add('pressed');
  });
  el.addEventListener('keyup', removePress);
}

// aplica nos dois botões
addPressEffectSmallScreens(acessoFac);
addPressEffectSmallScreens(cadastreSe);

// remove pressed se a tela aumentar enquanto estiver pressionado
window.addEventListener('resize', () => {
  acessoFac.classList.remove('pressed');
  cadastreSe.classList.remove('pressed');
});

document.addEventListener("DOMContentLoaded", () => {
  const menuDropdown = document.querySelector('.menu-dropdown');
  const idiomaAtualElemento = document.getElementById('idioma-atual');
  const itensIdioma = document.querySelectorAll('.linguagens li');

  // Pega idioma salvo ou usa pt como padrão
  let idiomaAtual = localStorage.getItem("idiomaSelecionado") || "pt";

  // Função para carregar traduções de forma segura
  function mudarIdioma(lang) {
    fetch(`locales/${lang}.json`)
      .then(res => res.json())
      .then(traducoes => {
        for (const id in traducoes) {
          const el = document.getElementById(id);
          if (el) {
            // Atualiza apenas elementos que não têm filhos (para não apagar spans internos)
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
              el.textContent = traducoes[id];
            }
          }
        }
      })
      .catch(err => console.error("Erro ao carregar traduções:", err));
  }

  // Inicializa botão de idioma com seta
  const liInicial = Array.from(itensIdioma).find(li => li.dataset.lang === idiomaAtual);
  if (liInicial) idiomaAtualElemento.textContent = `${liInicial.textContent} ▼`;

  // Carrega traduções do idioma atual
  mudarIdioma(idiomaAtual);

  // Abrir/fechar menu ao clicar no botão
  idiomaAtualElemento.addEventListener("click", (e) => {
    e.stopPropagation();
    menuDropdown.classList.toggle("ativo");
  });

  // Clicar em idioma: fecha menu, muda texto, salva e carrega JSON
  itensIdioma.forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();

      idiomaAtual = item.dataset.lang;
      localStorage.setItem("idiomaSelecionado", idiomaAtual);

      // Atualiza apenas o botão com seta
      idiomaAtualElemento.textContent = `${item.textContent} ▼`;

      // Fecha menu
      menuDropdown.classList.remove("ativo");

      // Carrega traduções
      mudarIdioma(idiomaAtual);
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener("click", () => {
    menuDropdown.classList.remove("ativo");
  });
});

function aplicarTemaAutomatico() {
  const prefereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  if (prefereClaro) {
    document.body.classList.add('light');
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.logo-escura').style.display = 'block';
  } else {
    document.body.classList.remove('light');
    document.querySelector('.logo').style.display = 'block';
    document.querySelector('.logo-escura').style.display = 'none';
  }
}

// aplica na primeira carga
aplicarTemaAutomatico();

// atualiza se o usuário mudar a configuração do sistema
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', aplicarTemaAutomatico);
