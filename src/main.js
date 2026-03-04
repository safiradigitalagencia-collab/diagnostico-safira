import './style.css'

// Scroll-triggered fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Section reveal — "Para quem é este material"
const paraQuemSection = document.getElementById('para-quem');
if (paraQuemSection) {
  const revealSection = () => {
    if (!paraQuemSection.classList.contains('revealed')) {
      paraQuemSection.classList.add('revealed');
    }
  };

  // Trigger 1: IntersectionObserver (viewport entry)
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealSection();
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  sectionObserver.observe(paraQuemSection);

  // Trigger 2: Click on "Entender as 4 frentes" button
  const ctaBtn = document.querySelector('a[href="#para-quem"]');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      revealSection();
      paraQuemSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

// Enable animations after observer is set up
requestAnimationFrame(() => {
  document.body.classList.add('js-ready');
});

// Accordion toggles
document.querySelectorAll('.accordion-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-accordion');
    const content = document.getElementById(targetId);
    const chevron = btn.querySelector('.accordion-chevron');
    content.classList.toggle('open');
    chevron.classList.toggle('rotated');
  });
});

// Mobile menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// --- QUIZ DATA & LOGIC ---
// Banco de Dados do Teste - 20 Perguntas frentes ocultas: [aquisicao, nutricao, conversao, decisao]
// Aquisicao -> Tracao; Nutricao -> Meio; Conversao -> Fundo; Decisao -> Checkout
const interactiveQuizData = [
  {
    q: "Como você avalia o volume e o perfil dos leads que chegam diariamente na sua base?",
    options: [
      { id: 'aquisicao', text: 'Chega muito lead curioso ou desqualificado.' },
      { id: 'nutricao', text: 'O volume é bom, mas eles não interagem ou param de responder.' },
      { id: 'conversao', text: 'Os leads parecem bons, mas somem quando apresento o preço ou a oferta.' },
      { id: 'decisao', text: 'Eles chegam até a última etapa de decisão, mas não concluem o pagamento.' }
    ]
  },
  {
    q: "Quando você lança um novo material gratuito, o que costuma acontecer?",
    options: [
      { id: 'nutricao', text: 'Eles baixam, consomem e fica por isso.' },
      { id: 'decisao', text: 'Recebo feedbacks sobre o material e grande parte aplica, mas não demonstram interesse de compra.' },
      { id: 'aquisicao', text: 'Mesmo sendo gratuito o volume de leads é baixo.' },
      { id: 'conversao', text: 'Demonstram interesse na solução completa, mas no final preferem esperar e adiam a compra' }
    ]
  },
  {
    q: "Qual é a principal objeção levantada pelos seus leads durante uma negociação direta ou pelos comentários?",
    options: [
      { id: 'decisao', text: '"Não finalizei por problemas com o cartão/checkout".' },
      { id: 'aquisicao', text: '"Não achei que era isso pago" ou "Achei que o serviço era grátis".' },
      { id: 'conversao', text: '"Achei muito caro" ou "Vou pensar melhor" (Falta de valor percebido na oferta).' },
      { id: 'nutricao', text: '"Não sei se isso serve para o meu momento atual" (Falta de conscientização prévia).' }
    ]
  },
  {
    q: "Olhando para as campanhas ativas hoje, onde está seu maior esforço ou frustração?",
    options: [
      { id: 'conversao', text: 'O Lead chega quente, é conduzido pelo comercial, mas a taxa de conversão é baixa.' },
      { id: 'nutricao', text: 'Não saber se meu conteúdo está consciêntizando ou gerando valor da forma correta.' },
      { id: 'decisao', text: 'O bandono de carrinho têm as maiores taxas e recupero muito pouco.' },
      { id: 'aquisicao', text: 'Mexer no tráfego toda semana porque as campanhas saturam absurdamente rápido.' }
    ]
  },
  {
    q: "Como está o ciclo de vida (jornada) do seu lead até o momento da compra?",
    options: [
      { id: 'nutricao', text: 'Longo demais. Eu não consigo aquecer com velocidade sem que percam o interesse.' },
      { id: 'conversao', text: 'Está bom. Mas se não incentivar para que finalize o pagamento o quanto antes, muitos adiam a compra' },
      { id: 'aquisicao', text: 'Está confuso. Eu não sei exatamente de qual canal o meu melhor comprador vem.' },
      { id: 'decisao', text: 'Eles decidem super rápido, mas travam justo na hora de passar as informações finais.' }
    ]
  },
  {
    q: "Sua produção de conteúdo tem qual impacto prático hoje nas vendas?",
    options: [
      { id: 'aquisicao', text: 'Gera muitas curtidas, mas não atrai leads qualificados.' },
      { id: 'decisao', text: 'Traz meu ICP, mas  o problema aparece na hora de finalizar a compra.' },
      { id: 'conversao', text: 'Recebo muitos feedbacks positivos, mas não enxergam a ponte entre o conteúdo grátis e minha oferta paga.' },
      { id: 'nutricao', text: 'Atrai um bom público, mas que não consome muito além do primeiro conteúdo.' }
    ]
  },
  {
    q: "Quando a venda acontece, o que os números dizem?",
    options: [
      { id: 'conversao', text: 'A taxa de conversão final está muito abaixo do esperado.' },
      { id: 'nutricao', text: 'As pessoas mal chegam na oferta. A queda costuma acontecer antes.' },
      { id: 'aquisicao', text: 'A aquisição está cada vez mais cara. Mesmo com leads qualificados está dificil escalar.' },
      { id: 'decisao', text: 'Diversas intenções de compra recebidas, porém poucas vendas concretizadas.' }
    ]
  },
  {
    q: "Que tipo de métrica você analisa com mais frequência (ou que mais te incomoda) atualmente?",
    options: [
      { id: 'decisao', text: 'Boletos gerados e não pagos / Abandonos de carrinho.' },
      { id: 'conversao', text: 'Queda brusca de avanço no funil e conversão baixa.' },
      { id: 'nutricao', text: 'Quantidade de leads que chegam totalmente perdidos.' },
      { id: 'aquisicao', text: 'Custo de aquisição de leads.' }
    ]
  },
  {
    q: "Como o seu cliente ideal costuma interagir pouco antes do pitch de vendas?",
    options: [
      { id: 'conversao', text: 'Eles olham a oferta e dizem que precisam falar com o sócio/esposa (insegurança).' },
      { id: 'aquisicao', text: 'Eles nem sabem quem eu sou ou o que eu vendo direito, caíram lá de paraquedas.' },
      { id: 'decisao', text: 'Apertam todos os botões, pedem o link, mas depois dizem que o cartão não virou.' },
      { id: 'nutricao', text: 'Ficam calados. O grupo do WhatsApp morre ou ignoram as mensagens do SDR.' }
    ]
  },
  {
    q: "Se você recebesse o dobro de tráfego amanhã na sua operação, qual seria o gargalo imediato?",
    options: [
      { id: 'nutricao', text: 'Meu atendimento engargalaria lidando com perguntas básicas ou minha automação iria pro espaço.' },
      { id: 'aquisicao', text: 'Nada mudaria no final, pois esse "dobro" provavelmente viria de curiosos sem dinheiro.' },
      { id: 'decisao', text: 'Aumentaria meus gastos com plataformas ou gateways que retém/bloqueiam vendas pendentes.' },
      { id: 'conversao', text: 'A equipe de vendas não daria conta de fechar negócios, a conversão geral de fechamento ia cair.' }
    ]
  },
  {
    q: "Como você lida com carrinhos abandonados e boletos não pagos?",
    options: [
      { id: 'decisao', text: 'Tento chamar no WhatsApp, mas a taxa de recuperação é incrivelmente baixa (abysmal).' },
      { id: 'conversao', text: 'Meu time tenta recuperar oferecendo desconto, porque os leads reclamam muito do preço na hora H.' },
      { id: 'nutricao', text: 'Nem tento muito recuperar pois sei que eles não consumiram a oferta na íntegra para se convencer.' },
      { id: 'aquisicao', text: 'O abandono é menor problema, meu grande desafio hoje é fazer as pessoas chegarem na etapa do carrinho.' }
    ]
  },
  {
    q: "O que os seus concorrentes mais diretos parecem estar acertando mais do que você?",
    options: [
      { id: 'conversao', text: 'Tem uma oferta muito mais atrativa e irresistível que a minha (mesmo o produto sendo pior).' },
      { id: 'decisao', text: 'Oferecem opções de pagamento mais flexíveis (boleto parcelado, crediário, recorrente).' },
      { id: 'aquisicao', text: 'Parecem escalar anúncios com uma facilidade absurda e estão em todos os lugares o tempo todo.' },
      { id: 'nutricao', text: 'A comunidade/audiência deles é muito engajada, as pessoas são fãs absolutos.' }
    ]
  },
  {
    q: "Seu produto possui alguma garantia agressiva, prova social forte ou bônus ancorados?",
    options: [
      { id: 'aquisicao', text: 'Tenho tudo isso, mas as pessoas nem clicam no anúncio para descobrir.' },
      { id: 'conversao', text: 'Tenho, mas sinto que não estou comunicando isso direito na página. As pessoas ainda têm dúvidas.' },
      { id: 'nutricao', text: 'Eu jogo tudo isso na cara do lead, mas ele não tem o nível de consciência necessário pra valorizar ainda.' },
      { id: 'decisao', text: 'Até os bônus e garantia não são suficientes na hora do pagamento, a barreira de compra é alta.' }
    ]
  },
  {
    q: "Qual o sentimento geral da sua equipe comercial ou de vendas frente aos contatos diários?",
    options: [
      { id: 'nutricao', text: '"Esses leads estão crus demais, eu tenho que dar aula antes de vender."' },
      { id: 'decisao', text: '"Eu bato o pênalti, a venda tá feita, mas o financeiro do cliente ou o cartão bloqueiam."' },
      { id: 'aquisicao', text: '"Os leads são horríveis, muito caroços, não tem perfil para comprar nosso produto."' },
      { id: 'conversao', text: '"Pelas objeções, os clientes não percebem que nossa solução é superior, falta valor e autoridade."' }
    ]
  },
  {
    q: "Sua automação de e-mail marketing hoje trabalha mais para quê?",
    options: [
      { id: 'conversao', text: 'Para fazer pitch direto o tempo todo (Ofertas). Mas a conversão está bem baixa.' },
      { id: 'decisao', text: 'Focada em mandar lembretes de compra e avisos urgentes (Últimas horas, Carrinho Aberto).' },
      { id: 'aquisicao', text: 'Eu nem ligo muito para automação, meu foco é botar tráfego direto rodando no Instagram.' },
      { id: 'nutricao', text: 'Aulas, artigos e relacionamento constante. Mas a taxa de abertura está em declínio constante.' }
    ]
  },
  {
    q: "Quem é o seu lead mais comum nos dias atuais?",
    options: [
      { id: 'decisao', text: 'Aquele que quer muito, sabe que precisa, pede prazo e depois a burocracia trava ele.' },
      { id: 'nutricao', text: 'Aquele que consome seu material gratuito, agradece pela ajuda e vai embora feliz sem comprar nada.' },
      { id: 'conversao', text: 'Aquele que compara você com outros 3 concorrentes e escolhe o mais barato.' },
      { id: 'aquisicao', text: 'Aquele que clica por curiosidade, não entende nada do que você faz e sai.' }
    ]
  },
  {
    q: "O último lançamento ou campanha de vendas que você fez teve qual característica marcante?",
    options: [
      { id: 'aquisicao', text: 'A captação ficou cara antes mesmo de abrir o carrinho e o volume de leads foi muito abaixo do esperado.' },
      { id: 'conversao', text: 'CPL foi ótimo, CPL show, mas a conversão em vendas (taxa de conversão do lançamento) foi decepcionante.' },
      { id: 'nutricao', text: 'Trouxe muita gente, porém a taxa de comparecimento (ao vivo ou aulas) derreteu (drop-off alto).' },
      { id: 'decisao', text: 'Bateu a meta de boletos e intenções, mas a inadimplência e abandono de carrinho massacraram meu ROI.' }
    ]
  },
  {
    q: "Qual frase definiria o seu sentimento sobre a etapa do funil que mais pesa no seu negócio hoje?",
    options: [
      { id: 'conversao', text: '"Não consigo provar o valor do meu produto o suficiente para o lead passar o cartão."' },
      { id: 'nutricao', text: '"Meus leads entram frios, continuam frios e saem congelados."' },
      { id: 'aquisicao', text: '"Estou pagando muito caro num público sujo e desqualificado."' },
      { id: 'decisao', text: '"Eu vendo, mas a transação não finaliza pelas beiradas do checkout e burocracia."' }
    ]
  },
  {
    q: "Seu processo de Checkout hoje tem quantas fricções (etapas)?",
    options: [
      { id: 'nutricao', text: 'Eles nem chegam lá. Os leads precisam de muito tempo de maturação antes do checkout.' },
      { id: 'aquisicao', text: 'Meu tráfego atual não é qualificado suficiente para encher meu checkout nem se tivesse 1 clique só.' },
      { id: 'decisao', text: 'Tem bastante fricção. Vários campos, não tem Pix rápido, design das antigas, muitas distrações.' },
      { id: 'conversao', text: 'O checkout é liso, mas a página antes dele (LP de Vendas) não tem poder suficiente pra mandar muita gente pra lá.' }
    ]
  },
  {
    q: "Para encerrar, como você avalia o pós-clique dos seus criativos campeões hoje?",
    options: [
      { id: 'decisao', text: 'Todo o processo é bom, o anúncio funciona, o lead tem consciência, converte... e a plataforma declina a compra.' },
      { id: 'conversao', text: 'O criativo é ótimo, mas quando chega no pitch, a promessa lá parece fraca e o lead não avança.' },
      { id: 'aquisicao', text: 'Custo por clique maravilhoso, imagem linda, mas atrai completamente as pessoas erradas (falso positivo).' },
      { id: 'nutricao', text: 'O clique funciona, entram na base, mas engajamento futuro é zero. Eu não consigo aquecer.' }
    ]
  }
];



