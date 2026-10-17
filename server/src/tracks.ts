import type { TrackSeed } from "./types.js";

export const tracks: TrackSeed[] = [
  {
    slug: "mern",
    name: "MERN",
    stack: "MongoDB · Express · React · Node.js",
    summary:
      "Uma linguagem só, do botão ao documento. A tela em React, a API em Express e Node.js, os dados em MongoDB, unificando ambos front-end e o back-end.",
    promise: "Você desenha a interface, expõe a rota e guarda o registro sem trocar de idioma.",
    aside: "Vue.js resolve o mesmo ofício do React: atualizar a tela em componentes. A sintaxe muda; estado, marcação e estilo continuam divididos.",
    color: "#1b6a56",
    modules: [
      {
        level: "iniciante",
        title: "A tela que a pessoa vê",
        summary: "HTML semântico, CSS com intenção e o primeiro componente React.",
        lessons: [
          {
            title: "O miolo da página",
            paragraphs: [
              "HTML5 não é enfeite. Ele diz o que cada bloco significa: cabeçalho, navegação, conteúdo principal, rodapé. Leitor de tela, buscador e o seu eu de amanhã usam esse mapa.",
              "O elemento main aparece uma vez e abraça o assunto da página. Header e footer ficam de fora. Section marca um trecho temático dentro desse miolo.",
              "Código: <main><h1>Sala de estudos</h1></main>",
            ],
          },
          {
            title: "Estilo que aguenta o celular",
            paragraphs: [
              "CSS3 separa a aparência da estrutura. Cor, tipo, espaço e layout moram aqui. Comece pelo que a pessoa precisa ler, não pelo efeito.",
              "Flexbox alinha uma fileira. No eixo principal use justify-content. No eixo cruzado, align-items. Grid entra quando a página pede linhas e colunas ao mesmo tempo.",
              "Código: .cards { display: flex; align-items: stretch; gap: 1rem; }",
            ],
          },
        ],
      },
      {
        level: "intermediario",
        title: "A ponte com o servidor",
        summary: "O React pede JSON. O Express responde. Os dois combinam o formato.",
        lessons: [
          {
            title: "Um endpoint que devolve JSON",
            paragraphs: [
              "A interface não deveria guardar a regra de negócio sozinha. Ela pede, a API decide. Um GET lê. Um POST cria. O verbo já conta a intenção.",
              "Express organiza essas rotas em Node.js. A função recebe o pedido, valida o corpo e responde com status e JSON.",
              "Código: app.get(\"/api/trilhas\", (_req, res) => { res.json(trilhas); });",
            ],
          },
          {
            title: "O componente busca e mostra",
            paragraphs: [
              "No React, o estado guarda o que pode mudar: a lista, o carregamento, o erro. useState segura o valor entre renderizações. O efeito dispara a busca quando a tela nasce.",
              "Mostre os três momentos. Enquanto espera, um texto de status. Se falhar, o que aconteceu e um jeito de tentar de novo. Se vier vazio, explique o vazio.",
            ],
          },
        ],
      },
      {
        level: "avancado",
        title: "Documento, senha e publicação",
        summary: "MongoDB guarda o registro inteiro. A senha vira hash. Publicar pede porta, segredo e banco de verdade.",
        lessons: [
          {
            title: "Documento em vez de linha",
            paragraphs: [
              "No MongoDB um aluno pode viajar num documento só: nome, nível e a lista de trilhas juntos. No relacional, o mesmo aluno vira linha e a lista pode ir para outra tabela.",
              "Nenhum dos dois é mágica. Documento é ótimo quando o registro é lido inteiro. Tabela é ótima quando você cruza muitos conjuntos com SQL.",
              "Código: { nome: \"Ana\", nivel: \"iniciante\", trilhas: [\"mern\"] }",
            ],
          },
          {
            title: "Hash e o servidor no ar",
            paragraphs: [
              "Senha não se guarda como a pessoa digitou. Um hash com salt, como o scrypt, impede que uma cópia do banco entregue as senhas. A API confere o hash no login.",
              "Na publicação, a aplicação escuta a porta do ambiente e não um número cravado só na sua máquina. Segredo fica em variável de ambiente. Arquivo local some quando o disco é efêmero: produção pede um banco gerenciado.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "mean",
    name: "MEAN",
    stack: "MongoDB · Express · Angular · Node.js",
    summary:
      "Representa um conjunto de tecnologias baseadas em JavaScript, a mesma ponte do MERN, com Angular e TypeScript conduzindo a interface.",
    promise: "Tipos na tela, rotas no Express, documentos no MongoDB.",
    aside: "Quem vem do JavaScript puro estranha o módulo do Angular. O ganho aparece no formulário e no serviço HTTP: o TypeScript segura o contrato.",
    color: "#c2410c",
    modules: [
      {
        level: "iniciante",
        title: "Componente com tipo",
        summary: "Template, classe e o tipo do dado que a tela espera.",
        lessons: [
          {
            title: "O que o TypeScript segura",
            paragraphs: [
              "TypeScript é JavaScript com tipos. string | number significa que o valor pode ser texto ou número, não os dois ao mesmo tempo. A barra cria uma união.",
              "O editor avisa antes de a página quebrar. Isso não substitui o teste de quem usa, mas corta uma classe inteira de desencontro.",
              "Código: type Nivel = \"iniciante\" | \"intermediario\" | \"avancado\";",
            ],
          },
          {
            title: "Template perto do HTML",
            paragraphs: [
              "No Angular o template continua parecendo HTML, com marcas a mais para ligar o dado. O componente declara o que entra e o que a pessoa pode fazer.",
              "Compare com o React sem pressa. Os dois desenham interface por partes. Mudam o jeito de escrever o fluxo, não a responsabilidade: a tela não é o banco.",
            ],
          },
        ],
      },
      {
        level: "intermediario",
        title: "Serviço e HTTP",
        summary: "Quem fala com a API não é o template. É um serviço com uma função só.",
        lessons: [
          {
            title: "O serviço busca, o componente mostra",
            paragraphs: [
              "Um serviço Angular concentra o endereço da API, os cabeçalhos e o formato da resposta. O componente pede a lista e trata carregamento, erro e vazio.",
              "É o mesmo desenho de um módulo de API no React. Separar a conversa HTTP da marcação deixa o teste e a troca de tela mais calmos.",
              "Código: listarTrilhas(): Observable<Trilha[]> { return this.http.get<Trilha[]>(\"/api/tracks\"); }",
            ],
          },
          {
            title: "Express continua no meio",
            paragraphs: [
              "Trocar React por Angular não troca o servidor. Express e Node seguem recebendo o pedido, validando de novo e falando com o MongoDB.",
              "Validar só no formulário é pouco. Alguém pode chamar a rota direto. A regra mora no servidor.",
            ],
          },
        ],
      },
      {
        level: "avancado",
        title: "Rota protegida",
        summary: "Guard de navegação, sessão e o cuidado de não esconder erro de rede.",
        lessons: [
          {
            title: "Quem pode entrar na sala",
            paragraphs: [
              "Um guard olha se a pessoa está autenticada antes de abrir a rota. Se não estiver, manda para o login e guarda o destino para a volta.",
              "Isso organiza a experiência. Não substitui a checagem na API: a rota de progresso continua exigindo o token.",
            ],
          },
          {
            title: "Observable sem mistério",
            paragraphs: [
              "No começo, trate o observable como uma busca que avisa quando o valor chega, quando falha ou quando completa. Você não precisa de todos os operadores no primeiro mês.",
              "O essencial é assinar, mostrar o resultado e cancelar a assinatura quando o componente sai de cena, para não atualizar uma tela que já foi embora.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "lamp",
    name: "LAMP",
    stack: "Linux · Apache · MySQL · PHP",
    summary:
      "O clássico que ainda sustenta boa parte da web: sistema, servidor, tabela e página. Representa um dos conjuntos de software (stack) mais tradicionais e utilizados do mundo.",
    promise: "Formulário, consulta SQL e resposta HTML no mesmo fluxo.",
    aside: "PostgreSQL fala a mesma língua SQL do MySQL. O SELECT que você treina aqui troca de banco com pouco esforço. O SQLite deste portal serve para o mesmo raciocínio.",
    color: "#a56a22",
    modules: [
      {
        level: "iniciante",
        title: "Pedido, página e tabela",
        summary: "O que cada letra da sigla faz quando alguém abre uma URL.",
        lessons: [
          {
            title: "A ordem da sigla",
            paragraphs: [
              "LAMP é Linux, Apache, MySQL e PHP. O Linux hospeda. O Apache recebe o HTTP. O MySQL guarda as tabelas. O PHP monta a resposta e a regra.",
              "No pedido real, o Apache entrega o trabalho ao PHP, e o PHP consulta o MySQL. A sigla não é o diagrama do clique, é o conjunto da pilha.",
              "Código: SELECT nome FROM alunos WHERE nivel = 'iniciante';",
            ],
          },
          {
            title: "Uma linha, uma pessoa",
            paragraphs: [
              "Numa tabela, cada aluno é uma linha e cada fato estável é uma coluna: nome, e-mail, nível. A chave primária identifica a linha sem depender do nome, que pode se repetir.",
              "WHERE filtra. Sem ele, o SELECT devolve todo mundo. ORDER BY organiza. LIMIT corta a página.",
            ],
          },
        ],
      },
      {
        level: "intermediario",
        title: "O formulário que grava",
        summary: "POST, validação no PHP e um INSERT com parâmetros.",
        lessons: [
          {
            title: "Do formulário à linha",
            paragraphs: [
              "O formulário HTML junta os campos. O método POST manda o corpo para o PHP. Lá você confere nome, e-mail e senha antes de chegar perto do banco.",
              "Se a validação falha, a página volta com o campo explicado. Se passa, o INSERT grava e a pessoa vê uma confirmação, não uma tela em branco.",
              "Código: INSERT INTO alunos (nome, email) VALUES (?, ?);",
            ],
          },
          {
            title: "Lembrar de quem voltou",
            paragraphs: [
              "HTTP esquece a pessoa entre um pedido e outro. A sessão guarda um identificador no servidor e manda um cookie com a chave.",
              "Não coloque a senha na sessão. Guarde o id do aluno e busque o resto quando precisar.",
            ],
          },
        ],
      },
      {
        level: "avancado",
        title: "Consulta segura",
        summary: "Parâmetro no lugar de concatenar texto. Página, regra e banco em lugares diferentes.",
        lessons: [
          {
            title: "Não cole a frase da pessoa no SQL",
            paragraphs: [
              "Concatenar o que veio do formulário dentro da consulta abre a porta para injeção de SQL. Alguém envia um pedaço de comando no lugar do nome.",
              "Use parâmetro. O banco recebe o valor como dado, não como instrução. A frase da pessoa pode ter aspas à vontade.",
              "Código: $consulta->execute([$nivel]);",
            ],
          },
          {
            title: "Três lugares, três ofícios",
            paragraphs: [
              "A página mostra. A regra decide se o cadastro pode nascer. O banco persiste. Quando os três moram no mesmo arquivo, a primeira mudança dói.",
              "Mesmo num PHP simples dá para separar: um arquivo pede os dados, uma função valida, outra grava. É o embrião do que o .NET chama de camadas.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "dotnet",
    name: ".NET",
    stack: "C# · ASP.NET · SQL",
    summary:
      "Tipagem forte, APIs organizadas e banco relacional. Um pilar estável para sistema que cresce. A melhor opção para construir sistemas corporativos e crescer com estabilidade.",
    promise: "O compilador reclama do tipo antes de o aluno reclamar da tela.",
    aside: "Java e C# compartilham tipo explícito, método e camadas. Python chega no mesmo ofício com Django ou Flask: rota, regra e dados. Mudam as palavras, não o desenho.",
    color: "#243044",
    modules: [
      {
        level: "iniciante",
        title: "O tipo em voz alta",
        summary: "Variável, método e um GET mínimo com ASP.NET.",
        lessons: [
          {
            title: "int não aceita texto",
            paragraphs: [
              "Em C#, int idade guarda número. Se você tenta colocar o texto \"iniciante\", o compilador recusa. O erro aparece na sua mesa, não na mesa do aluno.",
              "É o mesmo espírito do TypeScript em modo estrito. Um avisa no editor. O outro impede a compilação. Os dois cortam desencontro de formato.",
              "Código: int idade = 18;",
            ],
          },
          {
            title: "Uma rota mínima",
            paragraphs: [
              "Uma minimal API em ASP.NET mapeia verbo e caminho para uma função. GET /api/health devolve um objeto. O framework serializa em JSON.",
              "O hábito é o mesmo do Express: endereço claro, status honesto, corpo pequeno.",
              "Código: app.MapGet(\"/api/health\", () => new { ok = true });",
            ],
          },
        ],
      },
      {
        level: "intermediario",
        title: "Modelo e tabela",
        summary: "A classe que representa o aluno e a tabela que o guarda.",
        lessons: [
          {
            title: "A classe espelha a linha",
            paragraphs: [
              "Um modelo com nome, e-mail, nível e o hash da senha descreve o cadastro. A tabela relacional repete essas colunas. O id numérico liga tentativas e sessões a essa pessoa.",
              "Entity Framework, ou uma consulta SQL escrita à mão, traduz a operação. O ponto não é a ferramenta: é saber qual coluna existe e por quê.",
            ],
          },
          {
            title: "Do pedido ao banco",
            paragraphs: [
              "O controller recebe o JSON, chama a validação e só então pede para o banco inserir. Se o e-mail já existe, a resposta é 409, não uma exceção crua na tela.",
              "Status comunica. 201 nasceu. 400 veio incompleto. 401 não autenticou. 404 não existe.",
            ],
          },
        ],
      },
      {
        level: "avancado",
        title: "Camadas e acesso",
        summary: "Interface, aplicação e dados. Identidade sem guardar senha em claro.",
        lessons: [
          {
            title: "Três camadas",
            paragraphs: [
              "A interface fala com a pessoa. A aplicação aplica a regra: nível válido, senha forte, e-mail único. Os dados só inserem, leem e atualizam.",
              "Quando a regra entra no botão da tela, cada cliente novo reimplementa o cadastro. Quando entra na aplicação, a tela vira uma porta.",
            ],
          },
          {
            title: "Identidade",
            paragraphs: [
              "Autenticação responde quem é. Autorização responde o que pode fazer. As duas andam juntas e não são a mesma pergunta.",
              "ASP.NET Identity e um JWT feito à mão resolvem o mesmo contrato: a senha vira hash, o cliente guarda um token, a API confere o token em cada rota protegida.",
              "Código: var hash = hasher.Hash(senha);",
            ],
          },
        ],
      },
    ],
  },
];
