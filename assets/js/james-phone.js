window.THERAN=window.THERAN||{};
window.THERAN.cleanups=window.THERAN.cleanups||{};

window.THERAN.mountJamesPhone=()=>{
  window.THERAN.cleanups.jamesPhone?.();
  'use strict';

  const root=document.querySelector('#jamesDevice');
  if(!root)return()=>{};

  const controller=new AbortController();
  const {signal}=controller;
  const EN=document.documentElement.lang.toLowerCase().startsWith('en');
  const $=(selector)=>root.querySelector(selector);
  const $$=(selector)=>[...root.querySelectorAll(selector)];
  const views=$$('[data-phone-view]');

  const copy=EN?{
    date:new Intl.DateTimeFormat('en-US',{weekday:'long',month:'short',day:'numeric'}),
    personal:'personal conversation',pinnedLabel:'pinned',
    all:'All',pinned:'Pinned',unread:'Unread',
    none:'No conversations found.',
    local:'Created only in this preview.',
    sendPlaceholder:'Write a message',
    saved:'Saved to reading list.',removed:'Removed from reading list.',
    discussion:'Discussion',reactions:'Readers’ view',agree:'Agree',disagree:'Disagree',comments:'comments'
  }:{
    date:new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'short'}),
    personal:'conversa pessoal',pinnedLabel:'fixada',
    all:'Tudo',pinned:'Fixados',unread:'Não lidas',
    none:'Nenhuma conversa encontrada.',
    local:'Criada somente nesta prévia.',
    sendPlaceholder:'Escrever mensagem',
    saved:'Salva na lista de leitura.',removed:'Removida da lista de leitura.',
    discussion:'Discussão',reactions:'Avaliação dos leitores',agree:'Concordo',disagree:'Discordo',comments:'comentários'
  };

  const threadlyFacts=[
    ['Flocos finos ainda atravessavam as janelas naquela manhã.','Fine snowflakes were still crossing the windows that morning.'],
    ['A neve já tinha deixado os telhados brancos.','Snow had already turned the rooftops white.'],
    ['A previsão indicava céu limpo em praticamente todo o litoral.','The forecast called for clear skies along almost the entire coast.'],
    ['As variações observadas permaneciam dentro dos padrões de Nich.','The observed variations remained within Nich standards.'],
    ['Um cargueiro permaneceu imóvel no meio do oceano.','A cargo ship remained motionless in the middle of the ocean.'],
    ['A primeira embarcação perdeu a capacidade de se deslocar durante a madrugada.','The first vessel lost its ability to move during the night.'],
    ['Os sistemas de propulsão do cargueiro continuavam respondendo aos comandos.','The cargo ship’s propulsion systems continued responding to commands.'],
    ['As equipes não identificaram falha mecânica na primeira ocorrência.','Teams found no mechanical failure in the first occurrence.'],
    ['Nenhuma colisão foi identificada no primeiro caso.','No collision was identified in the first case.'],
    ['As condições marítimas observadas não explicavam a imobilidade da embarcação.','The observed sea conditions did not explain why the vessel was motionless.'],
    ['A Guarda Marítima enviou equipes para investigar as embarcações.','The Maritime Guard sent teams to investigate the vessels.'],
    ['Tripulantes foram vistos reunidos no convés do primeiro cargueiro.','Crew members were seen gathered on the first cargo ship’s deck.'],
    ['Não havia fumaça nem chamas ao redor da primeira embarcação.','There was no smoke or fire around the first vessel.'],
    ['Um helicóptero sobrevoou o cargueiro durante a cobertura.','A helicopter flew over the cargo ship during the coverage.'],
    ['Autoridades investigavam relatos semelhantes registrados nas semanas anteriores.','Authorities were investigating similar reports from previous weeks.'],
    ['Os primeiros pontos mostrados no mapa não ficavam próximos uns dos outros.','The first points shown on the map were not close to one another.'],
    ['Os eventos foram classificados provisoriamente como em análise.','The events were provisionally classified as under analysis.'],
    ['Na primeira atualização, ainda não havia evidência de relação entre os casos.','In the first update, there was still no evidence connecting the cases.'],
    ['As autoridades pediram que a população mantivesse a calma.','Authorities asked the public to remain calm.'],
    ['O primeiro mapa exibiu três pontos espalhados pelo oceano.','The first map showed three points scattered across the ocean.'],
    ['Um quarto caso foi confirmado pouco depois no painel de um carro.','A fourth case was confirmed shortly afterward on a car dashboard.'],
    ['Os flocos eram pequenos o bastante para derreter ao tocar os casacos.','The flakes were small enough to melt when they touched coats.'],
    ['Mesmo com as atualizações, a rua continuou com aparência de uma manhã comum.','Despite the updates, the street still looked like an ordinary morning.'],
    ['Ônibus continuaram parando enquanto as notícias eram atualizadas.','Buses kept making their stops while the news was being updated.'],
    ['Uma pessoa saiu da padaria carregando um saco de pães enquanto o plantão seguia.','Someone left the bakery carrying a bag of bread while the bulletin continued.'],
    ['Algumas pessoas caminhavam com neve ainda presa aos ombros dos casacos.','Some people walked with snow still clinging to the shoulders of their coats.'],
    ['“Em análise” indicava ausência de uma explicação suficiente, não uma solução.','“Under analysis” indicated the lack of a sufficient explanation, not a solution.'],
    ['Uma ocorrência não-integrada pode continuar sem uma resposta que funcione.','A non-integrated occurrence may remain without an explanation that works.'],
    ['Não ter uma resposta ainda também foi tratado como informação.','Not having an answer yet was also treated as information.'],
    ['A televisão da recepção da escola continuou exibindo o cargueiro.','The school reception television kept showing the cargo ship.'],
    ['Uma hipótese sobre satélites circulou, mas não explicava a propulsão ainda ativa.','A satellite theory circulated, but it did not explain the still-active propulsion.'],
    ['A causa continuou desconhecida mesmo quando várias pessoas falavam com certeza.','The cause remained unknown even as several people spoke with certainty.'],
    ['Celulares vibraram em vários pontos de uma sala de aula quase ao mesmo tempo.','Phones vibrated around a classroom almost at the same time.'],
    ['A professora ligou a televisão depois de ler uma das novas notificações.','The teacher turned on the television after reading one of the new notifications.'],
    ['Os casos deixaram de ser tratados como ocorrências isoladas.','The cases stopped being treated as isolated occurrences.'],
    ['Equipes internacionais passaram a acompanhar a situação.','International teams began monitoring the situation.'],
    ['Circularam contagens de seis, sete e oito antes de existir um número consolidado.','Counts of six, seven and eight circulated before there was a consolidated number.'],
    ['A orientação na sala foi esperar por informação confirmada.','The guidance in the classroom was to wait for confirmed information.'],
    ['Ao fim das aulas, a faixa da televisão mostrava sete casos confirmados.','At the end of classes, the television banner showed seven confirmed cases.'],
    ['A neve parou depois das aulas, mas ainda cobria carros e calçadas.','The snow stopped after classes but still covered cars and sidewalks.'],
    ['As lojas permaneceram abertas enquanto vitrines exibiam o telejornal.','Shops remained open while storefront televisions showed the news.'],
    ['Uma manchete na banca dizia que navios haviam parado sem explicação.','A newsstand headline said ships had stopped without explanation.'],
    ['Em casa, uma unidade DT emitia um clique periódico acima da janela.','At home, a DT unit made a periodic click above the window.'],
    ['Um canal sugeriu falha eletrônica como hipótese.','One channel suggested an electronic failure as a theory.'],
    ['Outro canal discutiu atividade solar como hipótese.','Another channel discussed solar activity as a theory.'],
    ['Interferência magnética também apareceu entre as explicações propostas.','Magnetic interference also appeared among the proposed explanations.'],
    ['Todos os canais reconheciam que qualquer conclusão seria prematura.','Every channel acknowledged that any conclusion would be premature.'],
    ['A contagem confirmada chegou a onze mais tarde naquele dia.','The confirmed count reached eleven later that day.'],
    ['Durante o jantar, a contagem chegou a dezessete; ainda não estava claro se cresciam os casos ou apenas as confirmações.','During dinner, the count reached seventeen; it was still unclear whether cases were increasing or only confirmations.']
  ];
  const threadlyAccounts=EN?[
    ['Open Line','@open.line'],['Coast Window','@coast.window'],['Morning Shift','@morning.shift'],['Still Under Review','@under.review'],['Public Route','@public.route'],['Cold Front','@cold.front'],['Hallway','@hallway'],['Sea Level','@sea.level'],['Daily Frame','@daily.frame'],['Signal Room','@signal.room'],['Local Interval','@local.interval'],['Clear Record','@clear.record']
  ]:[
    ['Linha Aberta','@linha.aberta'],['Janela do Litoral','@janela.litoral'],['Turno da Manhã','@turno.manha'],['Ainda em Análise','@em.analise'],['Rota Pública','@rota.publica'],['Frente Fria','@frente.fria'],['Corredor','@corredor'],['Nível do Mar','@nivel.mar'],['Quadro do Dia','@quadro.dia'],['Sala de Sinais','@sala.sinais'],['Intervalo Local','@intervalo.local'],['Registro Claro','@registro.claro']
  ];
  const threadlyNotes=EN?[
    'The record confirms the event, not its cause.','Without a confirmed cause, everything beyond this remains a theory.','The question is still open.','Share the fact; leave the explanation under analysis.','So far, this is what has been confirmed.','More context is worth more than speed.','Observation is not the same as conclusion.'
  ]:[
    'O registro confirma o acontecimento, não a causa.','Sem uma causa confirmada, o restante ainda é hipótese.','A pergunta continua aberta.','Compartilhe o fato; deixe a explicação em análise.','Até aqui, isso é o que foi confirmado.','Mais contexto vale mais do que pressa.','Observar não é o mesmo que concluir.'
  ];
  const heartIcon='<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9Z"/></svg>';
  const commentIcon='<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/></svg>';
  const saveIcon='<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4Z"/></svg>';
  const soundIcon='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4ZM15 9l6 6M21 9l-6 6"/></svg>';
  const postFooter=(likes,comments)=>`<footer><button data-threadly-like type="button" aria-pressed="false">${heartIcon}<span>${likes}</span></button><button type="button">${commentIcon}<span>${comments}</span></button><button class="threadly-save" data-threadly-save type="button" aria-label="${EN?'Save':'Salvar'}" aria-pressed="false">${saveIcon}</button></footer>`;
  const postHeader=(account,index)=>`<header><span class="threadly-avatar canon" style="--avatar-hue:${(index*47+318)%360}">${account[0][0]}</span><span class="threadly-person"><strong>${account[0]}</strong><small>${account[1]} · ${index<3?(EN?'now':'agora'):`${Math.ceil(index/3)} ${EN?'min':'min'}`}</small></span><button aria-label="${EN?'More options':'Mais opções'}" type="button">•••</button></header>`;
  function renderThreadlyFeed(){
    const feed=$('.threadly-feed');
    if(!feed)return;
    feed.id='threadlyFeed';
    feed.setAttribute('aria-label',EN?'100 Threadly posts':'100 publicações do Threadly');
    const videoPosts=[
      {account:threadlyAccounts[0],text:EN?'Confirmed count on the same day: 7, then 11, then 17. The cause remained under analysis.':'Contagem confirmada no mesmo dia: 7, depois 11, depois 17. A causa continuava em análise.',src:'rede-oceanica',likes:312,comments:41},
      {account:threadlyAccounts[9],text:EN?'While updates kept arriving, a home DT unit continued its periodic click above the window.':'Enquanto as atualizações continuavam chegando, uma unidade DT doméstica manteve o clique periódico acima da janela.',src:'distant-trees',likes:174,comments:18}
    ];
    const videos=videoPosts.map((post,index)=>`<article class="threadly-post threadly-video-post" data-threadly-kind="clips">${postHeader(post.account,index)}<p>${post.text}</p><div class="threadly-video-wrap"><video muted loop playsinline preload="metadata" poster="assets/threadly/${post.src}.jpg"><source src="assets/threadly/${post.src}.mp4" type="video/mp4"/></video><button class="threadly-sound" data-threadly-sound type="button" aria-label="${EN?'Turn sound on':'Ativar som'}">${soundIcon}</button></div>${postFooter(post.likes,post.comments)}</article>`).join('');
    const canon=threadlyFacts.flatMap((fact,index)=>{
      const primary=EN?fact[1]:fact[0];
      const variants=[primary,`${primary} ${threadlyNotes[index%threadlyNotes.length]}`];
      return variants.map((text,variant)=>{
        const order=index*2+variant+2;
        const account=threadlyAccounts[(index+variant*5)%threadlyAccounts.length];
        const likes=23+((order*37)%341);
        const comments=2+((order*11)%57);
        return `<article class="threadly-post threadly-post-canon" data-threadly-kind="text">${postHeader(account,order)}<p>${text}</p><span class="threadly-post-source">${EN?'public timeline':'linha pública'}</span>${postFooter(likes,comments)}</article>`;
      });
    }).join('');
    feed.innerHTML=`<div class="threadly-feed-count"><span>${EN?'public feed':'feed público'}</span><b>100 ${EN?'posts':'publicações'}</b></div>${videos}${canon}`;
  }

  const threads=EN?[
    {id:'noah',name:'Noah',initial:'N',pinned:true,unread:0,time:'23:05',preview:'Liar.',messages:[
      {day:'After the broadcast'},
      {dir:'in',attachment:{title:'BROADCAST MAP',meta:'central region circled'},text:'I’ve been staring at this for ten minutes and maybe I’m very stupid, but the currents shouldn’t point into the middle of a continent.',time:'21:08'},
      {dir:'out',text:'It isn’t the water flowing in. Look at the lines on the map: if you follow their direction, they all lead into Mora.',time:'21:09'},
      {dir:'in',text:'I know. That’s what I’m saying.',time:'21:09'},
      {dir:'in',text:'I was hoping you’d have a better explanation.',time:'21:10'},
      {dir:'out',text:'Why would I?',time:'21:10'},
      {dir:'in',text:'You spent almost a week staring at a stopped ship. I thought you might have unlocked some ability.',time:'21:11'},
      {dir:'out',text:'Unfortunately, no.',time:'21:12'},
      {day:'Later that night'},
      {dir:'in',text:'Are you still looking at that map?',time:'23:04'},
      {dir:'out',text:'No.',time:'23:05'},
      {dir:'in',text:'Liar.',time:'23:05'}
    ]},
    {id:'sarah',name:'Sarah',initial:'S',pinned:true,unread:1,time:'23:44',preview:'damn',messages:[
      {day:'During the break'},
      {dir:'in',attachment:{title:'CAFETERIA TV',meta:'CONFIRMED CASES: 31'},time:'11:26'},
      {day:'After the historical catalog'},
      {dir:'in',text:'you owe me 5 credits',time:'23:43'},
      {dir:'out',text:'you bet I WOULDN’T look it up',time:'23:43'},
      {dir:'in',text:'damn',time:'23:44'}
    ]},
    {id:'mother',name:'Mother',initial:'M',pinned:false,unread:0,time:'16:02',preview:'There’s food in the pot. I’ll be back at six.',messages:[
      {day:'Yesterday'},
      {dir:'in',text:'There’s food in the pot. I’ll be back at six.',time:'16:02'}
    ]}
  ]:[
    {id:'noah',name:'Noah',initial:'N',pinned:true,unread:0,time:'23:05',preview:'Mentiroso.',messages:[
      {day:'Depois da reportagem'},
      {dir:'in',attachment:{title:'MAPA DA REPORTAGEM',meta:'região central circulada'},text:'Eu tô olhando isso faz dez minutos e talvez eu seja muito burro, mas as correntes não deviam apontar pro meio de um continente.',time:'21:08'},
      {dir:'out',text:'Não é a água entrando lá. Olha as linhas do mapa: se você seguir a direção delas, todas vão dar dentro de Mora.',time:'21:09'},
      {dir:'in',text:'Eu sei. É isso que eu tô falando.',time:'21:09'},
      {dir:'in',text:'Eu tava esperando você ter uma explicação melhor.',time:'21:10'},
      {dir:'out',text:'Por que eu teria?',time:'21:10'},
      {dir:'in',text:'Você passou quase uma semana olhando pra navio parado. Achei que tivesse desbloqueado alguma habilidade.',time:'21:11'},
      {dir:'out',text:'Infelizmente, não.',time:'21:12'},
      {day:'Mais tarde naquela noite'},
      {dir:'in',text:'Você ainda tá olhando aquele mapa?',time:'23:04'},
      {dir:'out',text:'Não.',time:'23:05'},
      {dir:'in',text:'Mentiroso.',time:'23:05'}
    ]},
    {id:'sarah',name:'Sarah',initial:'S',pinned:true,unread:1,time:'23:44',preview:'droga',messages:[
      {day:'Durante o intervalo'},
      {dir:'in',attachment:{title:'TV DA CANTINA',meta:'CASOS CONFIRMADOS: 31'},time:'11:26'},
      {day:'Depois do catálogo histórico'},
      {dir:'in',text:'você me deve 5 créditos',time:'23:43'},
      {dir:'out',text:'você apostou que NÃO ia pesquisar',time:'23:43'},
      {dir:'in',text:'droga',time:'23:44'}
    ]},
    {id:'mother',name:'Mãe',initial:'M',pinned:false,unread:0,time:'16:02',preview:'Tem comida na panela. Volto às seis.',messages:[
      {day:'Ontem'},
      {dir:'in',text:'Tem comida na panela. Volto às seis.',time:'16:02'}
    ]}
  ];

  const newsArticles=EN?{
    ships:{section:'Ocean',eyebrow:'Continuous coverage · updated 09:18',title:'Maritime incidents rise to 31 after seven new cases',deck:'The events remain under analysis. Specialists say any conclusion about a common cause would still be premature.',meta:'4 min read · Maritime desk',body:[
      'Seven new cases were added to the maritime monitoring network since yesterday, raising the total from 24 to 31. In an earlier update, the morning count had reached eighteen motionless vessels.',
      'Electronic failure, unusual solar activity, magnetic interference, and communication problems have all been discussed publicly. None has been confirmed as a common cause.',
      'Some ports are holding cargo departures as a precaution. The vessels remain unable to navigate while the investigation continues.'
    ],reactions:[['Informative',84],['Worrying',231],['Doubtful',67]],comments:[
      {name:'Lea M.',time:'12 min ago',text:'Thirty-one ships and the public statement is still “under analysis.” At what number do we get more than a total?',agree:94,disagree:18},
      {name:'Davi K.',time:'8 min ago',text:'A larger number still does not prove a common cause. I would rather wait for evidence than turn every gap into a conclusion.',agree:61,disagree:29},
      {name:'Nara E.',time:'3 min ago',text:'The bulletin should publish the location and type of every vessel, not only the total.',agree:108,disagree:7}
    ]},
    ports:{section:'Mobility',eyebrow:'Service · 08:46',title:'Some ports hold cargo departures as maritime cases increase',deck:'The measure is not general; stock, overland transport, and other terminals enter distribution planning.',meta:'2 min read · Service desk',body:[
      'Some ports have begun holding cargo-ship departures while the cause of the maritime stoppages remains unknown.',
      'The measure does not apply to every port. Cargo planners are reviewing available stock, overland transport, and departures through other terminals.'
    ],reactions:[['Useful',76],['Incomplete',42]],comments:[
      {name:'Ivo R.',time:'19 min ago',text:'“Some departures” is not useful without listing which terminals are affected.',agree:73,disagree:9},
      {name:'Mara V.',time:'11 min ago',text:'My route left on time. Check the board before leaving; it changed twice this morning.',agree:51,disagree:4}
    ]},
    crews:{section:'Ocean',eyebrow:'Monitoring · 08:12',title:'Teams continue investigating vessels that lost navigation capacity',deck:'The cases remain under analysis while technical records from each vessel are compared.',meta:'3 min read · Maritime desk',body:[
      'Investigation teams continue examining the vessels that lost navigation capacity. Public reports do not yet point to a shared technical failure.',
      'Records from the first eighteen cargo ships are being compared with the newer cases. Specialists say the growing number makes the search more urgent, not more conclusive.'
    ],reactions:[['Informative',53],['Worrying',119]],comments:[
      {name:'Tomas A.',time:'26 min ago',text:'If the failures look alike, explain what they actually have in common.',agree:82,disagree:14},
      {name:'Celi N.',time:'15 min ago',text:'The public reports keep saying “under analysis” without showing the records being compared.',agree:47,disagree:8}
    ]},
    hypotheses:{section:'Science',eyebrow:'Explainer · 07:58',title:'What is known — and still unknown — about the ocean stoppages',deck:'Electronic failure, solar activity, and magnetic interference remain hypotheses; none explains every case.',meta:'5 min read · Science desk',body:[
      'Specialists consulted by Riva say the cases share timing and behavior, but the available records do not yet demonstrate a common mechanism.',
      'Electronic failures, unusual solar activity, and magnetic interference have all been discussed publicly. Each could explain part of the observations; none accounts for the entire set.',
      'Researchers warn that the current sample is too small and uneven for a definitive conclusion.'
    ],reactions:[['Informative',143],['Too cautious',64]],comments:[
      {name:'Oren P.',time:'31 min ago',text:'This is the first report that clearly separates observations from guesses.',agree:126,disagree:6},
      {name:'Sira D.',time:'20 min ago',text:'Too cautious. Thirty-one repeated failures are already a pattern, even if the mechanism is unknown.',agree:71,disagree:32}
    ]},
    dt:{section:'Everyday life',eyebrow:'Schools · 07:40',title:'Seasonal inspections of DT units continue in schools',deck:'Maintenance may leave side panels open temporarily without interrupting classes.',meta:'2 min read · Local desk',body:[
      'Technical teams continue the seasonal inspection of Distant Trees units installed in schools. During the procedure, a side panel may remain open while the equipment is tested.',
      'DT units are also used in homes and other buildings. They increase local Fryoxide availability and help control heat retention, returning to normal operation after technical clearance.'
    ],reactions:[['Useful',64],['Routine',39]],comments:[
      {name:'Neli S.',time:'24 min ago',text:'The open panel worried some parents yesterday. Schools should send this explanation directly.',agree:58,disagree:5},
      {name:'Caio L.',time:'17 min ago',text:'The unit in our building was inspected last week and took less than an hour.',agree:31,disagree:2}
    ]},
    weather:{section:'Weather',eyebrow:'Forecast · 06:55',title:'Morning begins at 11 °V with stable conditions',deck:'No significant change is expected during the first half of the day.',meta:'1 min read · Weather desk',body:[
      'The morning began at 11 °V, within the expected range for the season. Public services are operating normally.',
      'Snow left from the previous days continues to melt in shaded areas, where sidewalks may remain wet through the morning.'
    ],reactions:[['Useful',35],['Routine',28]],comments:[
      {name:'Tessa R.',time:'34 min ago',text:'Cold enough to regret leaving my coat at school yesterday.',agree:22,disagree:1},
      {name:'Eli V.',time:'29 min ago',text:'The shaded sidewalk outside my building is still slippery. Stable weather does not mean dry ground.',agree:37,disagree:6}
    ]},
    conde:{section:'Science',eyebrow:'Seasonal calendar · 06:31',title:'Conde Island expected to enter its active period in about five months',deck:'Annual monitoring begins early as the island approaches the summer cycle known simply as Conde.',meta:'4 min read · Science and culture desk',body:[
      'Conde Island is expected to enter its annual active period in about five months, when summer is already part of the calendar. Monitoring teams follow fissures, heat, and steam displacement before the start of Day 1.',
      'The island’s name comes from the best-known account of explorer Isaac Conde Juan. According to the legend, he found and registered the island on his first expedition.',
      'On his second visit, the island became active and Conde Juan died. The story became inseparable from the seasonal event, now shortened in everyday speech to Conde.',
      'Authorities say the current notice is part of routine preparation and does not indicate activity outside the expected cycle.'
    ],reactions:[['Interesting',173],['Worrying',48],['Legend',91]],comments:[
      {name:'Ari S.',time:'41 min ago',text:'My family says “Conde Juan” and never “Conde Island.” I did not know the registration story.',agree:87,disagree:13},
      {name:'Bela O.',time:'33 min ago',text:'Calling it a legend does not change the fact that the island enters activity every year.',agree:69,disagree:8},
      {name:'Ravi C.',time:'22 min ago',text:'Five months away and people are already complaining about the heat.',agree:44,disagree:3}
    ]},
    transit:{section:'Everyday life',eyebrow:'City services · 06:18',title:'Urban transport remains in operation during network fluctuations',deck:'Vehicles continue circulating while some information panels may update late.',meta:'2 min read · Service desk',body:[
      'Urban transport remains in operation while intermittent failures affect parts of the local network. Buses and other vehicles continued circulating through the morning.',
      'Service operators recommend using platform notices when the mobile estimate and the station display do not match.'
    ],reactions:[['Useful',52],['Doubtful',23]],comments:[
      {name:'Lian T.',time:'46 min ago',text:'“Regular intervals” did not reach my stop. Two vehicles passed together after a long gap.',agree:63,disagree:11},
      {name:'Jo M.',time:'38 min ago',text:'The platform notice was correct here; the phone estimate was not.',agree:29,disagree:2}
    ]},
    classes:{section:'Everyday life',eyebrow:'Education · yesterday',title:'Schools maintain classes while internal networks are checked',deck:'Administrative systems may be slower, but classroom schedules remain unchanged.',meta:'2 min read · Education desk',body:[
      'Schools are keeping their regular class schedules while technical teams check local networks and communication panels.',
      'The work is separate from seasonal DT inspections. Families will be notified directly if any unit changes its schedule.'
    ],reactions:[['Useful',41],['Unnecessary',12]],comments:[
      {name:'Mina F.',time:'yesterday',text:'Please send notices before students arrive, not after the first class.',agree:74,disagree:5},
      {name:'Teo G.',time:'yesterday',text:'Everything worked normally at our school today.',agree:21,disagree:4}
    ]},
    community:{section:'Everyday life',eyebrow:'City · yesterday',title:'Daily routines continue as maritime bulletins become constant',deck:'Tests, games, lunch, and errands share attention with the rising case count.',meta:'3 min read · City desk',body:[
      'Maritime updates now appear on school televisions, shop windows, public panels, and personal devices throughout the day.',
      'At the same time, ordinary routines continue. Students discuss tests and games, shops remain open, and most people look at the screens only in passing.'
    ],reactions:[['Observed',46],['Worrying',22]],comments:[
      {name:'Vera I.',time:'yesterday',text:'You cannot stop the city every time the number changes, but pretending not to look is not calm either.',agree:35,disagree:8},
      {name:'Noel B.',time:'yesterday',text:'The strange part is how quickly a new total became background noise.',agree:61,disagree:3}
    ]}
  }:{
    ships:{section:'Oceano',eyebrow:'Cobertura contínua · atualização 09:18',title:'Ocorrências marítimas chegam a 31 após sete novos casos',deck:'Os eventos permanecem em análise. Especialistas dizem que qualquer conclusão sobre uma causa comum ainda seria prematura.',meta:'4 min de leitura · Editoria marítima',body:[
      'Sete novos casos entraram na rede de monitoramento marítimo desde ontem, elevando o total de 24 para 31. Em uma atualização anterior, a contagem da manhã havia chegado a dezoito embarcações imóveis.',
      'Falha eletrônica, atividade solar incomum, interferência magnética e problemas de comunicação já foram discutidos publicamente. Nenhuma hipótese foi confirmada como causa comum.',
      'Alguns portos estão segurando saídas de cargueiros por precaução. As embarcações continuam sem capacidade de navegação enquanto a investigação prossegue.'
    ],reactions:[['Informativa',84],['Preocupante',231],['Duvidosa',67]],comments:[
      {name:'Lea M.',time:'há 12 min',text:'Trinta e um navios e o comunicado continua dizendo “em análise”. Em que número teremos mais que um total?',agree:94,disagree:18},
      {name:'Davi K.',time:'há 8 min',text:'Um número maior ainda não prova uma causa comum. Prefiro esperar evidências a transformar cada lacuna em conclusão.',agree:61,disagree:29},
      {name:'Nara E.',time:'há 3 min',text:'O boletim deveria publicar a localização e o tipo de cada embarcação, não só o total.',agree:108,disagree:7}
    ]},
    ports:{section:'Mobilidade',eyebrow:'Serviço · 08:46',title:'Alguns portos seguram saídas de cargueiros com aumento dos casos',deck:'A medida não é geral; estoques, transporte terrestre e outros terminais entram no planejamento de distribuição.',meta:'2 min de leitura · Editoria de serviço',body:[
      'Alguns portos começaram a segurar saídas de cargueiros enquanto a causa das paralisações marítimas permanece desconhecida.',
      'A medida não alcança todos os portos. Planejadores de carga revisam estoques disponíveis, transporte terrestre e saídas por outros terminais.'
    ],reactions:[['Útil',76],['Incompleta',42]],comments:[
      {name:'Ivo R.',time:'há 19 min',text:'“Algumas partidas” não ajuda sem dizer quais terminais foram afetados.',agree:73,disagree:9},
      {name:'Mara V.',time:'há 11 min',text:'A minha rota saiu no horário. Confiram o painel antes de ir; ele mudou duas vezes hoje cedo.',agree:51,disagree:4}
    ]},
    crews:{section:'Oceano',eyebrow:'Monitoramento · 08:12',title:'Equipes continuam investigando embarcações que perderam a capacidade de navegação',deck:'Os casos permanecem em análise enquanto registros técnicos de cada navio são comparados.',meta:'3 min de leitura · Editoria marítima',body:[
      'Equipes de investigação continuam examinando as embarcações que perderam a capacidade de navegação. Os relatórios públicos ainda não apontam uma falha técnica compartilhada.',
      'Registros dos primeiros dezoito cargueiros estão sendo comparados aos casos mais recentes. Especialistas afirmam que o aumento no número torna a busca mais urgente, não mais conclusiva.'
    ],reactions:[['Informativa',53],['Preocupante',119]],comments:[
      {name:'Tomas A.',time:'há 26 min',text:'Se as falhas parecem iguais, expliquem o que elas realmente têm em comum.',agree:82,disagree:14},
      {name:'Celi N.',time:'há 15 min',text:'Os relatórios públicos repetem “em análise” sem mostrar os registros que estão comparando.',agree:47,disagree:8}
    ]},
    hypotheses:{section:'Ciência',eyebrow:'Entenda · 07:58',title:'O que se sabe — e o que ainda não se sabe — sobre as paralisações no oceano',deck:'Falha eletrônica, atividade solar e interferência magnética seguem como hipóteses; nenhuma explica todos os casos.',meta:'5 min de leitura · Editoria de ciência',body:[
      'Especialistas ouvidos pela Riva afirmam que os casos compartilham tempo e comportamento, mas os registros disponíveis ainda não demonstram um mecanismo comum.',
      'Falhas eletrônicas, atividade solar incomum e interferência magnética já foram discutidas publicamente. Cada hipótese explica parte das observações; nenhuma responde ao conjunto inteiro.',
      'Pesquisadores alertam que a amostra atual é pequena e desigual para qualquer conclusão definitiva.'
    ],reactions:[['Informativa',143],['Cautelosa demais',64]],comments:[
      {name:'Oren P.',time:'há 31 min',text:'É a primeira matéria que separa claramente observação de hipótese.',agree:126,disagree:6},
      {name:'Sira D.',time:'há 20 min',text:'Cautela demais. Trinta e uma falhas repetidas já são um padrão, mesmo sem mecanismo conhecido.',agree:71,disagree:32}
    ]},
    dt:{section:'Cotidiano',eyebrow:'Escolas · 07:40',title:'Inspeções sazonais das unidades DT continuam nas escolas',deck:'A manutenção pode deixar painéis laterais abertos temporariamente sem interromper as aulas.',meta:'2 min de leitura · Editoria local',body:[
      'Equipes técnicas continuam a inspeção sazonal das unidades Distant Trees instaladas em escolas. Durante o procedimento, o painel lateral pode permanecer aberto enquanto o equipamento é testado.',
      'Unidades DT também são usadas em residências e outros edifícios. Elas aumentam a disponibilidade local de Fryóxido e ajudam a controlar a retenção de calor, voltando ao funcionamento normal após a liberação técnica.'
    ],reactions:[['Útil',64],['Rotina',39]],comments:[
      {name:'Neli S.',time:'há 24 min',text:'O painel aberto preocupou alguns responsáveis ontem. As escolas deveriam enviar esta explicação diretamente.',agree:58,disagree:5},
      {name:'Caio L.',time:'há 17 min',text:'A unidade do nosso prédio foi inspecionada na semana passada e levou menos de uma hora.',agree:31,disagree:2}
    ]},
    weather:{section:'Clima',eyebrow:'Previsão · 06:55',title:'Manhã começa com 11 °V e condições estáveis',deck:'Não há previsão de mudança significativa durante a primeira metade do dia.',meta:'1 min de leitura · Editoria de clima',body:[
      'A manhã começou com 11 °V, dentro da faixa esperada para a estação. Os serviços públicos operam normalmente.',
      'A neve dos últimos dias continua derretendo em áreas de sombra, onde as calçadas podem permanecer molhadas durante a manhã.'
    ],reactions:[['Útil',35],['Rotina',28]],comments:[
      {name:'Tessa R.',time:'há 34 min',text:'Frio o bastante para eu me arrepender de ter deixado o casaco na escola ontem.',agree:22,disagree:1},
      {name:'Eli V.',time:'há 29 min',text:'A calçada sombreada do meu prédio ainda está escorregadia. Tempo estável não significa chão seco.',agree:37,disagree:6}
    ]},
    conde:{section:'Ciência',eyebrow:'Calendário sazonal · 06:31',title:'Ilha do Conde deve entrar em atividade em cerca de cinco meses',deck:'Monitoramento anual começa cedo enquanto a ilha se aproxima do ciclo de verão conhecido simplesmente como Conde.',meta:'4 min de leitura · Editoria de ciência e cultura',body:[
      'A Ilha do Conde deve entrar em seu período anual de atividade em cerca de cinco meses, quando o verão já fizer parte do calendário. Equipes de monitoramento acompanham fissuras, calor e deslocamento de vapor antes do início do Dia 1.',
      'O nome da ilha vem do relato mais conhecido sobre o explorador Isaac Conde Juan. Segundo a lenda, ele encontrou e registrou a ilha durante a primeira expedição.',
      'Na segunda visita, a ilha entrou em atividade e Conde Juan morreu. A história se tornou inseparável do evento sazonal, hoje reduzido na fala cotidiana a Conde.',
      'As autoridades afirmam que o aviso atual faz parte da preparação de rotina e não indica atividade fora do ciclo esperado.'
    ],reactions:[['Interessante',173],['Preocupante',48],['Lenda',91]],comments:[
      {name:'Ari S.',time:'há 41 min',text:'Na minha família falam “Conde Juan”, nunca “Ilha do Conde”. Eu não conhecia a história do registro.',agree:87,disagree:13},
      {name:'Bela O.',time:'há 33 min',text:'Chamar de lenda não muda o fato de a ilha entrar em atividade todo ano.',agree:69,disagree:8},
      {name:'Ravi C.',time:'há 22 min',text:'Faltam cinco meses e já tem gente reclamando do calor.',agree:44,disagree:3}
    ]},
    transit:{section:'Cotidiano',eyebrow:'Serviços urbanos · 06:18',title:'Transporte urbano continua operando durante oscilações na rede',deck:'Veículos seguem circulando enquanto alguns painéis podem atualizar com atraso.',meta:'2 min de leitura · Editoria de serviço',body:[
      'O transporte urbano continua operando enquanto falhas intermitentes atingem partes da rede local. Ônibus e outros veículos seguiram circulando durante a manhã.',
      'Operadores recomendam seguir os avisos das plataformas quando a estimativa do celular não corresponder ao painel da estação.'
    ],reactions:[['Útil',52],['Duvidosa',23]],comments:[
      {name:'Lian T.',time:'há 46 min',text:'“Intervalos regulares” não chegaram ao meu ponto. Dois veículos passaram juntos depois de um atraso longo.',agree:63,disagree:11},
      {name:'Jo M.',time:'há 38 min',text:'Aqui o aviso da plataforma estava certo; a estimativa do celular não.',agree:29,disagree:2}
    ]},
    classes:{section:'Cotidiano',eyebrow:'Educação · ontem',title:'Escolas mantêm aulas enquanto redes internas passam por verificação',deck:'Sistemas administrativos podem ficar mais lentos, mas os horários de aula não foram alterados.',meta:'2 min de leitura · Editoria de educação',body:[
      'As escolas mantêm os horários regulares enquanto equipes técnicas verificam redes locais e painéis de comunicação.',
      'O trabalho é separado das inspeções sazonais dos DT. As famílias serão notificadas diretamente caso alguma unidade altere a programação.'
    ],reactions:[['Útil',41],['Desnecessária',12]],comments:[
      {name:'Mina F.',time:'ontem',text:'Mandem os avisos antes de os estudantes chegarem, não depois da primeira aula.',agree:74,disagree:5},
      {name:'Teo G.',time:'ontem',text:'Na nossa escola funcionou tudo normalmente hoje.',agree:21,disagree:4}
    ]},
    community:{section:'Cotidiano',eyebrow:'Cidade · ontem',title:'Rotina continua enquanto boletins marítimos viram presença constante',deck:'Provas, jogos, almoço e tarefas dividem a atenção com o aumento dos casos.',meta:'3 min de leitura · Editoria de cidade',body:[
      'Atualizações marítimas agora aparecem durante todo o dia em televisões escolares, vitrines, painéis públicos e aparelhos pessoais.',
      'Ao mesmo tempo, a rotina comum continua. Estudantes conversam sobre provas e jogos, lojas permanecem abertas e a maioria das pessoas olha para as telas apenas de passagem.'
    ],reactions:[['Observada',46],['Preocupante',22]],comments:[
      {name:'Vera I.',time:'ontem',text:'Não dá para parar a cidade sempre que o número muda, mas fingir que não está olhando também não é calma.',agree:35,disagree:8},
      {name:'Noel B.',time:'ontem',text:'A parte estranha é a rapidez com que um novo total virou ruído de fundo.',agree:61,disagree:3}
    ]}
  };

  const extraArticles=EN?[
    {id:'cases24',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · previous update',title:'Confirmed cases reached 24 before the latest increase',deck:'One additional vessel was recorded after the total remained at 23 through most of the day.',meta:'2 min read · Maritime archive',body:['The maritime bulletin recorded 24 vessels without navigation capacity. The previous confirmed total was 23.','The event remained under analysis, with no common cause established. The next update raised the count to 31.'],comment:{name:'Ema V.',time:'yesterday',text:'The jump from 24 to 31 matters more than the single case before it. The timeline should stay visible.',agree:56,disagree:4}},
    {id:'cases23',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · update 23',title:'Twenty-third vessel added while investigation remains open',deck:'The new point appeared on the public map without a change in classification.',meta:'2 min read · Maritime archive',body:['A twenty-third vessel was added to the confirmed-case map after another day of technical checks.','Officials kept the events under analysis. The public record showed the number and position of confirmed cases, but no definitive explanation.'],comment:{name:'Lio C.',time:'2 days ago',text:'A map without the time each point appeared hides half of the story.',agree:43,disagree:6}},
    {id:'cases22',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · morning bulletin',title:'Morning bulletin confirmed 22 vessels unable to navigate',deck:'The number increased before the first school period; public routines continued normally.',meta:'2 min read · Maritime archive',body:['The morning bulletin opened with 22 confirmed maritime cases. The vessels remained stationary at separate points in the ocean.','No alert level was changed. Investigation teams continued collecting technical information from the affected ships.'],comment:{name:'Nilo F.',time:'2 days ago',text:'Separate points make coincidence harder to believe, but they still do not prove one cause.',agree:39,disagree:9}},
    {id:'cases20',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · short update',title:'Twentieth case appeared in the ticker without interrupting programming',deck:'The quiet update marked another increase in the number of stopped vessels.',meta:'1 min read · Maritime archive',body:['The twentieth confirmed maritime case was added through a small on-screen ticker. Regular programming continued without a breaking-news interruption.','The understated update reflected a week in which the number kept rising while public attention began to fragment.'],comment:{name:'Mira P.',time:'3 days ago',text:'Not interrupting the program made it feel ordinary. That was the unsettling part.',agree:68,disagree:7}},
    {id:'cases19',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · midday',title:'Nineteen vessels remain motionless as searches find no precedent',deck:'Public searches return accidents and port failures, but nothing with the same pattern.',meta:'3 min read · Maritime archive',body:['The confirmed total reached 19 vessels, all still motionless at different points in the ocean.','Searches through public records found accidents, port failures, and storm damage, but no event matching the current sequence. The absence of a match is not evidence of a common cause.'],comment:{name:'Sena R.',time:'3 days ago',text:'If there is no precedent, the archive should say how far back the search actually goes.',agree:71,disagree:5}},
    {id:'cases18',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · morning',title:'Eighteen confirmed cases dominate screens across the city',deck:'Shop windows, public panels, and personal devices carried the same ocean map.',meta:'2 min read · City and ocean desks',body:['The confirmed total reached 18 by morning. The update appeared on electronics-store displays, public transport panels, and personal devices.','The vessels were not clustered around a single port. Their positions remained part of the investigation, not an explanation for it.'],comment:{name:'Ira D.',time:'3 days ago',text:'I saw the number at a bus stop before I saw the route time.',agree:34,disagree:2}},
    {id:'cases17',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · evening',title:'Map expands to 17 confirmed maritime cases',deck:'The points remained distant from one another as analysts rejected early conclusions.',meta:'2 min read · Maritime archive',body:['The evening update brought the confirmed total to 17. The public map showed the cases distributed across distant areas.','Analysts repeated that distance alone could neither prove nor rule out a shared mechanism. The events remained under analysis.'],comment:{name:'Cora T.',time:'4 days ago',text:'Every channel shows the dots, but almost none explains what data comes from the ships.',agree:62,disagree:6}},
    {id:'cases11',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · afternoon',title:'Confirmed total rises to 11 as specialists urge caution',deck:'Different explanations circulate, but every channel reaches the same point: a conclusion would be premature.',meta:'3 min read · Maritime archive',body:['The number of confirmed stopped vessels rose to 11 during the afternoon. Commentators discussed electronic failure, solar activity, and magnetic interference.','None of those explanations was presented as established. Specialists said the available information was still insufficient for a definitive interpretation.'],comment:{name:'Lena B.',time:'4 days ago',text:'Caution is correct. Repeating three guesses all day is not the same as explaining anything.',agree:75,disagree:12}},
    {id:'cases7',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · first day',title:'Seven cases confirmed by the end of the school day',deck:'More points appeared on the map while most passersby kept moving.',meta:'2 min read · Maritime archive',body:['Seven similar maritime cases had been confirmed by the end of the school day. The count had increased from the morning’s first reports.','Authorities emphasized that a confirmed event is not the same as a confirmed explanation. Teams continued gathering information.'],comment:{name:'Tavi M.',time:'4 days ago',text:'Seven confirmed events and zero confirmed causes. Those are two different numbers.',agree:48,disagree:3}},
    {id:'firstfour',category:'ocean',section:'Ocean',eyebrow:'Maritime archive · first bulletin',title:'Fourth vessel loses navigation capacity in a single morning',deck:'Teams were sent to the latest location; the event was classified as under analysis.',meta:'2 min read · Maritime archive',body:['Authorities confirmed a fourth case similar to the first three reports. All involved vessels that had lost navigation capacity and remained motionless.','Technical teams were sent to the latest location. At that stage, officials did not state that the four ships had stopped for the same reason.'],comment:{name:'Ola N.',time:'4 days ago',text:'Four in one morning was when this stopped looking like an ordinary breakdown.',agree:81,disagree:14}},
    {id:'networkreturn',category:'everyday',section:'Everyday life',eyebrow:'Network · 12:06',title:'Messages arrive in batches after school network returns',deck:'Delayed notices, videos, and updates reached devices almost at once during the break.',meta:'2 min read · Technology desk',body:['Connectivity returned after an intermittent period and released queued messages across school devices.','The restoration appeared stable, although some pages continued to load slowly later in the day. Localized interruptions may recur during network-stabilization procedures.'],comment:{name:'Rina A.',time:'52 min ago',text:'Everything arrived at once and made it look like ten people had written at the same second.',agree:29,disagree:1}},
    {id:'powernotice',category:'everyday',section:'Services',eyebrow:'Energy · 11:34',title:'Localized fluctuations may occur during network stabilization',deck:'Public notice asks residents to expect brief interruptions while procedures continue.',meta:'2 min read · Service desk',body:['A public notice warned that localized fluctuations may occur during network-stabilization procedures.','Brief interruptions can affect lighting, communication panels, and building systems. The notice did not announce a general shutdown.'],comment:{name:'Dero S.',time:'1 hr ago',text:'“Localized” is doing a lot of work. Publish the affected zones before the power drops.',agree:88,disagree:11}},
    {id:'signalout',category:'everyday',section:'Mobility',eyebrow:'Traffic · 10:48',title:'Worker directs traffic manually after signal loses power',deck:'Vehicles continued through the crossing while the electronic signal remained off.',meta:'1 min read · Mobility desk',body:['A traffic worker took manual control of a crossing after its signal lost power during the morning.','Nearby shops remained open, and traffic continued with a temporary reduction in speed. Technical teams were notified.'],comment:{name:'Vani E.',time:'1 hr ago',text:'The worker handled it well. Drivers ignoring the first signal were the real delay.',agree:46,disagree:3}},
    {id:'publicscreens',category:'everyday',section:'Media',eyebrow:'City · 10:15',title:'Public screens balance route information with maritime updates',deck:'Transport panels continue showing schedules while a news ticker tracks vessel cases.',meta:'2 min read · City desk',body:['Public displays are carrying maritime updates beneath their normal information, including transport schedules and service notices.','The format keeps the main service visible while allowing confirmed-case totals to be updated without replacing the entire screen.'],comment:{name:'Nara Q.',time:'1 hr ago',text:'Keep the route time larger than the news ticker. People still need to catch the bus.',agree:57,disagree:5}},
    {id:'snowmelt',category:'everyday',section:'Weather',eyebrow:'Winter · 09:42',title:'Melting snow leaves wet patches on shaded sidewalks',deck:'Temperatures remain stable, but areas with little sunlight may stay slippery.',meta:'1 min read · Weather desk',body:['Snow from recent days is melting along streets and vehicle edges. Water has collected in some shaded sections.','Pedestrians should expect wet surfaces through the morning. No significant new snowfall was included in the latest forecast.'],comment:{name:'Eli P.',time:'1 hr ago',text:'The corner by the market needs drainage, not another warning.',agree:52,disagree:8}},
    {id:'cityroutine',category:'everyday',section:'Everyday life',eyebrow:'Commerce · 09:10',title:'Markets, pharmacies, and restaurants keep regular service',deck:'Businesses remain open despite brief interruptions in the local network.',meta:'2 min read · Local desk',body:['Markets, pharmacies, and restaurants opened on their regular schedules this morning.','Some payment and information systems took longer to reconnect after brief network interruptions, but no general closure was reported.'],comment:{name:'Mael G.',time:'2 hrs ago',text:'The pharmacy opened normally, but its queue doubled when the network stalled.',agree:33,disagree:2}},
    {id:'dtfilters',category:'everyday',section:'Buildings',eyebrow:'Maintenance · 08:32',title:'Technicians replace filters in building-mounted DT units',deck:'Facade work is part of the same seasonal maintenance cycle used in schools and homes.',meta:'2 min read · Infrastructure desk',body:['Technical teams were seen replacing filters in a Distant Trees unit mounted to a building facade.','DT units are used in homes, schools, and other buildings to increase local Fryoxide availability and help control heat retention.'],comment:{name:'Soli H.',time:'2 hrs ago',text:'Please publish how residents can check the next inspection date for their building.',agree:64,disagree:4}},
    {id:'navigationloss',category:'science',section:'Science',eyebrow:'Explainer · 08:04',title:'What “loss of navigation capacity” means in the maritime bulletins',deck:'The phrase describes the confirmed condition of the vessels, not its cause.',meta:'4 min read · Science desk',body:['The public bulletins use “loss of navigation capacity” for vessels that can no longer continue their route and remain motionless.','The description does not determine whether propulsion, control, communication, or another system failed first. Those questions remain under analysis.'],comment:{name:'Tero J.',time:'2 hrs ago',text:'This distinction should have been in the first bulletin.',agree:91,disagree:3}},
    {id:'premature',category:'science',section:'Science',eyebrow:'Analysis · 07:48',title:'Why a rising case count still does not establish a common cause',deck:'Frequency strengthens the need to investigate, but it does not replace evidence about mechanism.',meta:'4 min read · Science desk',body:['A rapid increase can show that an event deserves broader investigation. It cannot, by itself, demonstrate that every case came from one source.','A shared cause requires compatible technical evidence, timing, and mechanisms. Until those links are established, the events remain under analysis.'],comment:{name:'Cira O.',time:'2 hrs ago',text:'The count is evidence of a pattern, just not evidence of the mechanism. Both can be true.',agree:104,disagree:9}},
    {id:'classifications',category:'science',section:'Knowledge',eyebrow:'Reference · yesterday',title:'Stable, under analysis, and non-integrated: how the public protocol works',deck:'The three states describe the available knowledge, not the seriousness of an event.',meta:'5 min read · Knowledge desk',body:['Stable applies to phenomena that are understood and sufficiently predictable within known parameters. Under analysis means there is data, but not enough information for integration.','Non-integrated is used for a confirmed phenomenon that existing models cannot adequately explain. It does not mean that investigation has ended.'],comment:{name:'Iris L.',time:'yesterday',text:'People keep reading these as green, yellow, and red. They are classifications of knowledge, not danger levels.',agree:132,disagree:10}},
    {id:'fryoxide',category:'science',section:'Climate',eyebrow:'Reference · yesterday',title:'How Fryoxide helps limit heat retention',deck:'FyO₂ released through plant processes plays a central role in Theran’s thermal stability.',meta:'4 min read · Climate desk',body:['Plants participate continuously in atmospheric gas exchange. Fryoxide released through that process helps reduce heat retention.','When local FyO₂ availability falls, more heat can be retained. DT units support availability inside and around buildings, but do not replace the wider ecosystem.'],comment:{name:'Neri C.',time:'yesterday',text:'The last sentence matters. A building unit is support, not an excuse to neglect vegetation.',agree:78,disagree:2}},
    {id:'vegetation',category:'science',section:'Climate',eyebrow:'Urban systems · yesterday',title:'Why urban vegetation is treated as infrastructure',deck:'Trees and planted areas support temperature, atmosphere, humidity, and soil at the same time.',meta:'4 min read · Climate desk',body:['Urban vegetation is planned as part of essential infrastructure rather than as decoration alone.','Coverage affects local temperature, atmospheric exchange, humidity, and soil stability. Maintenance therefore combines biological and engineering work.'],comment:{name:'Luma R.',time:'yesterday',text:'This is why removing one planted strip always creates work somewhere else.',agree:59,disagree:5}},
    {id:'heatcycle',category:'science',section:'Climate history',eyebrow:'Archive · yesterday',title:'Historic warming followed a self-reinforcing loss of vegetation',deck:'Less plant cover reduced Fryoxide availability, increasing retained heat and further stressing vegetation.',meta:'5 min read · Climate history desk',body:['During the First Period of Urban Expansion, large areas of vegetation were removed before the full atmospheric impact was understood.','The resulting cycle was simple and destructive: fewer plants, less FyO₂, more retained heat, and further plant loss. Recovery took decades.'],comment:{name:'Toma F.',time:'yesterday',text:'The mechanism sounds obvious now because we already know the result. That does not mean it was easy to stop.',agree:83,disagree:7}},
    {id:'record26',category:'science',section:'Climate history',eyebrow:'Archive · yesterday',title:'Why 26 °V remains Theran’s historic temperature reference',deck:'The highest recorded value marks the extreme edge of the planet’s climate history.',meta:'3 min read · Climate history desk',body:['Twenty-six degrees Veyr remains the highest temperature recorded during the historic warming period.','The value is not a normal summer benchmark. It marks conditions in which prolonged outdoor exposure already required care.'],comment:{name:'Meli D.',time:'yesterday',text:'Every summer someone quotes 26 °V as if it were ordinary. It never was.',agree:96,disagree:4}},
    {id:'schooloutage',category:'education',section:'Education',eyebrow:'Schools · yesterday',title:'Classes resume after brief loss of power and network access',deck:'Lighting, projectors, information panels, and a DT unit stopped during the interruption.',meta:'2 min read · Education desk',body:['A brief interruption cut power to classroom lighting, a projector, an electronic door panel, and a Distant Trees unit.','Classes resumed after the systems returned. Staff treated the event as a technical interruption and kept the rest of the school schedule unchanged.'],comment:{name:'Vera S.',time:'yesterday',text:'The class resumed before the network did. Paper still wins occasionally.',agree:45,disagree:2}},
    {id:'climatelesson',category:'education',section:'Education',eyebrow:'Classroom · yesterday',title:'Science lessons revisit Fryoxide and the First Urban Expansion',deck:'Students connect plant loss, atmospheric change, and the recovery that reshaped Theran’s cities.',meta:'3 min read · Education desk',body:['Science classes are revisiting the historic link between vegetation loss, reduced FyO₂, and increased heat retention.','The lesson also examines why modern school grounds include extensive plant cover and why Distant Trees units are treated as infrastructure.'],comment:{name:'Lena U.',time:'yesterday',text:'Teach the cycle with the city outside the window. It makes more sense than a page of definitions.',agree:67,disagree:3}}
  ]:[
    {id:'cases24',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · atualização anterior',title:'Casos confirmados chegaram a 24 antes do aumento mais recente',deck:'Uma nova embarcação foi registrada depois de o total permanecer em 23 durante boa parte do dia.',meta:'2 min de leitura · Arquivo marítimo',body:['O boletim marítimo registrou 24 embarcações sem capacidade de navegação. O total confirmado anterior era de 23.','Os eventos permaneciam em análise, sem uma causa comum estabelecida. A atualização seguinte elevou a contagem para 31.'],comment:{name:'Ema V.',time:'ontem',text:'O salto de 24 para 31 importa mais que o caso isolado anterior. A linha do tempo deveria continuar visível.',agree:56,disagree:4}},
    {id:'cases23',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · atualização 23',title:'Vigésima terceira embarcação entra no mapa enquanto investigação continua',deck:'O novo ponto apareceu no mapa público sem alteração na classificação.',meta:'2 min de leitura · Arquivo marítimo',body:['Uma vigésima terceira embarcação foi adicionada ao mapa de casos confirmados após outro dia de verificações técnicas.','As autoridades mantiveram os eventos em análise. O registro público mostrava o número e a posição dos casos, mas nenhuma explicação definitiva.'],comment:{name:'Lio C.',time:'há 2 dias',text:'Um mapa sem o horário em que cada ponto apareceu esconde metade da história.',agree:43,disagree:6}},
    {id:'cases22',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · boletim da manhã',title:'Boletim da manhã confirmou 22 embarcações sem navegação',deck:'O número aumentou antes da primeira aula; a rotina pública continuou normalmente.',meta:'2 min de leitura · Arquivo marítimo',body:['O boletim da manhã abriu com 22 casos marítimos confirmados. As embarcações permaneciam imóveis em pontos separados do oceano.','Nenhum nível de alerta foi alterado. Equipes de investigação continuaram reunindo informações técnicas dos navios afetados.'],comment:{name:'Nilo F.',time:'há 2 dias',text:'Pontos separados dificultam chamar de coincidência, mas ainda não provam uma causa única.',agree:39,disagree:9}},
    {id:'cases20',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · atualização breve',title:'Vigésimo caso apareceu na faixa sem interromper a programação',deck:'A atualização discreta marcou outro aumento no número de embarcações paradas.',meta:'1 min de leitura · Arquivo marítimo',body:['O vigésimo caso marítimo confirmado foi incluído por uma pequena faixa na tela. A programação regular continuou sem plantão.','A atualização discreta refletiu uma semana em que o número continuava subindo enquanto a atenção pública começava a se dividir.'],comment:{name:'Mira P.',time:'há 3 dias',text:'Não interromper a programação fez parecer normal. Essa foi a parte inquietante.',agree:68,disagree:7}},
    {id:'cases19',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · meio-dia',title:'Dezenove embarcações seguem imóveis enquanto buscas não encontram precedente',deck:'Registros públicos mostram acidentes e falhas em portos, mas nada com o mesmo padrão.',meta:'3 min de leitura · Arquivo marítimo',body:['O total confirmado chegou a 19 embarcações, todas ainda imóveis em diferentes pontos do oceano.','Buscas em registros públicos encontraram acidentes, falhas em portos e danos por tempestades, mas nenhum evento igual à sequência atual. A ausência de registro semelhante não prova uma causa comum.'],comment:{name:'Sena R.',time:'há 3 dias',text:'Se não há precedente, o arquivo deveria dizer até onde a busca realmente voltou.',agree:71,disagree:5}},
    {id:'cases18',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · manhã',title:'Dezoito casos confirmados dominam as telas pela cidade',deck:'Vitrines, painéis públicos e celulares exibiram o mesmo mapa do oceano.',meta:'2 min de leitura · Editorias de cidade e oceano',body:['O total confirmado chegou a 18 pela manhã. A atualização apareceu em vitrines de eletrônicos, painéis de transporte e aparelhos pessoais.','As embarcações não estavam agrupadas ao redor de um único porto. As posições continuavam sendo parte da investigação, não uma explicação.'],comment:{name:'Ira D.',time:'há 3 dias',text:'Vi o número no ponto de ônibus antes de ver o horário da linha.',agree:34,disagree:2}},
    {id:'cases17',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · noite',title:'Mapa se amplia para 17 casos marítimos confirmados',deck:'Os pontos permaneciam distantes enquanto analistas rejeitavam conclusões precoces.',meta:'2 min de leitura · Arquivo marítimo',body:['A atualização da noite elevou o total confirmado para 17. O mapa público mostrava casos distribuídos por áreas distantes.','Analistas repetiram que a distância, sozinha, não poderia provar nem descartar um mecanismo compartilhado. Os eventos continuavam em análise.'],comment:{name:'Cora T.',time:'há 4 dias',text:'Todos os canais mostram os pontos, mas quase nenhum explica quais dados vêm dos navios.',agree:62,disagree:6}},
    {id:'cases11',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · tarde',title:'Total confirmado sobe para 11 enquanto especialistas pedem cautela',deck:'Explicações diferentes circulam, mas todos os canais chegam ao mesmo ponto: concluir agora seria prematuro.',meta:'3 min de leitura · Arquivo marítimo',body:['O número de embarcações paradas confirmadas subiu para 11 durante a tarde. Comentaristas discutiram falha eletrônica, atividade solar e interferência magnética.','Nenhuma dessas explicações foi apresentada como estabelecida. Especialistas disseram que as informações ainda eram insuficientes para uma interpretação definitiva.'],comment:{name:'Lena B.',time:'há 4 dias',text:'Cautela está certa. Repetir três palpites o dia inteiro não é explicar nada.',agree:75,disagree:12}},
    {id:'cases7',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · primeiro dia',title:'Sete casos confirmados até o fim das aulas',deck:'Mais pontos apareceram no mapa enquanto a maioria das pessoas continuava andando.',meta:'2 min de leitura · Arquivo marítimo',body:['Sete casos marítimos semelhantes haviam sido confirmados até o fim das aulas. A contagem tinha aumentado desde os primeiros registros da manhã.','As autoridades reforçaram que confirmar um evento não é o mesmo que confirmar uma explicação. As equipes continuaram reunindo informações.'],comment:{name:'Tavi M.',time:'há 4 dias',text:'Sete eventos confirmados e zero causas confirmadas. São dois números diferentes.',agree:48,disagree:3}},
    {id:'firstfour',category:'ocean',section:'Oceano',eyebrow:'Arquivo marítimo · primeiro boletim',title:'Quarta embarcação perde capacidade de navegação na mesma manhã',deck:'Equipes foram enviadas ao local; o evento foi classificado como em análise.',meta:'2 min de leitura · Arquivo marítimo',body:['As autoridades confirmaram um quarto caso semelhante aos três primeiros. Todos envolviam embarcações que perderam a capacidade de navegação e permaneceram imóveis.','Equipes técnicas foram enviadas ao local mais recente. Naquele momento, ninguém afirmou que os quatro navios tinham parado pela mesma razão.'],comment:{name:'Ola N.',time:'há 4 dias',text:'Quatro na mesma manhã foi quando isso deixou de parecer uma falha comum.',agree:81,disagree:14}},
    {id:'networkreturn',category:'everyday',section:'Cotidiano',eyebrow:'Rede · 12:06',title:'Mensagens chegam em lote depois que rede escolar retorna',deck:'Avisos, vídeos e atualizações atrasados chegaram quase ao mesmo tempo durante o intervalo.',meta:'2 min de leitura · Editoria de tecnologia',body:['A conexão voltou após um período intermitente e liberou mensagens acumuladas nos aparelhos da escola.','O retorno pareceu estável, embora algumas páginas ainda carregassem lentamente mais tarde. Interrupções localizadas podem se repetir durante procedimentos de estabilização.'],comment:{name:'Rina A.',time:'há 52 min',text:'Chegou tudo junto e pareceu que dez pessoas tinham escrito no mesmo segundo.',agree:29,disagree:1}},
    {id:'powernotice',category:'everyday',section:'Serviços',eyebrow:'Energia · 11:34',title:'Oscilações localizadas podem ocorrer durante estabilização da rede',deck:'Aviso público pede que moradores esperem interrupções breves enquanto os procedimentos continuam.',meta:'2 min de leitura · Editoria de serviço',body:['Um aviso público informou que oscilações localizadas podem ocorrer durante procedimentos de estabilização da rede.','Interrupções breves podem afetar iluminação, painéis de comunicação e sistemas prediais. O aviso não anuncia um desligamento geral.'],comment:{name:'Dero S.',time:'há 1 h',text:'“Localizadas” está carregando a nota inteira nas costas. Publiquem as áreas antes de a energia cair.',agree:88,disagree:11}},
    {id:'signalout',category:'everyday',section:'Mobilidade',eyebrow:'Trânsito · 10:48',title:'Funcionário orienta trânsito após semáforo ficar sem energia',deck:'Veículos continuaram atravessando o cruzamento enquanto o sinal eletrônico permanecia apagado.',meta:'1 min de leitura · Editoria de mobilidade',body:['Um funcionário assumiu manualmente o controle de um cruzamento depois que o semáforo ficou sem energia durante a manhã.','Lojas próximas continuaram abertas e o trânsito seguiu com redução temporária de velocidade. Equipes técnicas foram acionadas.'],comment:{name:'Vani E.',time:'há 1 h',text:'O funcionário resolveu bem. Os motoristas que ignoraram o primeiro sinal foram o verdadeiro atraso.',agree:46,disagree:3}},
    {id:'publicscreens',category:'everyday',section:'Mídia',eyebrow:'Cidade · 10:15',title:'Painéis públicos dividem espaço entre horários e atualização marítima',deck:'Telas de transporte mantêm o serviço principal enquanto uma faixa acompanha os casos.',meta:'2 min de leitura · Editoria de cidade',body:['Painéis públicos exibem atualizações marítimas abaixo das informações normais, incluindo horários de transporte e avisos de serviço.','O formato preserva o serviço principal enquanto permite atualizar o total de casos confirmados sem substituir a tela inteira.'],comment:{name:'Nara Q.',time:'há 1 h',text:'Deixem o horário da linha maior que a faixa do jornal. As pessoas ainda precisam pegar o ônibus.',agree:57,disagree:5}},
    {id:'snowmelt',category:'everyday',section:'Clima',eyebrow:'Inverno · 09:42',title:'Neve derretendo deixa trechos molhados em calçadas sombreadas',deck:'A temperatura permanece estável, mas áreas com pouco sol podem continuar escorregadias.',meta:'1 min de leitura · Editoria de clima',body:['A neve dos últimos dias está derretendo nas ruas e nas bordas dos veículos. A água se acumulou em alguns trechos sombreados.','Pedestres devem encontrar superfícies molhadas durante a manhã. A previsão mais recente não indica nova queda significativa de neve.'],comment:{name:'Eli P.',time:'há 1 h',text:'A esquina do mercado precisa de drenagem, não de outro aviso.',agree:52,disagree:8}},
    {id:'cityroutine',category:'everyday',section:'Cotidiano',eyebrow:'Comércio · 09:10',title:'Mercados, farmácias e restaurantes mantêm atendimento regular',deck:'Estabelecimentos continuam abertos apesar de interrupções breves na rede local.',meta:'2 min de leitura · Editoria local',body:['Mercados, farmácias e restaurantes abriram nos horários regulares nesta manhã.','Alguns sistemas de pagamento e informação demoraram mais para reconectar após interrupções breves, mas não houve fechamento geral.'],comment:{name:'Mael G.',time:'há 2 h',text:'A farmácia abriu normalmente, mas a fila dobrou quando a rede travou.',agree:33,disagree:2}},
    {id:'dtfilters',category:'everyday',section:'Edifícios',eyebrow:'Manutenção · 08:32',title:'Técnicos substituem filtros em unidades DT instaladas em fachadas',deck:'O serviço faz parte do mesmo ciclo sazonal de manutenção usado em escolas e residências.',meta:'2 min de leitura · Editoria de infraestrutura',body:['Equipes técnicas substituíram filtros de uma unidade Distant Trees presa à fachada de um edifício.','Unidades DT são usadas em residências, escolas e outros prédios para aumentar a disponibilidade local de Fryóxido e ajudar no controle da retenção de calor.'],comment:{name:'Soli H.',time:'há 2 h',text:'Divulguem onde os moradores consultam a próxima inspeção do prédio.',agree:64,disagree:4}},
    {id:'navigationloss',category:'science',section:'Ciência',eyebrow:'Entenda · 08:04',title:'O que significa “perda da capacidade de navegação” nos boletins',deck:'A expressão descreve a condição confirmada das embarcações, não a causa.',meta:'4 min de leitura · Editoria de ciência',body:['Os boletins públicos usam “perda da capacidade de navegação” para embarcações que não conseguem continuar a rota e permanecem imóveis.','A descrição não determina se propulsão, controle, comunicação ou outro sistema falhou primeiro. Essas questões continuam em análise.'],comment:{name:'Tero J.',time:'há 2 h',text:'Essa diferença deveria estar no primeiro boletim.',agree:91,disagree:3}},
    {id:'premature',category:'science',section:'Ciência',eyebrow:'Análise · 07:48',title:'Por que o aumento de casos ainda não estabelece uma causa comum',deck:'A frequência reforça a necessidade de investigar, mas não substitui evidências sobre o mecanismo.',meta:'4 min de leitura · Editoria de ciência',body:['Um aumento rápido mostra que um evento exige investigação mais ampla. Sozinho, ele não demonstra que todos os casos vieram da mesma origem.','Uma causa compartilhada exige evidências técnicas, temporais e mecanismos compatíveis. Até que essas ligações sejam demonstradas, os eventos permanecem em análise.'],comment:{name:'Cira O.',time:'há 2 h',text:'A contagem é evidência de padrão, só não é evidência do mecanismo. As duas coisas podem ser verdade.',agree:104,disagree:9}},
    {id:'classifications',category:'science',section:'Conhecimento',eyebrow:'Referência · ontem',title:'Estável, em análise e não-integrado: como funciona o protocolo público',deck:'Os três estados descrevem o conhecimento disponível, não a gravidade de um evento.',meta:'5 min de leitura · Editoria de conhecimento',body:['Estável se aplica a fenômenos compreendidos e suficientemente previsíveis dentro dos parâmetros conhecidos. Em análise significa que há dados, mas ainda não há informação suficiente para integração.','Não-integrado é usado para um fenômeno confirmado que os modelos existentes não conseguem explicar adequadamente. Isso não significa que a investigação terminou.'],comment:{name:'Iris L.',time:'ontem',text:'As pessoas leem isso como verde, amarelo e vermelho. São classificações de conhecimento, não níveis de perigo.',agree:132,disagree:10}},
    {id:'fryoxide',category:'science',section:'Clima',eyebrow:'Referência · ontem',title:'Como o Fryóxido ajuda a limitar a retenção de calor',deck:'O FyO₂ liberado por processos vegetais tem papel central na estabilidade térmica de Theran.',meta:'4 min de leitura · Editoria de clima',body:['As plantas participam continuamente das trocas gasosas da atmosfera. O Fryóxido liberado nesse processo ajuda a reduzir a retenção de calor.','Quando a disponibilidade local de FyO₂ cai, mais calor pode ser retido. Unidades DT apoiam a disponibilidade dentro e ao redor de edifícios, mas não substituem o ecossistema mais amplo.'],comment:{name:'Neri C.',time:'ontem',text:'A última frase importa. Unidade predial é apoio, não desculpa para abandonar vegetação.',agree:78,disagree:2}},
    {id:'vegetation',category:'science',section:'Clima',eyebrow:'Sistemas urbanos · ontem',title:'Por que a vegetação urbana é tratada como infraestrutura',deck:'Árvores e áreas plantadas sustentam temperatura, atmosfera, umidade e solo ao mesmo tempo.',meta:'4 min de leitura · Editoria de clima',body:['A vegetação urbana é planejada como parte da infraestrutura essencial, não apenas como decoração.','A cobertura afeta temperatura local, trocas atmosféricas, umidade e estabilidade do solo. A manutenção combina trabalho biológico e engenharia.'],comment:{name:'Luma R.',time:'ontem',text:'Por isso retirar uma faixa plantada sempre cria trabalho em outro lugar.',agree:59,disagree:5}},
    {id:'heatcycle',category:'science',section:'História climática',eyebrow:'Arquivo · ontem',title:'Aquecimento histórico seguiu ciclo de perda contínua de vegetação',deck:'Menos plantas reduziram o Fryóxido, aumentando o calor retido e pressionando ainda mais a vegetação.',meta:'5 min de leitura · Editoria de história climática',body:['Durante o Primeiro Período de Expansão Urbana, grandes áreas de vegetação foram removidas antes que o impacto atmosférico fosse completamente compreendido.','O ciclo resultante foi simples e destrutivo: menos plantas, menos FyO₂, mais calor retido e mais perda vegetal. A recuperação levou décadas.'],comment:{name:'Toma F.',time:'ontem',text:'O mecanismo parece óbvio agora porque já conhecemos o resultado. Isso não significa que era fácil interromper.',agree:83,disagree:7}},
    {id:'record26',category:'science',section:'História climática',eyebrow:'Arquivo · ontem',title:'Por que 26 °V continua sendo a referência histórica de temperatura',deck:'O maior valor registrado marca o extremo da história climática do planeta.',meta:'3 min de leitura · Editoria de história climática',body:['Vinte e seis graus Veyr continuam sendo a maior temperatura registrada durante o período histórico de aquecimento.','O valor não é uma referência comum de verão. Ele marca condições em que permanecer muito tempo ao ar livre já exigia cuidado.'],comment:{name:'Meli D.',time:'ontem',text:'Todo verão alguém cita 26 °V como se fosse normal. Nunca foi.',agree:96,disagree:4}},
    {id:'schooloutage',category:'education',section:'Educação',eyebrow:'Escolas · ontem',title:'Aulas retomam após queda breve de energia e conexão',deck:'Lâmpadas, projetor, painel informativo e uma unidade DT pararam durante a interrupção.',meta:'2 min de leitura · Editoria de educação',body:['Uma interrupção breve desligou a iluminação de uma sala, o projetor, o painel eletrônico da porta e uma unidade Distant Trees.','As aulas foram retomadas quando os sistemas voltaram. A equipe tratou o evento como falha técnica e manteve o restante dos horários.'],comment:{name:'Vera S.',time:'ontem',text:'A aula voltou antes da rede. Papel ainda ganha de vez em quando.',agree:45,disagree:2}},
    {id:'climatelesson',category:'education',section:'Educação',eyebrow:'Sala de aula · ontem',title:'Aulas de ciência retomam Fryóxido e a Primeira Expansão Urbana',deck:'Estudantes relacionam perda vegetal, mudança atmosférica e a recuperação que redefiniu as cidades.',meta:'3 min de leitura · Editoria de educação',body:['As aulas de ciência retomam a relação histórica entre perda de vegetação, redução de FyO₂ e aumento da retenção de calor.','O conteúdo também mostra por que os pátios escolares modernos concentram cobertura vegetal e por que unidades Distant Trees são tratadas como infraestrutura.'],comment:{name:'Lena U.',time:'ontem',text:'Ensinem o ciclo usando a cidade do lado de fora. Faz mais sentido que uma página de definições.',agree:67,disagree:3}}
  ];

  const reactionLabels=EN?{
    ocean:['Useful','Worrying'],everyday:['Useful','Routine'],science:['Clear','Needs context'],education:['Relevant','Useful']
  }:{
    ocean:['Útil','Preocupante'],everyday:['Útil','Rotina'],science:['Clara','Precisa de contexto'],education:['Relevante','Útil']
  };

  extraArticles.forEach((article,index)=>{
    const labels=reactionLabels[article.category]||reactionLabels.everyday;
    article.reactions=[[labels[0],28+(index*17)%137],[labels[1],7+(index*11)%61]];
    article.comments=[article.comment];
    delete article.comment;
    newsArticles[article.id]=article;
  });

  const baseArticleCategories={ships:'ocean',ports:'ocean',crews:'ocean',hypotheses:'science',dt:'education',weather:'everyday',conde:'science',transit:'everyday',classes:'education',community:'everyday'};
  const commentNames=['Ayla N.','Breno T.','Celi R.','Dara V.','Eron M.','Fina C.','Gael P.','Hana S.','Ivo L.','Jara D.','Kian O.','Lia F.','Miro A.','Nara B.','Oren G.','Pali E.'];
  const commentBanks=EN?{
    ocean:[
      'The count is rising faster than the explanations.',
      'I understand why the event remains under analysis.',
      'The map is useful, but it makes the situation look more certain than the data is.',
      'Each update adds a number and almost no technical detail.',
      'It is possible to be cautious without pretending nothing unusual is happening.',
      'A confirmed vessel is a confirmed event, not a confirmed cause.',
      'The older bulletins make the acceleration easier to see.',
      'The public discussion keeps mixing pattern and mechanism.'
    ],
    everyday:[
      'The city is functioning, but the interruptions are no longer isolated annoyances.',
      'This is the kind of small service change people notice before an official notice.',
      'The article is useful because it says what still works, not only what failed.',
      'Calling the routine normal does not mean every neighborhood had the same morning.',
      'People still have school, work, and errands while the network fluctuates.',
      'The practical detail matters more here than the general reassurance.',
      'A short interruption can still create a long queue.',
      'The city has not stopped; it has become less predictable.'
    ],
    science:[
      'The explanation works because it separates what was observed from what was inferred.',
      'This needs the source record linked beside the summary.',
      'The article avoids turning a correlation into a cause.',
      'Historical context helps, but it should not be used as proof of a current event.',
      'The terminology is precise; its public use often is not.',
      'A simplified explanation is useful until it erases the limits of the data.',
      'The difference between support and replacement is the most important detail here.',
      'The mechanism makes sense, but the article should show which part is measured directly.'
    ],
    education:[
      'Schools need to send these notices before the first class, not after families arrive.',
      'Keeping classes running is reasonable, but the interruption still needs a clear record.',
      'The classroom example explains the subject better than isolated definitions.',
      'Students notice when a DT panel is open even if adults assume they will ignore it.',
      'A brief outage is manageable when the school explains what stopped and what did not.',
      'The lesson is stronger when it connects the building to the wider climate system.',
      'Technical maintenance and class schedules should appear in the same notice.',
      'Education reports should distinguish a local failure from a system-wide problem.'
    ],
    follow:[
      'Riva should keep the full timeline attached to the story.',
      'I want the original record, not another panel of guesses.',
      'The next update needs to state exactly what changed.',
      'The discussion should separate observation, hypothesis, and conclusion.',
      'Different parts of the city clearly had different experiences.',
      'The uncertainty belongs in the headline, not only at the end.',
      'A diagram with dates would help more than another general statement.',
      'Precise information would reduce the speculation in these comments.'
    ]
  }:{
    ocean:[
      'A contagem está subindo mais rápido que as explicações.',
      'Entendo por que o evento permanece em análise.',
      'O mapa é útil, mas faz a situação parecer mais certa do que os dados permitem.',
      'Cada atualização acrescenta um número e quase nenhum detalhe técnico.',
      'É possível ser cauteloso sem fingir que nada incomum está acontecendo.',
      'Uma embarcação confirmada é um evento confirmado, não uma causa confirmada.',
      'Os boletins antigos deixam a aceleração mais fácil de enxergar.',
      'A discussão pública continua misturando padrão e mecanismo.'
    ],
    everyday:[
      'A cidade está funcionando, mas as interrupções deixaram de ser incômodos isolados.',
      'É o tipo de pequena mudança que as pessoas percebem antes de um aviso oficial.',
      'A matéria é útil porque diz o que ainda funciona, não apenas o que falhou.',
      'Chamar a rotina de normal não significa que todos os bairros tiveram a mesma manhã.',
      'As pessoas ainda têm escola, trabalho e tarefas enquanto a rede oscila.',
      'O detalhe prático importa mais aqui que a tranquilização geral.',
      'Uma interrupção curta ainda pode criar uma fila longa.',
      'A cidade não parou; ela ficou menos previsível.'
    ],
    science:[
      'A explicação funciona porque separa o que foi observado do que foi inferido.',
      'Isso precisa do registro de origem ao lado do resumo.',
      'A matéria evita transformar correlação em causa.',
      'O contexto histórico ajuda, mas não deveria ser usado como prova de um evento atual.',
      'A terminologia é precisa; o uso público dela muitas vezes não é.',
      'Uma explicação simplificada ajuda até apagar os limites dos dados.',
      'A diferença entre suporte e substituição é o detalhe mais importante aqui.',
      'O mecanismo faz sentido, mas a matéria deveria mostrar qual parte foi medida diretamente.'
    ],
    education:[
      'As escolas precisam enviar esses avisos antes da primeira aula, não depois que as famílias chegam.',
      'Manter as aulas é razoável, mas a interrupção ainda precisa de um registro claro.',
      'O exemplo em sala explica melhor que definições isoladas.',
      'Estudantes percebem quando um painel DT está aberto, mesmo que adultos suponham o contrário.',
      'Uma queda breve é administrável quando a escola explica o que parou e o que não parou.',
      'A aula fica mais forte quando liga o prédio ao sistema climático mais amplo.',
      'Manutenção técnica e horários das aulas deveriam aparecer no mesmo aviso.',
      'Notícias de educação precisam separar falha local de problema geral.'
    ],
    follow:[
      'A Riva deveria manter a linha do tempo completa anexada à matéria.',
      'Quero o registro original, não outro painel de palpites.',
      'A próxima atualização precisa dizer exatamente o que mudou.',
      'A discussão deveria separar observação, hipótese e conclusão.',
      'Partes diferentes da cidade claramente tiveram experiências diferentes.',
      'A incerteza pertence ao título, não apenas ao fim.',
      'Um diagrama com datas ajudaria mais que outra declaração geral.',
      'Informação precisa reduziria a especulação nestes comentários.'
    ]
  };

  const stableHash=value=>[...value].reduce((total,char)=>((total*31)+char.charCodeAt(0))>>>0,7);
  Object.entries(newsArticles).forEach(([id,article])=>{
    const category=article.category||baseArticleCategories[id]||'everyday';
    const bank=commentBanks[category]||commentBanks.everyday;
    const hash=stableHash(id);
    const target=id==='ships'?8:5+(hash%4);
    const archived=/archive|arquivo|yesterday|ontem|reference|referência/i.test(article.eyebrow);
    while(article.comments.length<target){
      const index=article.comments.length;
      const minutes=6+((hash+index*13)%53);
      article.comments.push({
        name:commentNames[(hash+index*7)%commentNames.length],
        time:archived?(EN?'yesterday':'ontem'):(EN?`${minutes} min ago`:`há ${minutes} min`),
        text:`${bank[(hash+index*3)%bank.length]} ${commentBanks.follow[(hash*3+index*5)%commentBanks.follow.length]}`,
        agree:9+((hash+index*19)%118),
        disagree:1+((hash+index*7)%24)
      });
    }
  });

  let activeView='home';
  let currentThread='noah';
  let filter='all';
  let query='';
  let newsFilter='all';
  let currentArticle='ships';
  const savedArticles=new Set();
  const readerVotes=new Map();

  function escapeHTML(value){return String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}

  function updateClock(){
    const now=new Date();
    const time=$('#phoneClock');
    const compact=$('#phoneSystemTime');
    const date=$('#phoneDate');
    const formatted=now.toLocaleTimeString(EN?'en-US':'pt-BR',{hour:'2-digit',minute:'2-digit',hour12:false});
    if(time)time.textContent=formatted;
    if(compact)compact.textContent=formatted;
    if(date)date.textContent=copy.date.format(now);
  }

  function openView(name){
    if(!views.some(view=>view.dataset.phoneView===name))return;
    if(name!=='news')closeArticle();
    if(name!=='threadly')$$('.threadly-video-wrap video').forEach(video=>video.pause());
    activeView=name;
    root.dataset.activeApp=name;
    views.forEach(view=>view.classList.toggle('is-active',view.dataset.phoneView===name));
    if(name==='orin')requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
    if(name==='threadly')requestAnimationFrame(()=>$('.threadly-video-wrap video:not([hidden])')?.play().catch(()=>{}));
  }

  function showToast(message){
    const toast=$('#phoneToast');
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer=setTimeout(()=>toast.classList.remove('show'),1700);
  }

  function closeArticle(){
    const reader=$('#newsReader');
    if(!reader)return;
    reader.hidden=true;
    reader.setAttribute('aria-hidden','true');
  }

  function openArticle(id){
    const article=newsArticles[id];
    const reader=$('#newsReader');
    if(!article||!reader)return;
    currentArticle=id;
    $('#newsReaderSection').textContent=article.section;
    $('#newsReaderEyebrow').textContent=article.eyebrow;
    $('#newsReaderTitle').textContent=article.title;
    $('#newsReaderDeck').textContent=article.deck;
    $('#newsReaderMeta').textContent=article.meta;
    $('#newsReaderBody').innerHTML=article.body.map(paragraph=>`<p>${escapeHTML(paragraph)}</p>`).join('');
    const saveButton=$('#newsReaderSave');
    const saved=savedArticles.has(id);
    saveButton?.classList.toggle('is-saved',saved);
    saveButton?.setAttribute('aria-pressed',String(saved));
    renderArticleDiscussion(article,id);
    reader.hidden=false;
    reader.setAttribute('aria-hidden','false');
    const scroll=reader.querySelector('.news-reader-scroll');
    if(scroll)scroll.scrollTop=0;
  }

  function renderArticleDiscussion(article,id){
    const reactions=$('#newsReaderReactions');
    const comments=$('#newsReaderComments');
    const count=$('#newsReaderCommentCount');
    if(reactions){
      reactions.innerHTML=(article.reactions||[]).map(([label,total],index)=>{
        const key=`${id}:reaction:${index}`;
        const active=readerVotes.get(key)===true;
        return`<button class="news-reaction${active?' is-active':''}" data-news-reaction="${index}" type="button" aria-pressed="${active}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3 14.7 8.5l6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg><span>${escapeHTML(label)}</span><b>${total+(active?1:0)}</b></button>`;
      }).join('');
    }
    if(count)count.textContent=`${(article.comments||[]).length} ${copy.comments}`;
    if(comments){
      comments.innerHTML=(article.comments||[]).map((comment,index)=>{
        const initials=comment.name.split(/\s+/).map(part=>part[0]).join('').slice(0,2);
        const agreeKey=`${id}:comment:${index}:agree`;
        const disagreeKey=`${id}:comment:${index}:disagree`;
        const agreed=readerVotes.get(agreeKey)===true;
        const disagreed=readerVotes.get(disagreeKey)===true;
        return`<article class="news-comment"><header><span class="news-comment-avatar">${escapeHTML(initials)}</span><span><strong>${escapeHTML(comment.name)}</strong><small>${escapeHTML(comment.time)}</small></span></header><p>${escapeHTML(comment.text)}</p><div class="news-comment-actions"><button class="${agreed?'is-active':''}" data-comment-vote="agree" data-comment-index="${index}" type="button" aria-pressed="${agreed}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 11 3-7c.5-1.2 2.3-.8 2.3.5V9h5.3c1.5 0 2.5 1.4 2.1 2.8l-1.6 6A2 2 0 0 1 16.2 19H7m0-8H4v8h3Z"/></svg>${copy.agree} <b>${comment.agree+(agreed?1:0)}</b></button><button class="${disagreed?'is-active':''}" data-comment-vote="disagree" data-comment-index="${index}" type="button" aria-pressed="${disagreed}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 13 3 7c.5 1.2 2.3.8 2.3-.5V15h5.3c1.5 0 2.5-1.4 2.1-2.8l-1.6-6A2 2 0 0 0 16.2 5H7m0 8H4V5h3Z"/></svg>${copy.disagree} <b>${comment.disagree+(disagreed?1:0)}</b></button></div></article>`;
      }).join('');
    }
  }

  function filterNews(nextFilter){
    newsFilter=nextFilter;
    $$('.news-section').forEach(button=>{
      const active=button.dataset.newsFilter===newsFilter;
      button.classList.toggle('active',active);
      button.setAttribute('aria-selected',String(active));
    });
    $$('[data-news-category]').forEach(article=>{
      article.hidden=newsFilter!=='all'&&article.dataset.newsCategory!==newsFilter;
    });
  }

  function newsCategoryIcon(category){
    if(category==='ocean')return'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 12h18l5 5-3 6H6l-3-6h6Z"/><path d="M9 12V8h8v4M3 27c4-2 7 2 11 0s7 2 11 0"/></svg>';
    if(category==='science')return'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="16" cy="16" r="4"/><circle cx="7" cy="9" r="2.5"/><circle cx="25" cy="9" r="2.5"/><circle cx="16" cy="27" r="2.5"/><path d="m9 10.5 4 3M23 10.5l-4 3M16 20v4.5"/></svg>';
    if(category==='education')return'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 13 16 7l11 6-11 6Z"/><path d="M9 16v7c4 3 10 3 14 0v-7M27 13v8"/></svg>';
    return'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 10h20v16H6zM10 6h12v4M11 15h10M11 20h7"/></svg>';
  }

  function renderExtraNews(){
    const target=$('#newsExtraFeed');
    if(!target)return;
    target.innerHTML=extraArticles.map((article,index)=>`<article class="news-item news-row news-extra-row" data-news-category="${escapeHTML(article.category)}"><button data-news-id="${escapeHTML(article.id)}" type="button"><span class="news-symbol">${newsCategoryIcon(article.category)}</span><span><span class="news-kicker">${escapeHTML(article.eyebrow)}</span><h3>${escapeHTML(article.title)}</h3><p>${escapeHTML(article.deck)}</p><small class="news-meta">${escapeHTML(article.meta)}</small></span><i class="news-sequence" aria-hidden="true">${String(index+11).padStart(2,'0')}</i></button></article>`).join('');
  }

  function filteredThreads(){
    return threads.filter(thread=>{
      const matchesFilter=filter==='all'||(filter==='pinned'&&thread.pinned)||(filter==='unread'&&thread.unread);
      const matchesQuery=!query||`${thread.name} ${thread.preview}`.toLowerCase().includes(query);
      return matchesFilter&&matchesQuery;
    });
  }

  function renderThreadList(){
    const list=$('#ariqThreadList');
    if(!list)return;
    const items=filteredThreads();
    list.innerHTML=items.length?items.map(thread=>`<button class="ariq-thread" data-thread-id="${thread.id}" type="button"><span class="ariq-thread-avatar">${escapeHTML(thread.initial)}</span><span class="ariq-thread-copy"><span class="ariq-thread-name">${escapeHTML(thread.name)}${thread.pinned?` <span aria-label="${copy.pinnedLabel}">◇</span>`:''}</span><span class="ariq-thread-preview">${escapeHTML(thread.preview)}</span></span><span class="ariq-thread-side"><span class="ariq-thread-time">${escapeHTML(thread.time)}</span>${thread.unread?`<span class="ariq-badge">${thread.unread}</span>`:''}</span></button>`).join(''):`<div class="ariq-empty">${copy.none}</div>`;
    list.querySelectorAll('[data-thread-id]').forEach(button=>button.addEventListener('click',()=>openThread(button.dataset.threadId),{signal}));
  }

  function renderMessages(){
    const thread=threads.find(item=>item.id===currentThread)||threads[0];
    const pane=$('#ariqMessages');
    if(!thread||!pane)return;
    $('#ariqChatAvatar').textContent=thread.initial;
    $('#ariqChatName').textContent=thread.name;
    $('#ariqChatSubtitle').textContent=copy.personal;
    pane.innerHTML=thread.messages.map(message=>{
      if(message.day)return`<div class="ariq-day">${escapeHTML(message.day)}</div>`;
      const attachment=message.attachment?`<div class="ariq-attachment"><strong>${escapeHTML(message.attachment.title)}</strong><span>${escapeHTML(message.attachment.meta)}</span></div>`:'';
      const bubble=message.text?`<div class="ariq-bubble">${escapeHTML(message.text)}</div>`:'';
      return`<div class="ariq-msg-row ${message.dir==='out'?'out':'in'}"><div class="ariq-msg-block">${message.sender?`<div class="ariq-sender">${escapeHTML(message.sender)}</div>`:''}${attachment}${bubble}<div class="ariq-msg-meta">${escapeHTML(message.time)}</div></div></div>`;
    }).join('');
    requestAnimationFrame(()=>{pane.scrollTop=pane.scrollHeight});
  }

  function openThread(id){
    currentThread=id;
    const thread=threads.find(item=>item.id===id);
    if(thread)thread.unread=0;
    renderThreadList();
    renderMessages();
    $('#ariqShell')?.classList.add('chat-open');
  }

  function closeThread(){$('#ariqShell')?.classList.remove('chat-open')}

  function sendMessage(){
    const input=$('#ariqComposer');
    const value=input?.value.trim();
    if(!value)return;
    const thread=threads.find(item=>item.id===currentThread);
    if(!thread)return;
    const now=new Date().toLocaleTimeString(EN?'en-US':'pt-BR',{hour:'2-digit',minute:'2-digit',hour12:false});
    thread.messages.push({dir:'out',text:value,time:now});
    thread.preview=value;
    thread.time=now;
    input.value='';
    renderMessages();
    renderThreadList();
    showToast(copy.local);
  }

  renderThreadlyFeed();
  renderExtraNews();
  $$('[data-phone-open]').forEach(button=>button.addEventListener('click',()=>openView(button.dataset.phoneOpen),{signal}));
  $$('[data-phone-home]').forEach(button=>button.addEventListener('click',()=>{closeThread();openView('home')},{signal}));
  $$('[data-threadly-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.threadlyFilter;
    $$('[data-threadly-filter]').forEach(item=>{
      const active=item===button;
      item.classList.toggle('active',active);
      item.setAttribute('aria-selected',String(active));
    });
    $$('[data-threadly-kind]').forEach(post=>{post.hidden=filter==='clips'&&post.dataset.threadlyKind!=='clips'});
    $$('.threadly-video-wrap video').forEach(video=>video.pause());
    requestAnimationFrame(()=>$('.threadly-post:not([hidden]) .threadly-video-wrap video')?.play().catch(()=>{}));
  },{signal}));
  $$('[data-threadly-like]').forEach(button=>button.addEventListener('click',()=>{
    const active=!button.classList.contains('is-active');
    const count=button.querySelector('span');
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
    if(count)count.textContent=String(Number(count.textContent||0)+(active?1:-1));
  },{signal}));
  $$('[data-threadly-save]').forEach(button=>button.addEventListener('click',()=>{
    const active=!button.classList.contains('is-active');
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',String(active));
    showToast(active?(EN?'Saved on Threadly.':'Salvo no Threadly.'):(EN?'Removed from saved posts.':'Removido dos salvos.'));
  },{signal}));
  $$('.threadly-video-wrap video').forEach(video=>video.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause()},{signal}));
  $$('[data-threadly-sound]').forEach(button=>button.addEventListener('click',()=>{
    const video=button.closest('.threadly-video-wrap')?.querySelector('video');
    if(!video)return;
    video.muted=!video.muted;
    button.classList.toggle('sound-on',!video.muted);
    button.setAttribute('aria-label',video.muted?(EN?'Turn sound on':'Ativar som'):(EN?'Mute':'Desativar som'));
    if(video.paused)video.play().catch(()=>{});
  },{signal}));
  $$('.threadly-composer,.threadly-top-action').forEach(button=>button.addEventListener('click',()=>showToast(copy.local),{signal}));
  $('#ariqBack')?.addEventListener('click',closeThread,{signal});
  $('#ariqSearchInput')?.addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();renderThreadList()},{signal});
  $('#ariqClearSearch')?.addEventListener('click',()=>{const input=$('#ariqSearchInput');if(input){input.value='';input.focus()}query='';renderThreadList()},{signal});
  $$('.ariq-filter').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;$$('.ariq-filter').forEach(item=>item.classList.toggle('active',item===button));renderThreadList()},{signal}));
  $('#ariqSend')?.addEventListener('click',sendMessage,{signal});
  $('#ariqComposer')?.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}},{signal});
  $$('[data-news-id]').forEach(button=>button.addEventListener('click',()=>openArticle(button.dataset.newsId),{signal}));
  $$('.news-section').forEach(button=>button.addEventListener('click',()=>filterNews(button.dataset.newsFilter),{signal}));
  $('#newsReaderBack')?.addEventListener('click',closeArticle,{signal});
  $('#newsReaderSave')?.addEventListener('click',event=>{
    const button=event.currentTarget;
    const saved=!savedArticles.has(currentArticle);
    if(saved)savedArticles.add(currentArticle);else savedArticles.delete(currentArticle);
    button.classList.toggle('is-saved',saved);
    button.setAttribute('aria-pressed',String(saved));
    showToast(saved?copy.saved:copy.removed);
  },{signal});
  $('#newsReaderReactions')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-news-reaction]');
    if(!button)return;
    const key=`${currentArticle}:reaction:${button.dataset.newsReaction}`;
    readerVotes.set(key,readerVotes.get(key)!==true);
    renderArticleDiscussion(newsArticles[currentArticle],currentArticle);
  },{signal});
  $('#newsReaderComments')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-comment-vote]');
    if(!button)return;
    const index=button.dataset.commentIndex;
    const kind=button.dataset.commentVote;
    const other=kind==='agree'?'disagree':'agree';
    const key=`${currentArticle}:comment:${index}:${kind}`;
    const otherKey=`${currentArticle}:comment:${index}:${other}`;
    readerVotes.set(key,readerVotes.get(key)!==true);
    readerVotes.set(otherKey,false);
    renderArticleDiscussion(newsArticles[currentArticle],currentArticle);
  },{signal});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeArticle()},{signal});

  const noteCards=$$('[data-note-card]');
  const notesSearchInput=$('#notesSearchInput');
  const filterNotes=()=>{
    const query=String(notesSearchInput?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
    let visible=0;
    noteCards.forEach(card=>{
      const haystack=String(card.dataset.noteSearch||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const match=!query||haystack.includes(query);
      card.hidden=!match;
      if(match)visible++;
    });
    const empty=$('#notesEmpty');
    if(empty)empty.hidden=visible>0;
  };
  $$('[data-note-toggle]').forEach(button=>button.addEventListener('click',()=>{
    const card=button.closest('[data-note-card]');
    const open=!card?.classList.contains('is-open');
    card?.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',String(open));
  },{signal}));
  notesSearchInput?.addEventListener('input',filterNotes,{signal});
  $('#notesSearchClear')?.addEventListener('click',()=>{if(notesSearchInput){notesSearchInput.value='';notesSearchInput.focus()}filterNotes()},{signal});

  updateClock();
  const clockTimer=setInterval(updateClock,30000);
  renderThreadList();
  filterNews('all');
  openView('home');

  const cleanup=()=>{controller.abort();clearInterval(clockTimer);clearTimeout(showToast.timer)};
  window.THERAN.cleanups.jamesPhone=cleanup;
  return cleanup;
};

window.THERAN.mountJamesPhone();
export {};
