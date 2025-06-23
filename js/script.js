document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const toggleMusicButton = document.getElementById('toggleBackgroundMusicButton');
    const introVideo = document.getElementById('introVideo');
    const historiasContainer = document.getElementById('historias-container');
    const modalHistoria = document.getElementById('modal-historia');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const closeButton = document.querySelector('.close-button');
    const clickSound = document.getElementById('clickSound');

    // =====================================
    // CONTROLE DE MÚSICA DE FUNDO E VÍDEO
    // =====================================

    let isMusicPlaying = false;

    function playClickSound() {
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.error("Erro ao tocar som de clique:", e));
        }
    }

    introVideo.play().catch(error => {
        console.warn("Reprodução automática do vídeo bloqueada:", error);
    });

    backgroundMusic.volume = 0.3;
    backgroundMusic.play().then(() => {
        isMusicPlaying = true;
        toggleMusicButton.classList.remove('music-off');
        toggleMusicButton.classList.add('music-on');
        toggleMusicButton.innerHTML = '<i class="fas fa-music"></i> Desligar Música de Fundo';
        console.log("Música de fundo iniciada automaticamente.");
    }).catch(error => {
        console.warn("Reprodução automática da música bloqueada:", error);
        isMusicPlaying = false;
        toggleMusicButton.classList.remove('music-on');
        toggleMusicButton.classList.add('music-off');
        toggleMusicButton.innerHTML = '<i class="fas fa-music"></i> Ligar Música de Fundo';
    });

    toggleMusicButton.addEventListener('click', () => {
        playClickSound();

        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
            toggleMusicButton.classList.remove('music-on');
            toggleMusicButton.classList.add('music-off');
            toggleMusicButton.innerHTML = '<i class="fas fa-music"></i> Ligar Música de Fundo';
            console.log("Música de fundo pausada.");
        } else {
            backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                toggleMusicButton.classList.remove('music-off');
                toggleMusicButton.classList.add('music-on');
                toggleMusicButton.innerHTML = '<i class="fas fa-music"></i> Desligar Música de Fundo';
                console.log("Música de fundo iniciada.");
            }).catch(error => {
                console.error("Erro ao tentar reproduzir a música:", error);
            });
        }
    });

    // =====================================
    // CARREGAR E EXIBIR HISTÓRIAS (FIXAS + FIREBASE)
    // =====================================

    const storiesData = {}; // Objeto para armazenar TODAS as histórias (fixas e do Firebase) para acesso rápido

    // Histórias estáticas (as 10 que sempre aparecerão)
    const staticStories = [
        { id: 'ultimaLigacao', title: 'A Última Ligação', icon: 'fas fa-phone-slash', 
          text: `O telefone tocou, cortando o silêncio da meia-noite como uma navalha. Uma voz sussurrou, rouca e fria, "Eu estou aqui". O som parecia vir de dentro da minha própria casa, mas eu estava sozinho. A linha ficou muda, o eco daquela frase arrepiante vibrando em meus ouvidos. Tentei me convencer de que era apenas uma brincadeira, um trote sem graça, mas o ar no quarto ficou denso e frio.

          De repente, um rangido longo e arrastado veio da porta da sala, no andar de baixo. Não era o vento; as janelas estavam fechadas. O som de passos arrastados começou a se aproximar lentamente pela escada de madeira, a cada degrau, um gemido agudo da madeira antiga. Meu coração batia tão forte que eu podia senti-lo martelando em minhas costelas, em minha garganta, em meus ouvidos. Eu estava paralisado pelo terror, incapaz de me mover ou gritar.

          Os passos pararam bem na frente do meu quarto. Um silêncio absoluto tomou conta do ambiente, mais assustador do que qualquer barulho. Eu mal ousava respirar, esperando o que viria a seguir. Então, a maçaneta girou lentamente, e a porta se abriu com um rangido agoniante, revelando apenas a escuridão do corredor. Eu sabia que algo estava ali, observando-me do vazio, esperando. Não ousei me mover. Fiquei ali, imóvel, até o primeiro raio de sol, com a porta aberta para o nada e a certeza de que não era apenas o vento que havia entrado na minha casa naquela noite fatídica.` 
        },
        { id: 'corredorInfinito', title: 'Corredor Infinito', icon: 'fas fa-door-open', 
          text: `A porta se fechou atrás de mim com um baque surdo, e eu me vi em um corredor que parecia não ter fim. As luzes fluorescentes piscavam intermitentemente, criando sombras dançantes que se contorciam nas paredes úmidas. Cada passo ecoava de forma perturbadora, e o ar ficava cada vez mais frio, pesado com um cheiro metálico e úmido. Comecei a andar, tentando encontrar uma saída, mas as portas se multiplicavam, todas idênticas, sem maçanetas, seladas.

          Um sussurro distante, quase inaudível, parecia me chamar pelo nome, vindo de algum lugar no fim do corredor que nunca chegava. Tentei voltar, mas a entrada havia desaparecido, substituída por mais um trecho idêntico do corredor, com mais portas e mais sombras. O som do meu próprio coração batia tão forte que parecia quebrar o silêncio opressor. As luzes piscavam ritmicamente, revelando por breves instantes manchas escuras e úmidas nas paredes que pareciam se contorcer e pulsar, como se o próprio corredor estivesse vivo e respirando.

          Então, em uma das milhares de portas, percebi uma pequena fresta de luz. Uma esperança tênue surgiu em meio ao desespero. Ao me aproximar, um olho vermelho-vivo me espiou por um buraco de fechadura. Não era um olho humano. Era grande, brilhante e cheio de uma malícia antiga. Eu gritei, um grito primal de puro terror, e comecei a correr descontroladamente, mas o corredor se estendia infinitamente diante de mim. E para o meu horror, a cada piscar das luzes, eu via aquele mesmo olho vermelho em cada buraco de fechadura das portas que passava, seguindo cada um dos meus movimentos, prometendo que eu nunca encontraria uma saída.` 
        },
        { id: 'sombraEspelho', title: 'A Sombra do Espelho', icon: 'fas fa-mirror', 
          text: `O espelho, uma antiguidade de moldura escura e entalhes retorcidos, havia sido um presente. Eu o coloquei no quarto, achando que adicionaria um toque de mistério. Mas, logo nas primeiras vezes em que me olhei nele, notei uma figura vaga por trás do meu reflexo, um vulto distorcido que se esgueirava pelas bordas da minha visão e se dissipava quando eu virava.

          A princípio, descartei como cansaço, truques da luz. Mas a sombra se tornava mais definida a cada dia, e seus movimentos mais ousados, quase zombeteiros. Começou a ficar mais perto, mais nítida, seus contornos quase humanos. Eu via os dedos esguios e a silhueta de uma cabeça inclinada, como se me estudasse. O medo começou a se enraizar.

          Uma noite, exausto de virar e não encontrar nada, decidi não reagir. Forcei-me a manter o olhar fixo no espelho enquanto a sombra se movia. Ela parou bem atrás do meu reflexo, tão próxima que eu podia sentir um arrepio gélido na nuca. Lentamente, uma mão longa e esquelética se estendeu no reflexo, seus dedos finos tentando tocar minhas costas através do vidro. O suor escorria pelo meu rosto, o pânico paralisava meu corpo. Eu não conseguia gritar, não conseguia correr. A mão no reflexo se esticava, e eu senti um frio cortante onde ela deveria tocar.

          Foi então que a sombra do espelho sorriu. Um sorriso largo e vazio, que revelou dentes pontiagudos e irregulares. Seus olhos, que antes eram apenas sombras, brilhavam com uma luz maligna. E eu soube que ela não estava apenas se movendo por trás de mim; ela estava esperando a hora certa para sair do espelho e reivindicar o seu lugar, e eu seria apenas mais uma sombra no seu reflexo.` 
        },
        { id: 'cancoaOco', title: 'A Canção do Sussurro Oco', icon: 'fas fa-mouth-open', 
          text: `Começou suave, quase imperceptível, um lamento melódico que subia pelas tábuas do assoalho do meu quarto. Uma canção de ninar, bonita e triste, mas estranhamente dissonante. Eu morava sozinho, então de onde vinha? No início, pensei que era o vento uivando na chaminé, ou talvez a velha casa se assentando, mas a canção se tornou mais clara, uma melodia repetitiva, distorcida, que parecia conhecida, mas não conseguia identificar.

          A cada noite, ficava mais alta, mais vívida, mais próxima. Decidi investigar. Com a lanterna em punho e o coração na garganta, subi as escadas empoeiradas que levavam ao sótão. O som se intensificava a cada degrau, vindo de algum canto escuro lá em cima. O ar no sótão era gelado, e cheirava a poeira, mofo e velhas lembranças. A luz da lanterna mal perfurava a escuridão densa.

          Eu acendi a luz fraca do sótão, e a canção parou abruptamente. O silêncio que se seguiu era mais apavorante do que a melodia. Era um silêncio pesado, carregado de expectativa. Então, um sussurro suave, mas penetrante, ecoou do canto mais escuro do sótão, onde a luz não alcançava: "Você veio para dormir?". A voz era vazia, sem corpo, oca. Eu gritei, deixando a lanterna cair, e corri escada abaixo, tropeçando nas trevas, o pânico me impulsionando. A canção de ninar me seguiu, embalando meus pesadelos e chamando meu nome no silêncio da noite, sempre com aquele sussurro oco que não vinha de nenhuma boca visível, mas que prometia que eu nunca mais dormiria em paz.` 
        },
        { id: 'espelhoVisita', title: 'O Espelho da Última Visita', icon: 'fas fa-mirror', 
          text: `O espelho, uma peça antiga de prata escura e vidro turvo, era um presente de minha tia-avó falecida. Sua moldura entalhada com detalhes que pareciam se retorcer me fascinava. Eu o coloquei no quarto, de frente para a porta, achando que adicionaria um toque de mistério e antiguidade.

          Mas, logo nas primeiras vezes em que me olhei nele, notei uma figura vaga por trás do meu reflexo. Era um vulto esguio, quase transparente, que se movia pelas bordas da minha visão e se dissipava quando eu virava. A princípio, descartei como fadiga, ou reflexos estranhos da iluminação. Contudo, a cada dia, a figura se tornava mais clara: um homem pálido, com olhos vazios e um sorriso triste e melancólico. Ele nunca falava, nunca fazia mal, apenas observava, uma presença silenciosa e inquietante.

          Uma tarde, ao me olhar no espelho, a figura pálida levantou uma mão lentamente e acenou, um gesto estranhamente sereno, como se estivesse se despedindo para sempre. Naquele mesmo instante, o espelho rachou no meio, de cima a baixo, com um som agudo que perfurou o silêncio do quarto. Um arrepio gelado correu pela minha espinha. Horas depois, recebi a notícia da morte inesperada de um amigo próximo que havia visitado minha casa pela última vez na noite anterior. O espelho se tornou um presságio sombrio, uma ponte para o outro lado, e cada nova rachadura que aparecia em seu vidro anunciava a última visita de alguém querido, sempre com o aceno pálido do homem do espelho, que parecia levar um pedaço da minha alma a cada despedida.` 
        },
        { id: 'gritosFloresta', title: 'Os Gritos da Floresta Silenciosa', icon: 'fas fa-tree', 
          text: `Adentrar a floresta à noite não foi uma boa ideia. A trilha era quase invisível sob a copa densa das árvores, e a escuridão era quase absoluta, quebrada apenas pela luz fraca da minha lanterna. O ar estava pesado, denso com o cheiro de terra molhada e folhas secas, e um silêncio opressor pairava no ambiente. Então, os gritos começaram.

          Não eram gritos de dor ou pânico humano. Eram gritos de puro terror, mas abafados, como se viessem de um pesadelo distante, ou de criaturas presas em algum tormento eterno. Eu parei, o coração batendo forte no peito, tentando identificar a origem, mas o som parecia vir de todas as direções, ou de lugar nenhum, ecoando entre as árvores como um coro macabro. A própria floresta parecia vibrar com eles.

          A cada passo que eu dava para me aprofundar na escuridão, os gritos se intensificavam, e eu percebi que eles não eram de pessoas. Eram gritos de algo que nunca foi humano, e eles estavam me atraindo para mais fundo na escuridão, para o centro daquele pesadelo verdejante. O silêncio que se seguia a cada grito era ainda mais assustador, um silêncio denso e opressor que prometia o fim. Eu corri, o pânico me impulsionando, mas a floresta não soltava suas vítimas facilmente. Os galhos se enroscavam, as raízes me puxavam, e os gritos me seguiram, como um coro macabro que celebrava a minha entrada em seu domínio de sombras, prometendo que eu nunca mais veria a luz do dia.` 
        },
        { id: 'bonecaPisca', title: 'A Boneca que Nunca Pisca', icon: 'fas fa-doll', 
          text: `A boneca de porcelana que comprei em um antiquário tinha um sorriso fixo, estranhamente perturbador, e seus olhos de vidro azul pareciam penetrar na alma. Eu a coloquei na estante, de frente para a cama, achando que era apenas mais um item decorativo.

          No começo, era só uma sensação, a de que os olhos dela me acompanhavam pela sala. Mas as sensações se transformaram em visões. À noite, eu acordava com a sensação gélida de estar sendo observado, e sempre encontrava a boneca olhando diretamente para mim, com a cabeça ligeiramente inclinada, como se me estudasse. A dúvida se transformava em medo.

          Uma madrugada, em meio a um pesadelo febril, com a tempestade lá fora batendo contra a janela, eu a vi. Não estava apenas olhando. Ela piscou. Um piscar lento, quase humano, que fez meu sangue gelar e o suor escorrer pelo meu corpo. Eu me virei bruscamente para me esconder debaixo das cobertas, o coração disparado, a respiração presa na garganta. Quando, tremendo, ousei espiar novamente por entre os cobertores, a boneca não estava mais na estante. Ela estava sentada na minha cadeira, ao lado da cama, um pouco mais perto do que antes, e seus olhos, que nunca piscavam, estavam fixos em mim com uma intensidade arrepiante, quase exigindo uma resposta. No dia seguinte, eu a joguei no lixo mais distante que encontrei, mas a imagem daquele piscar me perseguiu, e o medo de encontrar a boneca esperando por mim em casa nunca mais me deixou, pois eu sabia que ela havia encontrado um novo lar.` 
        },
        { id: 'relogioParado', title: 'O Relógio Parado da Meia-Noite', icon: 'fas fa-clock', 
          text: `O relógio de pêndulo, uma relíquia de família com entalhes vitorianos e vidro empoeirado, estava parado há décadas, as mãos presas eternamente no doze. Ninguém jamais o ligava ou consertava; era apenas uma peça de decoração sombria na sala de estar. Mas, uma noite, exatamente à meia-noite, um som profundo e ressonante ecoou pela casa silenciosa. *Bong*.

          Uma única badalada, pesada e vibrante, vinda do relógio que ninguém havia sequer tocado. O ar ficou pesado, o frio se instalou nos ossos, e a atmosfera se tornou densa e opressora. Na manhã seguinte, as mãos do relógio ainda marcavam meia-noite, imóveis como sempre. Na noite seguinte, a mesma coisa. Às doze badaladas da meia-noite, um silêncio total, e então, um solitário e perturbador *Bong*.

          As badaladas se tornaram um presságio, um aviso gélido de que algo estava fora do tempo, preso entre os segundos congelados daquele relógio amaldiçoado. Cada badalada trazia consigo uma sensação de terror crescente, pois você sabia que não era o mecanismo que badalava. Era algo dentro dele, algo que se manifestava apenas na escuridão mais profunda da meia-noite, lembrando a todos que o tempo, para ele, havia parado, mas sua presença, sua influência maligna, nunca.` 
        },
        { id: 'cheiroDoce', title: 'O Cheiro Doce da Decomposição', icon: 'fas fa-flower-wilted', 
          text: `Começou sutil, uma nota estranha misturada ao aroma de casa velha, um cheiro adocicado, quase floral, mas com um toque pútrido e nauseante. Você abriu as janelas, limpou cada canto, procurou por algo estragado na geladeira, verificou a despensa, mas o cheiro persistia, te perseguindo por cada cômodo da casa.

          Era como flores murchas, mas com uma doçura enjoativa, quase fúnebre, que dava arrepios e revirava o estômago. Ele se espalhava, permeando cada canto, impregnando suas roupas, seu cabelo, suas memórias. Parecia vir das paredes, do chão, do ar, de lugar nenhum e de todos os lugares ao mesmo tempo. As noites se tornaram insuportáveis, o cheiro se intensificava na escuridão, tornando o ar irrespirável e roubando seu sono, assombrado pela fragrância de morte em sua própria casa.

          Você começou a ter pesadelos com jardins apodrecidos e corpos escondidos nas paredes. Então, uma manhã, você acordou e o cheiro estava diferente. Mais forte, mais vivo, mais presente, quase palpável. E vinha do quarto ao lado. A porta estava entreaberta, e uma trilha escura e pegajosa se estendia do umbral até o centro do cômodo, onde algo inchado e de uma cor estranha repousava no chão, emanando aquele cheiro doce e insuportável de decomposição. E você soube, com um pavor gélido que paralisou cada nervo do seu corpo, que a casa não cheirava assim por velhice. Era a casa que estava sendo cheirada, e o cheiro indicava a presença de algo que havia finalmente chegado ao seu destino final.` 
        },
        { id: 'chavePorao', title: 'A Chave Esquecida do Porão', icon: 'fas fa-key', 
          text: `Encontrei uma chave antiga, enferrujada e com um design intrincado, escondida em um livro empoeirado na estante da sala de estar, um livro que eu nunca havia aberto. Curioso, tentei encaixá-la na porta do porão, que sempre esteve emperrada e que eu jurava estar trancada há anos. Para minha surpresa, ela girou suavemente, com um clique quase imperceptível.

          A porta de madeira pesada se abriu com um rangido arrastado, revelando uma escuridão úmida e um cheiro forte de terra molhada e mofo antigo. Desci as escadas rangentes, iluminando o caminho com a lanterna do celular, o feixe de luz dançando pelas teias de aranha e sombras. O porão estava surpreendentemente vazio, a não ser por uma única coisa no centro do chão empoeirado: um berço de madeira escura, pequeno e antigo, balançando suavemente de um lado para o outro.

          Não havia vento, não havia nada que o pudesse balançar. O coração começou a bater forte no meu peito enquanto eu me aproximava, e então ouvi um sussurro tênue, quase um choramingo, vindo de dentro do berço vazio. Minha respiração ficou presa na garganta. De repente, o balançar parou. Um silêncio opressor preencheu o porão, mais aterrorizante do que qualquer som, um silêncio que parecia gritar com a ausência de algo. A chave escorregou da minha mão, caindo com um tilintar metálico no chão úmido, e eu corri escada acima, fechando e trancando a porta do porão com um empurrão desesperado. A chave ainda está lá embaixo, e você nunca mais ousou olhar para a porta do porão, sabendo que o que quer que estivesse lá, ainda estava esperando.` 
        }
    ];


    async function loadStories() {
        historiasContainer.innerHTML = '';

        staticStories.forEach(story => {
            storiesData[story.id] = story;
            renderStoryCard(story);
        });

        try {
            const snapshot = await db.collection("historias").get();
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    const story = doc.data();
                    const firebaseStoryId = doc.id;
                    story.icon = story.icon || 'fas fa-book-skull';
                    storiesData[firebaseStoryId] = story;
                    renderStoryCard(story, firebaseStoryId);
                });
                console.log("Histórias do Firebase carregadas e adicionadas.");
            } else {
                console.log("Nenhuma história nova encontrada no Firestore.");
            }
        } catch (error) {
            console.error("Erro ao carregar histórias do Firestore:", error);
            historiasContainer.innerHTML += '<p style="color: #e50000; text-align: center;">Não foi possível carregar as novas histórias do servidor.</p>';
        }
    }

    function renderStoryCard(story, idFromFirebase = null) {
        const article = document.createElement('article');
        article.classList.add('historia-card');
        article.dataset.historia = idFromFirebase || story.id;
        article.innerHTML = `
            <i class="${story.icon} icone-terror" aria-hidden="true"></i>
            <h3>${story.title}</h3>
            <button class="ler-mais">Ler História</button>
        `;
        historiasContainer.appendChild(article);
    }

    loadStories();

    // =====================================
    // FUNCIONALIDADE DO MODAL
    // =====================================

    historiasContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('ler-mais')) {
            playClickSound();
            const historiaCard = event.target.closest('.historia-card');
            const historiaId = historiaCard.dataset.historia;
            const historia = storiesData[historiaId];

            if (historia) {
                modalTitulo.textContent = historia.title;
                modalTexto.textContent = historia.text;
                modalHistoria.style.display = 'flex';
                modalHistoria.focus();
            } else {
                console.error("História não encontrada para ID:", historiaId);
            }
        }
    });

    closeButton.addEventListener('click', () => {
        playClickSound();
        modalHistoria.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalHistoria) {
            playClickSound();
            modalHistoria.style.display = 'none';
        }
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalHistoria.style.display === 'flex') {
            playClickSound();
            modalHistoria.style.display = 'none';
        }
    });

    // =====================================
    // ENVIAR NOVA HISTÓRIA PARA O FIRESTORE
    // =====================================

    const storyForm = document.getElementById('story-form');
    const storyMessage = document.getElementById('story-message');

    storyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        playClickSound();

        const title = storyForm['story-title'].value.trim();
        const author = storyForm['story-author'].value.trim() || 'Anônimo';
        const text = storyForm['story-text'].value.trim();

        if (!title || !text) {
            storyMessage.textContent = 'Por favor, preencha o título e a história.';
            storyMessage.style.color = '#e50000';
            return;
        }

        try {
            await db.collection("historias").add({
                title: title,
                author: author,
                text: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                icon: 'fas fa-book-skull'
            });

            storyMessage.textContent = 'Sua história foi enviada com sucesso! Obrigado por compartilhar seu medo.';
            storyMessage.style.color = '#00ff00';
            storyForm.reset();
            setTimeout(loadStories, 1000); 
        } catch (e) {
            console.error("Erro ao adicionar documento: ", e);
            storyMessage.textContent = 'Ocorreu um erro ao enviar sua história. Tente novamente.';
            storyMessage.style.color = '#e50000';
        }
    });
});