const quizContainer = document.getElementById('quiz-questions-container');
const quizForm = document.getElementById('funnel-quiz');
const progressBar = document.getElementById('quiz-progress-bar');
const progressText = document.getElementById('quiz-progress-text');
const resultSection = document.getElementById('quiz-result');
const resultContent = document.getElementById('result-content');
const generateBtn = quizForm ? quizForm.querySelector('button[type="submit"]') : null;

// User Current Score
const userScores = { aquisicao: 0, nutricao: 0, conversao: 0, decisao: 0 };
let currentQuestionIndex = 0;
let isQuizStarted = false;
let globalUserName = "";

function getShuffledOptions(options) {
  return options
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const letterLabels = ['A', 'B', 'C', 'D'];

function renderStartScreen() {
  const activeContainer = document.getElementById('quiz-questions-container');
  if (activeContainer) { activeContainer.innerHTML = ''; activeContainer.style.display = 'none'; }

  const userNameInput = document.getElementById('quiz-user-name');
  if (userNameInput && userNameInput.parentElement) {
    userNameInput.parentElement.style.display = 'block';
  }

  const activeProgressBarWrap = document.getElementById('quiz-progress-bar');
  if (activeProgressBarWrap && activeProgressBarWrap.parentElement && activeProgressBarWrap.parentElement.parentElement) {
    activeProgressBarWrap.parentElement.parentElement.style.display = 'none';
  }

  const activeForm = document.getElementById('funnel-quiz');
  const activeBtn = activeForm ? activeForm.querySelector('button[type="submit"]') : null;
  if (activeBtn) activeBtn.innerText = "Iniciar análise →";
}

function renderCurrentQuestion() {
  const activeContainer = document.getElementById('quiz-questions-container');
  if (!activeContainer) return;
  // Limpa o HTML original legado e as injeções passadas
  activeContainer.innerHTML = '';

  // Oculta qualquer item filho direto que existia como question-card no index.html legado
  Array.from(activeContainer.children).forEach(child => {
    child.style.display = 'none';
  });

  // Customizações visuais inline silenciosas para suportar o texto em pé
  const defaultStyles = document.createElement('style');
  defaultStyles.innerHTML = `
    .quiz-options-grid { display: grid; gap: 12px; grid-template-columns: 1fr; margin-top: 24px; }
    .quiz-option-row { 
      display: flex; align-items: flex-start; gap: 16px; padding: 18px; 
      border: 1.5px solid rgba(0,0,0,0.1); border-radius: 12px; cursor: pointer; 
      background: #ffffff; transition: all 0.2s ease;
    }
    .quiz-option-row:hover { border-color: rgba(196,163,90,0.4); background: rgba(250,248,245,0.6); }
    .quiz-option-row.selected {
      background: linear-gradient(135deg, rgba(204,175,120,0.15), rgba(228,191,129,0.08));
      border-color: #C4A35A; box-shadow: 0 4px 12px rgba(196,163,90,0.15);
    }
    .quiz-option-input { display: none; }
    .quiz-option-letter {
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; font-weight: 700; color: #C4A35A;
      background: #fdfaf5; border: 1.5px solid rgba(196,163,90,0.3); font-size: 14px;
      transition: all 0.2s ease;
    }
    .quiz-option-row.selected .quiz-option-letter {
      background: linear-gradient(135deg, #ccaf78, #ddbe87, #e4bf81);
      color: #2D2D2D; border-color: transparent;
    }
    .quiz-option-text { font-size: 15px; color: #4a4a4a; line-height: 1.5; padding-top: 4px; }
  `;
  activeContainer.appendChild(defaultStyles);

  const qData = interactiveQuizData[currentQuestionIndex];
  const shuffledOptions = getShuffledOptions(qData.options);

  const qCard = document.createElement('div');
  qCard.className = 'quiz-question-card quiz-section-card';
  qCard.style.padding = '32px 24px'; // Respeitando a largura global mantida
  qCard.style.marginBottom = '0';

  let optionsHTML = '<div class="quiz-options-grid">';
  shuffledOptions.forEach((opt, idx) => {
    optionsHTML += `
      <label class="quiz-option-row">
        <input type="radio" class="quiz-option-input" name="interactiveOption" value="${opt.id}" required>
        <div class="quiz-option-letter">${letterLabels[idx]}</div>
        <div class="quiz-option-text">${opt.text}</div>
      </label>
    `;
  });
  optionsHTML += '</div>';

  const userName = globalUserName;

  let questionStatusText = "";
  if (currentQuestionIndex === 0) {
    questionStatusText = `Início da análise<br><span style="font-size:12px; font-style:italic; font-weight:400; letter-spacing:0px;">(vamos ver o que nos aguarda)</span>`;
  } else if (currentQuestionIndex >= 1 && currentQuestionIndex <= 3) {
    questionStatusText = "Primeiro eu preciso entender como está a sua estrutura.";
  } else if (currentQuestionIndex >= 4 && currentQuestionIndex <= 6) {
    questionStatusText = "Hum… estou identificando alguns sinais aqui.";
  } else if (currentQuestionIndex >= 7 && currentQuestionIndex <= 10) {
    if (currentQuestionIndex === 9 && userName !== "") {
      questionStatusText = `Hum… estou identificando alguns sinais aqui, ${userName}.`;
    } else if (currentQuestionIndex === 9) {
      questionStatusText = "Hum… estou identificando alguns sinais aqui.";
    } else {
      questionStatusText = "O seu funil já está mostrando alguns padrões… vamos avançar.";
    }
  } else if (currentQuestionIndex >= 11 && currentQuestionIndex <= 14) {
    questionStatusText = "Se prepara… entramos nas etapas críticas.";
  } else if (currentQuestionIndex >= 15 && currentQuestionIndex <= 18) {
    if (currentQuestionIndex === 17 && userName !== "") {
      questionStatusText = `Chegamos na reta final, ${userName}, vamos fechar essa análise com precisão!`;
    } else {
      questionStatusText = "Chegamos na reta final, vamos fechar essa análise com precisão!";
    }
  } else if (currentQuestionIndex === 19) {
    if (userName !== "") {
      questionStatusText = `Falta só você responder isso, ${userName}, para eu concluir seu diagnóstico.`;
    } else {
      questionStatusText = "Falta só você responder isso para eu concluir seu diagnóstico.";
    }
  }

  let topComment = '';
  let bottomComment = '';

  if (currentQuestionIndex === 0) {
    topComment = `<span style="display:inline-block; font-size:13px; font-weight:800; color:#C4A35A; letter-spacing:1px; margin-bottom:12px; line-height:1.4;">${questionStatusText}</span>`;
  } else {
    bottomComment = `
      <div style="display:flex; align-items:center; gap:8px; margin-top:24px; margin-bottom:24px;">
        <div style="width:24px; height:24px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="transform: scaleX(-1);">
            <defs>
              <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#B8963F"/>
                <stop offset="20%" stop-color="#C4A35A"/>
                <stop offset="40%" stop-color="#E8D5A0"/>
                <stop offset="60%" stop-color="#D4B978"/>
                <stop offset="80%" stop-color="#E8D5A0"/>
                <stop offset="100%" stop-color="#B8963F"/>
              </linearGradient>
            </defs>
            <path d="M20 14a4 4 0 0 1-4 4H9l-4 3v-3H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6Z" stroke="url(#goldStroke)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
            <circle cx="8" cy="11" r="1.2" fill="url(#goldStroke)" />
            <circle cx="12" cy="11" r="1.2" fill="url(#goldStroke)" />
            <circle cx="16" cy="11" r="1.2" fill="url(#goldStroke)" />
          </svg>
        </div>
        <div style="font-size:13px; font-family:'Lato', sans-serif; font-style:italic; font-weight:400; color:#747474; margin-top:2px;">${questionStatusText}</div>
      </div>
    `;
  }

  qCard.innerHTML = `
    <div style="margin-bottom: 24px;">
      ${topComment}
      <h3 style="font-size:18px; font-weight:700; color:#2D2D2D; line-height:1.4; font-family:'Lato', sans-serif;">${qData.q}</h3>
    </div>
    ${optionsHTML}
    ${bottomComment}
  `;

  // Listener Visual para seleção silenciosa com a cor do ouro
  const labels = qCard.querySelectorAll('.quiz-option-row');
  labels.forEach(label => {
    label.addEventListener('click', () => {
      labels.forEach(l => l.classList.remove('selected'));
      label.classList.add('selected');
    });
  });

  activeContainer.appendChild(qCard);

  const activeForm = document.getElementById('funnel-quiz');
  const activeBtn = activeForm ? activeForm.querySelector('button[type="submit"]') : null;

  if (activeBtn) {
    if (currentQuestionIndex < 19) {
      activeBtn.innerText = "Próxima Pergunta →";
    } else {
      activeBtn.innerText = "Finalizar e Ver Diagnóstico";
    }
  }

  // Atualiza Barra de Progresso visual
  const activeProgressBar = document.getElementById('quiz-progress-bar');
  const activeProgressText = document.getElementById('quiz-progress-text');

  const progressPct = Math.round((currentQuestionIndex / 20) * 100);
  if (activeProgressBar && activeProgressText) {
    activeProgressBar.style.width = progressPct + '%';
    activeProgressText.innerText = progressPct + '%';
  }
}

// Inicia o Quiz do zero
if (quizContainer) {
  renderStartScreen();
}

if (quizForm) {
  // Cancela o listener nativo legaddo que ficava ouvindo change indiscriminadamente
  const newQuizForm = quizForm.cloneNode(true);
  quizForm.parentNode.replaceChild(newQuizForm, quizForm);

  // Reaproveita referências para o novo clone limpo
  const activeQuizForm = document.getElementById('funnel-quiz');

  activeQuizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isQuizStarted) {
      const nameInput = document.getElementById('quiz-user-name');
      if (nameInput) globalUserName = nameInput.value.trim();

      isQuizStarted = true;

      if (nameInput && nameInput.parentElement) nameInput.parentElement.style.display = 'none';

      const progressWrap = document.getElementById('quiz-progress-bar');
      if (progressWrap && progressWrap.parentElement && progressWrap.parentElement.parentElement) {
        progressWrap.parentElement.parentElement.style.display = 'block';
      }

      const qContainer = document.getElementById('quiz-questions-container');
      if (qContainer) qContainer.style.display = 'block';

      currentQuestionIndex = 0;
      renderCurrentQuestion();
      return;
    }

    // Captura selecao baseada no radioname 'interactiveOption'
    const formData = new FormData(activeQuizForm);
    const selectedId = formData.get('interactiveOption');

    if (!selectedId) return; // Obriga seleção pra avançar nativamente via HTML required form

    // Soma ponto para a frente identificada (aquisicao, nutricao, conversao, decisao)
    userScores[selectedId]++;

    if (currentQuestionIndex < 19) {
      currentQuestionIndex++;
      renderCurrentQuestion();

      // Forçar atualização do rádio botão caso o DOM recicle as instâncias (Safari/Chrome Edge case)
      const visibleRadios = activeQuizForm.querySelectorAll('input[type="radio"]');
      visibleRadios.forEach(r => r.checked = false);

      // Limpa os estados de 'selected' visuais
      const visibleLabels = activeQuizForm.querySelectorAll('.quiz-option-row');
      visibleLabels.forEach(l => l.classList.remove('selected'));

      // Auto Scroll sutil — posiciona no topo do container do quiz mantendo barra visível
      const stickyWrap = document.getElementById('quiz-progress-sticky-wrap');
      if (stickyWrap) {
        const quizWrap = stickyWrap.closest('.quiz-container-wrap') || stickyWrap.parentElement;
        const topOff = quizWrap.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: topOff, behavior: 'smooth' });
      }

    } else {
      // FECHOU O QUIZ! Hora de mapear os pontos e submeter aos cálculos clássicos do PDF
      progressBar.style.width = '100%';
      progressText.innerText = '100%';

      // Requirements fix: Oculte o quiz e dê espaço ao resultado
      if (quizContainer) quizContainer.style.display = 'none';
      if (generateBtn) generateBtn.style.display = 'none';
      if (document.querySelector('.quiz-progress-wrapper')) {
        document.querySelector('.quiz-progress-wrapper').style.display = 'none';
      }

      // Mapeamento Matemático de Inversão.
      // PDF entende 100% como ótimo e 20% como gargalo crítico (maior vilão)
      // O usuário respondeu 20 perguntas. Um score alto nos userScores (ex: 8 em decisao) significa PÉSSIMA decisao.
      // Precisamos converter: ScorePDF = 100 - (GargaloPontos * fator). Para 20 pontos de max, fator = 5.
      // Portanto, se decisao tirar os 20 pontos, ScorePDF dele será 100 - (20 * 5) = 0%. Exatamente Gargalo Crítico!

      const multiplier = 5;
      const scores = {
        tracao: 100 - (userScores.aquisicao * multiplier),
        meio: 100 - (userScores.nutricao * multiplier),
        fundo: 100 - (userScores.conversao * multiplier),
        checkout: 100 - (userScores.decisao * multiplier)
      };

      // Identify lowest (priority: tracao > meio > fundo > checkout)
      const sorted = Object.keys(scores).sort((a, b) => {
        if (scores[a] !== scores[b]) return scores[a] - scores[b];
        const order = ['tracao', 'meio', 'fundo', 'checkout'];
        return order.indexOf(a) - order.indexOf(b);
      });
      const worst = sorted[0];
      const userNameFinal = globalUserName || 'Empreendedor';

      // Results display
      resultSection.style.display = 'block';
      setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

      // Analysis texts
      const analysisMap = {
        tracao: {
          analysis: `${userNameFinal}, já vi isso em dezenas de casos: sua tração está travando as vendas porque os leads que chegam não têm qualidade. Você está perdendo dinheiro em anúncios que atraem o público errado.`,
          consequence: "Conversão baixa e desperdício. É necessário ajustar para não perder mais vendas.",
          actions: [
            "Redefina e documente seu ICP (perfil de cliente ideal) com dados reais",
            "Ajuste a segmentação de anúncios e conteúdos para atrair quem realmente converte",
            "Analise os dados dos leads que já converteram para encontrar padrões",
            "Teste novos canais e criativos focados no perfil que mais compra",
            "Monitore o custo por lead semanalmente e elimine o que não funciona"
          ]
        },
        meio: {
          analysis: `${userNameFinal}, o problema está no meio do funil: os leads chegam, mas esfriam e desaparecem. Falta nutrição e autoridade. Você está deixando dinheiro na mesa ao não conduzir o lead pelo caminho lógico até a compra.`,
          consequence: "Leads viram turistas. Visitam, consomem um pouco e vão embora sem fechar negócio.",
          actions: [
            "Crie réguas de e-mail automáticas com conteúdo educativo e de valor",
            "Produza conteúdo focado em quebra de objeções e provas de resultado",
            "Use depoimentos e cases no meio do funil para construir confiança",
            "Implemente lead scoring para identificar quem está mais próximo da compra",
            "Analise taxas de abertura e clique e otimize assuntos e CTAs"
          ]
        },
        fundo: {
          analysis: `${userNameFinal}, a conversão está sofrendo exatamente na hora H. O cliente até se interessa e chega na página de vendas ou comercial, mas a sua oferta (ou quebra de objeções) não está gerando confiança suficiente.`,
          consequence: "Quase ganha o cliente, mas perde aos 45 do segundo tempo. Esforço comercial desperdiçado.",
          actions: [
            "Fortaleça seus cases de sucesso e depoimentos na página de vendas",
            "Ajuste o empilhamento da oferta para que o valor percebido supere o preço",
            "Ofereça garantias mais claras e ousadas para reduzir o risco percebido",
            "Teste variações de copy, preço e bônus para encontrar o que converte",
            "Alinhe a promessa da oferta com a dor real expressa pelo lead"
          ]
        },
        checkout: {
          analysis: `${userNameFinal}, sua oferta ou confiança estão falhando no momento decisivo. A pessoa decide comprar, vai para o pagamento e algo a impede: juros agressivos, página suspeita, formulário enorme ou falta de suporte no carrinho.`,
          consequence: "Dinheiro deixado na mesa na etapa mais cara (recuperação de carrinho).",
          actions: [
            "Simplifique o formulário de compra para no máximo 3 cliques ou etapas",
            "Adicione Pix, boleto e checkout rápido como opções de pagamento",
            "Otimize a velocidade da página de checkout, especialmente no mobile",
            "Implemente recuperação automática de carrinhos abandonados",
            "Analise em qual etapa do checkout os leads desistem e corrija"
          ]
        }
      };

      const { analysis, consequence, actions } = analysisMap[worst];

      // Score table
      const stageNames = { tracao: 'Tração (Topo)', meio: 'Meio do Funil', fundo: 'Fundo do Funil', checkout: 'Checkout' };
      const scoreTableRows = Object.keys(scores).map(k => {
        const isWorst = k === worst;
        const score = scores[k];
        const barWidth = score + '%';
        const barColor = score < 40 ? '#e74c3c' : score < 60 ? '#f39c12' : score < 80 ? '#ccaf78' : '#27ae60';
        return `
        <div style="display:flex; align-items:center; gap:16px; padding:14px 0; ${isWorst ? 'background:rgba(231,76,60,0.04); margin:0 -16px; padding:14px 16px; border-radius:8px;' : ''}">
          <span style="font-size:15px; font-weight:${isWorst ? '800' : '600'}; color:${isWorst ? '#e74c3c' : '#2D2D2D'}; min-width:140px;">${isWorst ? '⚠ ' : ''}${stageNames[k]}</span>
          <div style="flex:1; height:8px; background:#f0ebe3; border-radius:4px; overflow:hidden;">
            <div style="height:100%; width:${barWidth}; background:${barColor}; border-radius:4px; transition:width 0.6s ease;"></div>
          </div>
          <span style="font-size:15px; font-weight:800; color:${isWorst ? '#e74c3c' : '#2D2D2D'}; min-width:50px; text-align:right;">${score}/100</span>
        </div>
      `;
      }).join('');

      resultContent.innerHTML = `
      <div style="margin-bottom:32px;">
        <p style="font-size:14px; font-weight:700; color:#999; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">Pontuação por Etapa</p>
        <div style="display:flex; flex-direction:column; gap:4px;">
          ${scoreTableRows}
        </div>
      </div>

      <div style="margin-bottom:28px; padding:24px; background:rgba(250,248,245,0.8); border-radius:12px; border-left:4px solid #e74c3c; font-family:'Lato', sans-serif;">
        <p style="font-size:13px; font-weight:700; color:#e74c3c; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">A etapa que mais está travando suas vendas agora</p>
        <p style="font-size:17px; color:#2D2D2D; line-height:1.6; font-weight:400; margin-bottom:24px;">${analysis}</p>
        
        <div style="padding-top:20px; border-top:1px solid rgba(0,0,0,0.05);">
          <p style="font-size:12px; font-weight:700; color:#2D2D2D; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;"><strong>CONSEQUÊNCIA:</strong></p>
          <p style="font-size:16px; color:#2D2D2D; line-height:1.5; font-weight:400;">${consequence}</p>
        </div>
      </div>

      <div style="background:#ffffff; padding:28px; border-radius:12px; border:1px solid rgba(196,163,90,0.35);">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B978" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          <h5 style="font-weight:800; color:#2D2D2D; font-size:17px; margin:0;">O que fazer primeiro:</h5>
        </div>
        <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:14px; margin:0;">
          ${actions.map(a => `
            <li style="display:flex; align-items:flex-start; gap:12px; font-size:16px; color:#545454; line-height:1.5;">
              <div style="margin-top:3px; flex-shrink:0; color:#C4A35A;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p style="margin:0;"><strong style="color:#2D2D2D; font-weight:700;">${a.split(' ').slice(0, 3).join(' ')}</strong> ${a.split(' ').slice(3).join(' ')}</p>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

      // Store for PDF
      window._lastResult = {
        name: userNameFinal,
        scores: scores,
        worst: worst,
        analysis: analysis,
        consequence: consequence,
        actions: actions
      };

      // Auto-gerar se for a última pergunta
    }
  });
}

// Extract PDF logic to a reusable function
function generatePDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const margin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Header gradient: Gradiente suave premium usando array corrigido e livre de bandas (listras)
  const goldStops = [
    { r: 184, g: 150, b: 63 },  // 0.0 #B8963F
    { r: 196, g: 163, b: 90 },  // 0.2 #C4A35A
    { r: 232, g: 213, b: 160 }, // 0.4 #E8D5A0
    { r: 212, g: 185, b: 120 }, // 0.6 #D4B978
    { r: 232, g: 213, b: 160 }, // 0.8 #E8D5A0
    { r: 196, g: 163, b: 90 }   // 1.0 #C4A35A (Corrigido da referência)
  ];

  function getGoldColor(p) {
    if (p <= 0) return goldStops[0];
    if (p >= 1) return goldStops[5];
    let scaled = p * 5;
    let idx = Math.floor(scaled);
    let pEdge = scaled - idx;
    let c1 = goldStops[idx];
    let c2 = goldStops[idx + 1];
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * pEdge),
      g: Math.round(c1.g + (c2.g - c1.g) * pEdge),
      b: Math.round(c1.b + (c2.b - c1.b) * pEdge)
    };
  }

  // Função universal para injetar as fatias perfeitamente fundidas 
  // com Fill & Draw ('FD') para estourar o anti-aliasing e limpar 100% de linhas e riscos
  function drawSmoothGradient(doc, x, y, w, h, isPill, totalW) {
    if (w <= 0.5) return;

    let startX = x;
    let drawW = w;
    let rBase = h / 2;

    const gradientWidth = totalW || w; // Referência para cálculo da cor (Largura total x Largura real da barra iterada)

    // Se for cápsula, desenha os cantos redondos de forma nativa e isolada para fugir de recortes bugados do PDF
    if (isPill && w > h) {
      // Usa a exata cor onde a fatia retangular vai começar para criar a ilusão de não haver junção
      let c0 = getGoldColor(rBase / gradientWidth);
      doc.setFillColor(c0.r, c0.g, c0.b);
      doc.circle(x + rBase, y + rBase, rBase, 'F');
      startX = x + rBase;
      drawW = w - h;
    }

    let steps = Math.min(250, Math.max(50, Math.floor(drawW * 3))); // Otimização inteligente passo vs hardware do PDF
    const sliceW = drawW / steps;

    for (let i = 0; i < steps; i++) {
      let absolutePos = (startX - x + (i * sliceW));
      let p = absolutePos / gradientWidth;
      if (p > 1) p = 1;
      if (p < 0) p = 0;
      let c = getGoldColor(p);

      doc.setFillColor(c.r, c.g, c.b);
      doc.setDrawColor(c.r, c.g, c.b);
      doc.setLineWidth(0.1); // Contorno invisível que força preenchimento de frestas
      doc.rect(startX + (i * sliceW), y, sliceW * 1.5 + 0.05, h, 'FD');
    }

    if (isPill && w > h) {
      // Usa a exata cor onde a última fatia terminou com base no total máximo (evita bola escura de 24% na área errada)
      let cEnd = getGoldColor((w - rBase) / gradientWidth);
      doc.setFillColor(cEnd.r, cEnd.g, cEnd.b);
      doc.circle(x + w - rBase, y + rBase, rBase, 'F');
    }
  }

  // Desenhando o topo
  drawSmoothGradient(doc, 0, 0, 210, 32, false);

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(23.3);
  doc.setTextColor(51, 51, 51); // #333
  const titleText = data.name ? `${data.name}, sua análise foi concluída!` : "Sua análise foi concluída!";
  doc.text(titleText, pageWidth / 2, 21, { align: "center" });

  y = 47;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(74, 74, 74); // #4a4a4a
  doc.text("Resultado por Etapa", margin, y);

  y += 7.5;
  const stageLabels = { tracao: 'Tração', meio: 'Meio', fundo: 'Fundo do Funil', checkout: 'Checkout' };
  Object.keys(data.scores).forEach(k => {
    const score = data.scores[k];
    const statusText = score < 40 ? 'Gargalo crítico' : score < 60 ? 'Atenção necessária' : score < 80 ? 'Pode melhorar' : 'Excelente';

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5); // Bem menor, igual à ref
    doc.setTextColor(81, 81, 81); // #515151

    const lbl = `${stageLabels[k]}: ${score}% — ${statusText}`;
    doc.text(lbl, margin, y);

    y += 2.8;
    // background bar
    doc.setFillColor(243, 239, 230); // Fundo cinza beje muito claro
    doc.roundedRect(margin, y, contentWidth, 5.5, 2.75, 2.75, 'F'); // Altura fina (5.5) / Raio ideal pra formar capsula no jsPDF

    // foreground gradient bar mapped relative to total width `contentWidth`
    const barWidth = (score / 100) * contentWidth;
    drawSmoothGradient(doc, margin, y, barWidth, 5.5, true, contentWidth);
    y += 11.5; // Espaçamento menor e sutil
  });

  y += 1.5;
  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(11.5);
  doc.setTextColor(205, 168, 95); // #cda85f auro
  doc.text(`Maior gargalo: ${stageLabels[data.worst]}`, margin, y);

  y += 5;
  // A caixa em volta usa margin e contentWidth.
  // O texto começa em margin + 4. Portanto há 4px de padding à esquerda.
  // Pra deixar um padding igual à direita (4px), subtraímos 8 do total.

  // ATENÇÃO: É obrigatório definir a fonte e o tamanho ANTES de chamar splitTextToSize
  // caso contrário o jsPDF usará a fonte enorme e bold da linha anterior para fazer o cálculo!
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const splitCons = doc.splitTextToSize(data.consequence, contentWidth - 8);

  const consBoxHeight = 11 + (splitCons.length * 4.5);
  // Fundo rosa antigo #f5d5d6
  doc.setFillColor(245, 213, 214);
  doc.roundedRect(margin, y, contentWidth, consBoxHeight, 3.5, 3.5, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 51, 51); // #333333
  doc.text("Consequência", margin + 4, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(splitCons, margin + 4, y + 10.5);

  y += consBoxHeight + 7; // Espaço exato pra encaixar o PIN

  const pad = 12; // Padding exato do Canva (bem menor)
  const splitAnalysis = doc.splitTextToSize(data.analysis, contentWidth - (pad * 2));
  const actionLines = data.actions.map(a => doc.splitTextToSize(`• ${a}`, contentWidth - (pad * 2)));

  let innerHeight = 0;
  innerHeight += 4.5;
  innerHeight += splitAnalysis.length * 4.5;
  innerHeight += 7;
  innerHeight += 4.5;
  actionLines.forEach(lines => {
    innerHeight += lines.length * 4.5 + 2.5;
  });

  let analysisHeight = pad + 4 + innerHeight + pad;

  // Sombra Leve Esfumaçada 
  doc.setFillColor(235, 235, 235);
  doc.roundedRect(margin - 0.5, y + 0.5, contentWidth + 1.5, analysisHeight + 1.5, 4, 4, 'F');
  doc.setFillColor(242, 242, 242);
  doc.roundedRect(margin - 1, y + 1.5, contentWidth + 3, analysisHeight + 2.5, 5, 5, 'F');

  // Box Analysis Principal
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(212, 185, 120); // Ouro Mid #D4B978 retirado da matriz da foto
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, y, contentWidth, analysisHeight, 3.5, 3.5, 'FD');

  // Desenhando o PIN exato do Canva sobreposto na linha
  const px = pageWidth / 2;
  const py = y;
  // sombra do pino
  doc.setFillColor(215, 205, 190);
  doc.circle(px + 1.2, py + 1.2, 2, 'F');
  // agulha
  doc.setDrawColor(130, 120, 110);
  doc.setLineWidth(0.5);
  doc.line(px, py, px, py + 3);
  // base pino
  doc.setFillColor(170, 130, 70);
  doc.ellipse(px, py - 2.2, 2.2, 1.2, 'F');
  // cabeça pino dourado
  doc.setFillColor(205, 165, 100);
  doc.circle(px, py - 3, 2.2, 'F');
  doc.setFillColor(235, 200, 140);
  doc.circle(px - 0.8, py - 3.8, 0.7, 'F'); // detalhe brilho

  let by = y + pad + 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(51, 51, 51); // 333333ish
  doc.text("Análise Estratégica", margin + pad, by);
  by += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(splitAnalysis, margin + pad, by);
  by += splitAnalysis.length * 4.5 + 6;

  function renderOQueFazerPrimeiro(doc, startX, startY, actionsRaw, contentWidth) {
    let currentY = startY;

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text("O que fazer primeiro:", startX, currentY);
    currentY += 8; // Aumentado de 5 para 8 para dar respiro entre título e a lista

    doc.setFontSize(9);

    actionsRaw.forEach(action => {
      // Separa as 3 primeiras palavras para negrito
      const words = action.split(' ');
      const boldPart = words.slice(0, 3).join(' ');
      const normalPart = words.length > 3 ? ' ' + words.slice(3).join(' ') : '';

      // Ícone de check dourado (custom draw)
      // Ajuste de alinhamento vertical: descendo levemente o ícone para alinhar o centro com o texto
      const checkX = startX + 0.5;
      const checkY = currentY - 1.5; // Antes era -2.5 (descendo 1px o eixo Y para alinhar melhor)
      doc.setDrawColor(196, 163, 90); // #C4A35A
      doc.setLineWidth(0.4);
      doc.line(checkX, checkY, checkX + 1.2, checkY + 1.2);
      doc.line(checkX + 1.2, checkY + 1.2, checkX + 3.2, checkY - 2);

      // Margem pro texto apos o check
      const textX = startX + 6;

      // Imprime Bold
      doc.setFont("helvetica", "bold");
      doc.setTextColor(45, 45, 45);
      doc.text(boldPart, textX, currentY);
      const boldWidth = doc.getTextWidth(boldPart);

      // Imprime Normal na sequencia
      doc.setFont("helvetica", "normal");
      doc.setTextColor(81, 81, 81);

      // Controla a quebra de linha considerando a indentacao do texto normal apos o bold
      const remainingWidth = contentWidth - 6 - boldWidth;
      let splitNormal = doc.splitTextToSize(normalPart, remainingWidth);

      if (splitNormal.length > 0) {
        doc.text(splitNormal[0], textX + boldWidth, currentY);
      }

      let linesUsed = 1;
      if (splitNormal.length > 1) {
        // As proximas linhas precisam voltar pro X alinhado com o texto
        const nextLines = splitNormal.slice(1);
        const splitWrapped = doc.splitTextToSize(nextLines.join(' '), contentWidth - 6);
        doc.text(splitWrapped, textX, currentY + 4.5);
        linesUsed += splitWrapped.length;
      }

      currentY += (linesUsed * 4.5) + 3.5; // Aumentou margem inferior (de 2.5 para 3.5) entre blocos de itens
    });

    return currentY;
  }

  by = renderOQueFazerPrimeiro(doc, margin + pad, by, data.actions, contentWidth - (pad * 2));

  let ctaY = Math.max(y + analysisHeight + 8, 255);

  // Gradiente Base Dourado do CTA inferior re-sintonizado pra ultra-resolução
  drawSmoothGradient(doc, 0, ctaY, 210, 12, false);

  const ctaLine = "Agende uma conversa inicial para entender seu negócio e seus principais desafios.";
  const btnW = 39;
  const btnH = 6.5;
  const btnX = pageWidth - margin - btnW;
  const btnY = ctaY + 2.75;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(81, 81, 81); // #515151
  doc.text(ctaLine, margin, ctaY + 7);

  // Borda botão fina
  doc.setDrawColor(198, 168, 124);
  doc.setLineWidth(0.4);
  doc.roundedRect(btnX, btnY, btnW, btnH, 1.5, 1.5, 'D');

  // Play icon dourado
  const playX = btnX + 4;
  const playY = btnY + 3.25;
  doc.setFillColor(198, 168, 124);
  doc.circle(playX, playY, 1.8, 'F');
  doc.setFillColor(255, 255, 255); // triangulo branco
  doc.triangle(playX - 0.4, playY - 0.7, playX - 0.4, playY + 0.7, playX + 0.8, playY, 'F');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(81, 81, 81); // #515151
  // Centralização óptica corrigida: Base Y subida de 4.5 para 4.1 (alinha o equador do texto ao ícone) e X para 7.3 (mais unido ao ícone)
  doc.text("AGENDAR CHAMADA", btnX + 7.3, btnY + 4.1);
  doc.link(btnX, btnY, btnW, btnH, { url: 'https://cal.com/agencia-safira/30min' });

  // Logo SAFIRA at the absolute bottom
  let logoY = ctaY + 23;

  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.setTextColor(30, 30, 30);
  doc.text("SAFIRA", pageWidth / 2, logoY, { align: "center", charSpace: 1.5 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(4);
  doc.setTextColor(90, 90, 90);
  doc.text("ESTRATÉGIA E EXPANSÃO DIGITAL", pageWidth / 2, logoY + 3, { align: "center", charSpace: 0.2 });

  doc.save(`Diagnostico_Safira_${data.name}.pdf`);
}

// Real PDF Download
document.getElementById('btn-download-pdf').addEventListener('click', () => {
  if (!window._lastResult) return;
  generatePDF(window._lastResult);
});

// Test PDF Download (Mock Data)
const btnTestPdf = document.getElementById('btn-test-pdf');
if (btnTestPdf) {
  btnTestPdf.addEventListener('click', () => {
    // Mock data mirroring the reference print exactly
    const mockData = {
      name: 'Amanda',
      scores: { tracao: 80, meio: 24, fundo: 52, checkout: 60 },
      worst: 'meio',
      analysis: "Elen, o problema está no meio do funil: os leads chegam, mas esfriam e desaparecem. Falta nutrição e autoridade. Você está deixando dinheiro na mesa ao não conduzir o lead pelo caminho lógico até a compra.",
      consequence: "Leads qualificados que esfriam e nunca chegam à oferta. É necessário ajustar para não perder mais vendas.",
      actions: [
        "Crie réguas de e-mail automáticas com conteúdo educativo e de valor",
        "Produza conteúdo focado em quebra de objeções e provas de resultado",
        "Use depoimentos e cases no meio do funil para construir confiança",
        "Implemente lead scoring para identificar quem está mais próximo da compra",
        "Analise taxas de abertura e clique e otimize assuntos e CTAs"
      ]
    };

    generatePDF(mockData);
  });
}
