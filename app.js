/* Tarot Arquetípico · A Jornada do Herói — app de estudo da apostila */
(function(){
'use strict';
var ACTS=[
 {k:0,name:'O Louco',short:'O Louco',sub:'O herói, antes e depois de todo o caminho',cls:'--a0'},
 {k:1,name:'Ato I · Nascimento do Ego',short:'Ato I',sub:'Do Mago ao Carro: formar identidade, aprender com a tradição, escolher e partir.',cls:'--a1'},
 {k:2,name:'Ato II · Provações e Travessia',short:'Ato II',sub:'Da Força à Temperança: coragem, recolhimento, mudança de perspectiva, fim e recomposição.',cls:'--a2'},
 {k:3,name:'Ato III · Sombra, Queda e Retorno',short:'Ato III',sub:'Do Diabo ao Mundo: encarar o que prende, a ruptura, a esperança e a integração.',cls:'--a3'}];
var TABS=[
 ['home','Jornada','<path d="M3 20l5-9 4 5 3-6 6 10z"/><path d="M17 4.5a2 2 0 100 .01"/>'],
 ['estudar','Estudar','<path d="M4 5a2 2 0 012-2h13v17H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13"/>'],
 ['meditar','Meditar','<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>'],
 ['diario','Diário','<path d="M5 3h12a2 2 0 012 2v16H7a2 2 0 01-2-2zM9 8h6M9 12h6"/>'],
 ['mapa','Meu mapa','<circle cx="12" cy="12" r="4"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1"/>']];
var CT=[['img','Imagem'],['arq','Arquétipo'],['mito','Mito'],['psi','Psique'],['dia','No dia a dia'],['eu','Para mim'],['med','Meditação']];
var PEARSON=['Inocente','Órfão','Guerreiro','Cuidador','Buscador','Amante','Destruidor','Criador','Governante','Mago','Sábio','Bobo'];
var FS=[1,1.12,1.26];
var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>';
var ORN='<div class="orn" aria-hidden="true"><i></i>'+STAR+'<i></i></div>';
var KEY='taro-arq-v1';
var D=window.TARO_DATA, S=load(), R={view:'home'}, P=null, saveT=null, dayOff=0;

function load(){var s={read:{},pred:{},notes:{},free:[],med:{},theme:null,last:null,fs:0,seen:0};
  try{var j=JSON.parse(localStorage.getItem(KEY)||'null');if(j)for(var k in j)s[k]=j[k]}catch(e){}return s}
function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function save(){clearTimeout(saveT);saveT=setTimeout(saveNow,250)}
function $(s,r){return (r||document).querySelector(s)}
function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(t){return String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
function strip(h){return h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function wrapTables(h){return h.replace(/<table/g,'<div class="tw"><table').replace(/<\/table>/g,'</table></div>')}
function ac(c){return 'var(--a'+c.ato+')'}
function ico(p){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>'}
function img(k,n){return ''+k+'_'+(n<10?'0':'')+n+'.jpg'}
function setTheme(t){document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');
  var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',t==='light'?'#f6eedb':'#1c0e18')}
function setFs(){document.documentElement.style.setProperty('--fs',FS[S.fs||0])}
function counts(){var r=0,n=0,m=0;for(var k in S.read)if(S.read[k])r++;for(var k2 in S.notes)if((S.notes[k2]||'').trim())n++;for(var k3 in S.med)if(S.med[k3])m++;return{r:r,n:n,m:m}}
function minutes(c){var w=0,p=0;c.med.steps.forEach(function(s){w+=s.t.split(/\s+/).length;p+=s.p});return Math.max(1,Math.round((w/2.2+p)/60))}
function score(n){var a=S.pred[n];if(!a)return null;var t=0;a.forEach(function(x){if(x)t++});return t}
function pearson(c){var h=(c.sec['Conexão com o Mapa Arquetípico']||'').split(/sombra/i)[0],out=[];
  (h.match(/<em>(.*?)<\/em>/g)||[]).forEach(function(m){var t=m.replace(/<[^>]+>/g,'');if(PEARSON.indexOf(t)>=0&&out.indexOf(t)<0)out.push(t)});return out}
function slug(c){return (c.num<10?'0':'')+c.num+'-'+c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function pdfUrl(c){return 'diario-'+slug(c)+'.pdf'}
function roman(c){return esc(c.roman)}

/* ---------- roteamento ---------- */
function go(r,noScroll){R=r;if(r.view==='arc')S.last=r.n;save();try{location.hash=hashOf(r)}catch(e){}render();if(!noScroll)window.scrollTo(0,0)}
function hashOf(r){if(r.view==='arc')return 'a'+r.n+'-'+(r.tab||'img');if(r.view==='chap')return 'c'+r.i;if(r.view==='play')return 'm'+r.n;return r.view}
function fromHash(){var h=(location.hash||'').slice(1),m;
  if(m=h.match(/^a(\d+)(?:-(\w+))?$/)){var n=+m[1];if(n<22)return{view:'arc',n:n,tab:m[2]||'img'}}
  if(m=h.match(/^c(\d+)$/)){if(+m[1]<D.chap.length)return{view:'chap',i:+m[1]}}
  if(m=h.match(/^m(\d+)$/)){if(+m[1]<22)return{view:'play',n:+m[1]}}
  if(['home','estudar','meditar','diario','mapa'].indexOf(h)>=0)return{view:h};return{view:'home'}}

/* ---------- renderização ---------- */
function render(){
  var v=R.view, main=$('#main'), cur=v==='arc'?'home':v==='chap'?'estudar':v==='play'?'meditar':v;
  $('#tabs').innerHTML=TABS.map(function(t){return '<button data-go="'+t[0]+'"'+(t[0]===cur?' aria-current="page"':'')+'>'+ico(t[2])+'<span>'+t[1]+'</span></button>'}).join('');
  stopPlayer(v!=='play');
  var f={home:vHome,estudar:vEstudar,chap:vChap,meditar:vMeditar,play:vPlay,arc:vArc,diario:vDiario,mapa:vMapa}[v];
  main.innerHTML=f();
  if(v==='play')startPlayer();
  if(v==='home'){var t=$('.trail');if(t&&S.last!=null)t.scrollLeft=Math.max(0,S.last*42-t.clientWidth/2+30)}
}

function cardBtn(c){var sc=score(c.num),read=S.read[c.num];
  return '<button class="card" data-arc="'+c.num+'" style="--ac:'+ac(c)+'"><img loading="lazy" src="'+img('rws',c.num)+'" alt="'+esc(c.nome)+', Rider-Waite-Smith">'
  +(read?'<span class="flag">lida</span>':'')+(sc!=null&&sc>=6?'<span class="flag p">predomina</span>':'')
  +'<span class="rn">'+roman(c)+'</span><span class="nm">'+esc(c.nome)+'</span></button>'}

function dayCard(){var d=Math.floor(Date.now()/864e5),i=((d*5+dayOff)%22+22)%22,c=D.cards[i];
  return '<section class="day" style="--ac:'+ac(c)+'"><img src="'+img('rws',i)+'" alt="'+esc(c.nome)+'"><div><div class="kicker">Pergunta do dia · '+roman(c)+' '+esc(c.nome)+'</div><q>'+esc(c.oraculo)+'</q><div class="acts"><button class="btn sm" data-arc="'+i+'">Abrir a carta</button><button class="btn sm ghost" data-act="otherq">Outra pergunta</button></div></div></section>'}

/* trilha: os 22 arcanos como um caminho sinuoso; o trecho dourado vai até a carta lida mais adiante */
function trail(){var n=22,sp=42,w=n*sp+28,h=104,pts=[],i,maxRead=-1;
  for(i=0;i<n;i++){pts.push([26+i*sp,46+Math.sin(i*.62)*20]);if(S.read[i])maxRead=i}
  var d='M'+pts[0][0]+','+pts[0][1];
  for(i=1;i<n-1;i++){var mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;d+=' Q'+pts[i][0]+','+pts[i][1]+' '+mx+','+my}
  d+=' L'+pts[n-1][0]+','+pts[n-1][1];
  var s='<svg viewBox="0 0 '+w+' '+h+'" role="group" aria-label="Trilha dos 22 arcanos"><path class="path0" d="'+d+'"/>'
   +(maxRead>=0?'<path class="path1" pathLength="100" stroke-dasharray="'+(maxRead/(n-1)*100).toFixed(2)+' 200" d="'+d+'"/>':'');
  var lastAto=-1;
  D.cards.forEach(function(c,i){var p=pts[i],read=S.read[i],sc=score(i),col='var(--a'+c.ato+')';
    if(c.ato!==lastAto){lastAto=c.ato;if(c.ato>0)s+='<text class="act" x="'+(p[0]-12)+'" y="'+(h-6)+'">'+ACTS[c.ato].short+'</text>'}
    s+='<g class="node" data-arc="'+i+'" tabindex="0" role="link" aria-label="'+esc(c.roman+' '+c.nome)+(read?', lida':'')+'"><title>'+esc(c.roman+' · '+c.nome)+'</title>'
     +(sc!=null&&sc>=6?'<circle cx="'+p[0]+'" cy="'+p[1]+'" r="17" fill="none" stroke="'+col+'" stroke-width="1.5" stroke-dasharray="2 3"/>':'')
     +'<circle class="dot" cx="'+p[0]+'" cy="'+p[1]+'" r="12.5" fill="'+(read?col:'var(--surface)')+'" stroke="'+col+'" stroke-width="2"/>'
     +'<text x="'+p[0]+'" y="'+(p[1]+3.7)+'" fill="'+(read?'var(--on-accent)':'var(--ink)')+'">'+i+'</text></g>'});
  return s+'</svg>'}

function vHome(){var k=counts(),pct=Math.round(k.r/22*100),last=S.last!=null?D.cards[S.last]:null;
  var h='<section class="hero"><div class="art" aria-hidden="true"></div><div class="hero-top"><div class="kicker">Curso de Patricia Faccio</div>'
   +'<h1><span>Tarot</span><span>Arquetípico</span></h1>'+ORN+'<p class="sub">A Jornada do Herói</p><span class="badge">Guia de estudo do curso</span></div>'
   +'<div class="hero-bot">'+(last?'<button class="btn" data-arc="'+last.num+'">Continuar: '+esc(last.nome)+'</button>':'<button class="btn" data-arc="0">Começar pelo Louco</button>')+'<button class="btn ghost" data-go="estudar">Ler os fundamentos</button></div></section>';
  h+='<section class="panel"><p class="lead">As 22 cartas dos Arcanos Maiores como mapa simbólico da individuação: leia, escreva, medite e descubra quais arquétipos conduzem a sua vida agora.</p>'
   +'<div class="stats"><div class="stat"><b>'+k.r+'<small>/22</small></b><span>cartas lidas</span></div><div class="stat"><b>'+k.n+'</b><span>reflexões escritas</span></div><div class="stat"><b>'+k.m+'</b><span>meditações feitas</span></div></div>'
   +'<div class="bar" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100" aria-label="Cartas lidas"><i style="width:'+pct+'%"></i></div>'
   +'<div class="trail">'+trail()+'</div></section>';
  h+=dayCard();
  ACTS.forEach(function(a){var list=D.cards.filter(function(c){return c.ato===a.k});
    h+='<div class="act-head" style="--ac:var('+a.cls+')"><h2>'+a.name+'</h2><p>'+a.sub+'</p></div><div class="grid">'+list.map(cardBtn).join('')+'</div>'});
  h+='<div class="foot">'+ORN.replace('class="orn"','class="orn" style="width:100%"')+'<div>Este material usa o Tarô como linguagem simbólica de autoconhecimento. Não é adivinhação, previsão, diagnóstico nem substitui psicoterapia.</div><div>Patricia Faccio · terapeuta integrativa com formação em trauma, terapia sistêmica e psicologia analítica junguiana.</div><div>Imagens: Rider-Waite-Smith e Tarô de Marselha, de livros de referência do curso, para uso didático.</div><button class="link" data-act="splash">Rever a capa</button></div>';
  return h}

function vEstudar(){
  var h='<div class="ph"><div class="kicker">Fundamentos</div><h1>Estudar</h1></div><p class="prose" style="margin:0 0 18px">Jung, Campbell, arquétipos, a história do Tarô e como ler uma carta. Os capítulos da apostila, para ler em qualquer lugar.</p><div class="toc">';
  D.chap.forEach(function(c,i){h+='<button data-chap="'+i+'"><b>'+esc(c.title)+'</b><span>'+Math.max(1,Math.round(strip(c.html).split(' ').length/190))+' min</span></button>'});
  return h+'</div>'}
function vChap(){var i=R.i,c=D.chap[i],p=D.chap[i-1],n=D.chap[i+1];
  return '<div class="crumbs"><button class="back" data-go="estudar">← Fundamentos</button></div><article class="prose"><h2 style="margin-top:0">'+esc(c.title)+'</h2>'+wrapTables(c.html)+'</article>'
  +'<div class="pager">'+(p?'<button data-chap="'+(i-1)+'"><small>Anterior</small>'+esc(p.title)+'</button>':'<span></span>')+(n?'<button data-chap="'+(i+1)+'"><small>Próximo</small>'+esc(n.title)+'</button>':'<span></span>')+'</div>'}

function vArc(){var n=R.n,c=D.cards[n],tab=R.tab||'img',a=ACTS[c.ato],S2=c.sec;
  var marsNote=(n===8?' (nº XI no Marselha)':n===11?' (nº VIII no Marselha)':''),pe=pearson(c);
  var h='<div style="--ac:'+ac(c)+'"><div class="crumbs"><button class="back" data-go="home">← Jornada</button><button class="btn sm '+(S.read[n]?'':'ghost')+'" data-act="read">'+(S.read[n]?'✓ Lida':'Marcar como lida')+'</button></div>'
  +'<header class="band"><div class="figs"><figure><button data-zoom="'+n+'" data-k="rws" aria-label="Ampliar Rider-Waite-Smith"><img src="'+img('rws',n)+'" alt="'+esc(c.nome)+', Rider-Waite-Smith"></button><figcaption>Rider-Waite-Smith</figcaption></figure>'
  +'<figure><button data-zoom="'+n+'" data-k="mars" aria-label="Ampliar Marselha"><img src="'+img('mars',n)+'" alt="'+esc(c.nome)+', Marselha"></button><figcaption>Marselha'+marsNote+'</figcaption></figure></div>'
  +'<div><div class="kicker" style="color:var(--ac)">'+a.name+'</div><div class="rn">'+roman(c)+'</div><h1>'+esc(c.nome)+'</h1><div class="kw">'+esc(c.palavras)+'</div>'
  +'<dl class="idt"><dt>Rider-Waite</dt><dd>'+esc(c.rw)+'</dd><dt>Marselha</dt><dd>'+esc(c.marselha)+'</dd></dl>'
  +'<div class="dlrow"><a class="btn sm" href="'+pdfUrl(c)+'" target="_blank" rel="noopener" download>Diário em PDF para imprimir</a></div>'
  +(pe.length?'<div class="pchips"><span class="lbl">Mapa Arquetípico</span>'+pe.map(function(x){return '<span class="chip gold">'+esc(x)+'</span>'}).join('')+'</div>':'')+'</div></header>'
  +'<div class="tabsbar" role="tablist">'+CT.map(function(t){return '<button role="tab" data-tab="'+t[0]+'" aria-selected="'+(t[0]===tab)+'">'+t[1]+'</button>'}).join('')+'</div>';
  var sec=function(t,body){return '<section class="sect"><h2>'+t+'</h2>'+body+'</section>'};
  var pr=function(k){return '<div class="prose">'+S2[k]+'</div>'};
  if(tab==='img'){h+=sec('Simbologia da imagem',pr('Simbologia da imagem'))
    +sec('Correspondências','<div class="corr"><div><b>Letra hebraica</b>'+esc(c.letra)+'</div><div><b>Astrologia</b>'+esc(c.astro)+'</div><div><b>Elemento</b>'+esc(c.elemento)+'</div><div><b>Alquimia*</b>'+esc(c.alquimia)+'</div></div><p class="note">* Leitura simbólica no diálogo com a alquimia junguiana, não atribuição histórica.</p>')}
  else if(tab==='arq'){h+=sec('Caracterização',pr('Caracterização'))+sec('O arquétipo',pr('Arquétipo'))+sec('Etapa da Jornada do Herói',pr('Etapa da Jornada do Herói'))+sec('Conexão com o Mapa Arquetípico',pr('Conexão com o Mapa Arquetípico'))}
  else if(tab==='mito'){h+=sec('Mito relacionado','<div class="mito prose">'+S2['Mito relacionado']+'</div>')}
  else if(tab==='psi'){h+=sec('Olhar junguiano',pr('Olhar junguiano profundo'))+sec('Luz e sombra',pr('Luz e Sombra'))}
  else if(tab==='dia'){h+=sec('Na vida real',pr('Na vida real'))+sec('No cotidiano: acesso, falta e atuação',pr('No cotidiano: acesso, falta e atuação'))}
  else if(tab==='eu'){h+=vEu(c)}
  else if(tab==='med'){var m=c.med,sc=m.steps.length;
    h+=sec('Meditação ativa','<p class="prose" style="margin:0 0 14px">'+esc(m.intro)+'</p><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn" data-play="'+n+'">Iniciar meditação guiada</button><span class="chip">~'+minutes(c)+' min · '+sc+' passos</span>'+(S.med[n]?'<span class="chip gold">✓ feita</span>':'')+'</div>'
    +'<details style="margin-top:22px"><summary style="cursor:pointer;color:var(--muted);font-size:13px">Ler o roteiro completo</summary><div class="prose" style="margin-top:12px">'+m.steps.map(function(s){return '<p>'+esc(s.t)+(s.p?' <em style="color:var(--muted)">['+(s.p>=60?(s.p/60)+' min':s.p+' s')+' de pausa]</em>':'')+'</p>'}).join('')+'</div></details>')}
  var p=D.cards[n-1],q=D.cards[n+1];
  h+='<div class="pager">'+(p?'<button data-arc="'+(n-1)+'"><small>← Anterior</small>'+roman(p)+' · '+esc(p.nome)+'</button>':'<span></span>')+(q?'<button data-arc="'+(n+1)+'"><small>Próxima →</small>'+roman(q)+' · '+esc(q.nome)+'</button>':'<span></span>')+'</div></div>';
  return h}

function field(key,label,rows){var v=S.notes[key]||'';return '<div class="field"><label for="n_'+key.replace(':','_')+'">'+label+'</label><textarea id="n_'+key.replace(':','_')+'" data-note="'+key+'" rows="'+(rows||3)+'" placeholder="Escreva sem censura…">'+esc(v)+'</textarea><div class="saved" aria-live="polite"></div></div>'}
function predBlock(c){var n=c.num,a=S.pred[n]||[],t=score(n);
  var h='<p class="prose" style="margin:0 0 4px">Marque o que for verdadeiro <strong>na maior parte do tempo</strong>, sem pensar demais. Predominar não é identidade: é o padrão que mais conduz você nesta fase.</p><div class="checks">';
  c.pred.items.forEach(function(it,i){h+='<label><input type="checkbox" data-pred="'+n+'" data-i="'+i+'"'+(a[i]?' checked':'')+'><span>'+esc(it)+'</span></label>'});
  return h+'</div><div class="score" id="score">'+scoreInner(c,t)+'</div><p class="note">Não é diagnóstico nem rótulo; é um ponto de partida para conversar consigo. Se algo pesar, procure acompanhamento terapêutico.</p>'}
function scoreInner(c,t){if(t==null)return '<div class="n">–</div><p>Marque as frases que fazem sentido para você e veja como ler o resultado.</p>';
  var b=t<=2?0:t<=5?1:2,lbl=['Pouco acessado','Convive com outros','Provavelmente predominante'][b];
  return '<div class="n">'+t+'<small style="font-size:16px;color:var(--muted)">/8</small></div><p><span class="band-lbl">'+lbl+'</span>'+esc(c.pred.bands[b]||'')+'</p>'}
function vEu(c){var n=c.num,h='';
  h+='<section class="sect"><h2>Diário para escrever à mão</h2><p class="prose" style="margin:0 0 12px">Um diário de 7 páginas desta carta, com a imagem, perguntas reflexivas, teste, experimento da semana e meditação. Imprima e escreva à mão.</p><a class="btn" href="'+pdfUrl(c)+'" target="_blank" rel="noopener" download>Abrir o diário de '+esc(c.nome)+' (PDF)</a></section>';
  h+='<section class="sect"><h2>É um arquétipo predominante em mim?</h2>'+predBlock(c)+'</section>';
  h+='<section class="sect"><h2>Atividades reflexivas</h2><p class="note" style="margin:0 0 12px">Suas respostas ficam salvas neste aparelho e aparecem na aba Diário.</p>'+c.ativ.prompts.map(function(p,i){return field(n+':'+i,esc(p),3)}).join('')
   +'<div class="mito prose" style="margin:16px 0"><p><strong>Experimento da semana.</strong> '+esc(c.ativ.exp)+'</p></div>'+field(n+':exp','O que aconteceu ao fazer o experimento?',3)
   +'<blockquote class="prose" style="margin:20px 0">Afirmação: '+esc(c.ativ.afirm)+'</blockquote></section>';
  h+='<section class="sect"><h2>Pergunta-oráculo</h2><p class="oracle">'+esc(c.oraculo)+'</p><div style="margin-top:14px">'+field(n+':orac','Deixe a pergunta acompanhar você por um dia. O que ela trouxe?',3)+'</div></section>';
  return h}

function vMeditar(){var h='<div class="ph"><div class="kicker">Imaginação ativa</div><h1>Meditar</h1></div><p class="prose" style="margin:0 0 18px">Uma meditação ativa para cada arcano, com pausas cronometradas e leitura em voz alta opcional. Reserve de 15 a 20 minutos, sentada ou sentado, com os pés no chão, em um lugar tranquilo.</p><div class="mlist">';
  D.cards.forEach(function(c){h+='<button class="mrow" data-play="'+c.num+'" style="--ac:'+ac(c)+'"><span class="rn">'+roman(c)+'</span><span><b>'+esc(c.nome)+'</b><span>~'+minutes(c)+' min'+(S.med[c.num]?' · ✓ feita':'')+'</span></span><span class="btn sm ghost">Iniciar</span></button>'});
  return h+'</div>'}

/* ---------- player ---------- */
function stopPlayer(clear){if(P){clearTimeout(P.t1);clearInterval(P.t2);try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}if(P.wl){try{P.wl.release()}catch(e){}P.wl=null}}if(clear)P=null}
function vPlay(){var c=D.cards[R.n];return '<div style="--ac:'+ac(c)+'"><div class="crumbs"><button class="back" data-arc="'+c.num+'" data-tab="med">← '+esc(c.nome)+'</button><span class="chip gold">'+roman(c)+' · Meditação ativa</span></div><div class="player" id="player"></div></div>'}
function startPlayer(){P={n:R.n,i:0,playing:false,voice:false,t1:0,t2:0,phase:'intro',remain:0,done:false,canVoice:!!(window.speechSynthesis&&window.SpeechSynthesisUtterance)};drawPlayer()}
function drawPlayer(){var el=$('#player');if(!el||!P)return;var c=D.cards[P.n],st=c.med.steps,s=st[P.i],h='';
  if(P.done){h='<div class="stage"><div style="display:grid;gap:14px"><h2 style="font-family:var(--f-num);font-size:36px;margin:0">Meditação concluída</h2><p class="txt" style="margin:0">Antes de voltar, anote a primeira imagem, sensação ou frase que ficou.</p>'+field(P.n+':med','O que apareceu?',4)+'<div><button class="btn" data-arc="'+P.n+'" data-tab="eu">Ir para as reflexões</button></div></div></div>';el.innerHTML=h;return}
  if(P.phase==='intro'){h='<div class="stage"><div style="display:grid;gap:16px;justify-items:center"><p class="txt" style="margin:0;max-width:34ch">'+esc(c.med.intro)+'</p><p class="note" style="margin:0">'+st.length+' passos · cerca de '+minutes(c)+' minutos</p></div></div>'}
  else if(P.phase==='pause'){var m=Math.floor(P.remain/60),sec=P.remain%60;h='<div class="stage"><div class="orbwrap"><div class="orb">'+m+':'+(sec<10?'0':'')+sec+'</div><small>Pausa · respire e observe</small></div></div>'}
  else{h='<div class="stage"><p class="txt" id="txt">'+esc(s.t)+'</p></div>'}
  h+='<div class="prog"><div class="bar"><i style="width:'+Math.round(P.i/st.length*100)+'%"></i></div><div class="note" style="margin-top:6px">Passo '+Math.min(P.i+1,st.length)+' de '+st.length+'</div></div>'
  +'<div class="ctrls"><button class="ibtn" data-pl="prev" aria-label="Passo anterior">'+ico('<path d="M19 20L9 12l10-8zM5 4v16"/>')+'</button>'
  +'<button class="ibtn play" data-pl="toggle" aria-label="'+(P.playing?'Pausar':'Iniciar')+'">'+(P.playing?'<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>':'<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>')+'</button>'
  +'<button class="ibtn" data-pl="next" aria-label="Pular">'+ico('<path d="M5 4l10 8-10 8zM19 4v16"/>')+'</button></div>'
  +(P.canVoice?'<label class="toggle"><input type="checkbox" id="voice"'+(P.voice?' checked':'')+'> Ler em voz alta</label>':'');
  el.innerHTML=h}
function plStep(){if(!P||!P.playing)return;clearTimeout(P.t1);clearInterval(P.t2);try{speechSynthesis.cancel()}catch(e){}
  var st=D.cards[P.n].med.steps;if(P.i>=st.length){P.done=true;P.playing=false;S.med[P.n]=true;save();drawPlayer();return}
  var s=st[P.i];P.phase='text';drawPlayer();var words=s.t.split(/\s+/).length,ms=Math.max(5000,words/2.2*1000),fired=false;
  var after=function(){if(fired||!P||!P.playing)return;fired=true;clearTimeout(P.t1);plPause()};
  if(P.voice&&P.canVoice){try{var u=new SpeechSynthesisUtterance(s.t);u.lang='pt-BR';u.rate=.86;u.onend=after;u.onerror=after;speechSynthesis.speak(u);P.t1=setTimeout(after,ms*1.7+4000)}catch(e){P.t1=setTimeout(after,ms)}}
  else P.t1=setTimeout(after,ms)}
function plPause(){var st=D.cards[P.n].med.steps,s=st[P.i];if(!s.p){P.i++;plStep();return}
  P.phase='pause';P.remain=s.p;drawPlayer();clearInterval(P.t2);
  P.t2=setInterval(function(){if(!P||!P.playing){clearInterval(P&&P.t2);return}P.remain--;var o=$('.orb');if(o){var m=Math.floor(P.remain/60),sec=P.remain%60;o.textContent=m+':'+(sec<10?'0':'')+sec}if(P.remain<=0){clearInterval(P.t2);P.i++;plStep()}},1000)}
function plToggle(){if(!P)return;if(P.phase==='intro')P.phase='text';P.playing=!P.playing;
  if(P.playing){try{if(navigator.wakeLock)navigator.wakeLock.request('screen').then(function(w){P.wl=w}).catch(function(){})}catch(e){}plStep()}
  else{clearTimeout(P.t1);clearInterval(P.t2);try{speechSynthesis.cancel()}catch(e){}drawPlayer()}}
function plMove(d){if(!P)return;var st=D.cards[P.n].med.steps;P.i=Math.max(0,Math.min(st.length,P.i+d));if(P.phase==='intro')P.phase='text';
  if(P.i>=st.length){P.playing=true;plStep();return}
  if(P.playing)plStep();else{clearTimeout(P.t1);clearInterval(P.t2);P.phase='text';drawPlayer()}}

/* ---------- diário ---------- */
function allNotes(){var out=[];D.cards.forEach(function(c){c.ativ.prompts.forEach(function(p,i){var v=(S.notes[c.num+':'+i]||'').trim();if(v)out.push({c:c,q:p,a:v})});
  [['exp','Experimento da semana'],['orac',c.oraculo],['med','Meditação: o que apareceu?']].forEach(function(x){var v=(S.notes[c.num+':'+x[0]]||'').trim();if(v)out.push({c:c,q:x[1],a:v})})});return out}
function fmtDate(t){try{return new Date(t).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}catch(e){return ''}}
function vDiario(){var notes=allNotes(),h='<div class="ph"><div class="kicker">Diário de Bordo</div><h1>Diário</h1></div><p class="prose" style="margin:0 0 16px">Escreva livremente aqui e reencontre as respostas das reflexões de cada carta. Tudo fica salvo neste aparelho.</p>'
  +'<div class="field"><label for="freeText">Nova anotação</label><textarea id="freeText" rows="4" placeholder="O que ficou em você hoje?"></textarea><div class="row-actions"><button class="btn sm" data-act="addfree">Salvar anotação</button><button class="btn sm ghost" data-act="copyall">Copiar tudo</button><button class="btn sm ghost" data-act="dltxt">Baixar .txt</button><span class="saved" id="copied" aria-live="polite"></span></div></div>';
  h+='<section class="sect"><h2>Anotações livres</h2>';
  if(!S.free.length)h+='<div class="empty">Nenhuma anotação ainda.</div>';
  S.free.slice().reverse().forEach(function(e){h+='<div class="entry"><div class="meta"><span>'+fmtDate(e.t)+'</span><button class="link" data-delfree="'+e.t+'">apagar</button></div><p>'+esc(e.x)+'</p></div>'});
  h+='</section><section class="sect"><h2>Respostas por carta</h2>';
  if(!notes.length)h+='<div class="empty">Quando você responder às atividades de uma carta, as respostas aparecem aqui.</div>';
  var last=-1;notes.forEach(function(e){if(e.c.num!==last){last=e.c.num;h+='<h3 style="margin:18px 0 6px;font-size:14px;color:var(--a'+e.c.ato+')">'+roman(e.c)+' · '+esc(e.c.nome)+' <button class="link" data-arc="'+e.c.num+'" data-tab="eu" style="margin-left:8px">abrir</button></h3>'}
    h+='<div class="entry"><q>'+esc(e.q)+'</q><p>'+esc(e.a)+'</p></div>'});
  h+='</section><section class="sect"><h2>Diários para imprimir</h2><p class="note" style="margin:0 0 12px">Cada carta tem um diário em PDF de 7 páginas para escrever à mão: imagem do arcano, perguntas reflexivas, teste de predominância, experimento da semana, meditação e fechamento. O diário completo reúne os 22 arcanos, com abertura e fechamento da jornada (157 páginas).</p><div style="margin-bottom:12px"><a class="btn" href="diario-completo.pdf" target="_blank" rel="noopener" download>Diário completo (PDF)</a></div><div class="dlist">'+D.cards.map(function(c){return '<a href="'+pdfUrl(c)+'" target="_blank" rel="noopener" download style="--ac:'+ac(c)+'"><b>'+roman(c)+'</b>'+esc(c.nome)+'</a>'}).join('')+'</div></section><section class="sect"><h2>Backup do progresso</h2><p class="note" style="margin:0 0 10px">Seu progresso fica só neste navegador. Para levar para outro aparelho ou guardar com segurança, baixe o backup e depois restaure no outro lugar.</p><div class="row-actions"><button class="btn sm ghost" data-act="exportjson">Baixar backup</button><button class="btn sm ghost" data-act="importjson">Restaurar backup</button><input type="file" id="impfile" accept="application/json,.json" hidden><span class="saved" id="bk" aria-live="polite"></span></div></section>';
  return h}
function exportText(){var t='DIÁRIO DE BORDO · Tarot Arquetípico\n\n';S.free.forEach(function(e){t+=fmtDate(e.t)+'\n'+e.x+'\n\n'});var last=-1;allNotes().forEach(function(e){if(e.c.num!==last){last=e.c.num;t+='\n== '+e.c.roman+' · '+e.c.nome+' ==\n'}t+='\n'+e.q+'\n'+e.a+'\n'});return t}
function download(name,text,type){var b=new Blob([text],{type:type||'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function importJson(file){var fr=new FileReader(),say=function(m){var e=$('#bk');if(e)e.textContent=m};
  fr.onload=function(){try{var j=JSON.parse(fr.result);if(!j||typeof j!=='object'||!(j.notes||j.read||j.pred||j.free))throw 0;
    ['read','pred','notes','med'].forEach(function(k){if(j[k]&&typeof j[k]==='object')S[k]=j[k]});if(Array.isArray(j.free))S.free=j.free;
    if(typeof j.fs==='number')S.fs=j.fs;saveNow();setFs();render();var e=$('#bk');if(e)e.textContent='Progresso restaurado.'}catch(er){say('Arquivo inválido.')}};
  fr.readAsText(file)}

/* ---------- mapa ---------- */
function pol(r,a){var t=a*Math.PI/180;return [(210+r*Math.cos(t)).toFixed(2),(210+r*Math.sin(t)).toFixed(2)]}
function sector(r1,r2,a0,a1){var p1=pol(r2,a0),p2=pol(r2,a1),p3=pol(r1,a1),p4=pol(r1,a0);
  return 'M'+p1.join(',')+' A'+r2+' '+r2+' 0 0 1 '+p2.join(',')+' L'+p3.join(',')+' A'+r1+' '+r1+' 0 0 0 '+p4.join(',')+' Z'}
function wheel(){var r0=52,rm=158,n=22,s='<svg class="wheel" viewBox="-30 -30 480 480" role="group" aria-label="Roda dos 22 arcanos">';
  [.25,.5,.75,1].forEach(function(g){s+='<circle class="ring" cx="210" cy="210" r="'+(r0+(rm-r0)*g).toFixed(1)+'"/>'});
  D.cards.forEach(function(c,i){var t=score(c.num),a0=-90+i*360/n+.7,a1=-90+(i+1)*360/n-.7,mid=-90+(i+.5)*360/n;
    var rr=r0+(rm-r0)*(t==null?.035:Math.max(t,.5)/8),col='var(--a'+c.ato+')',lp=pol(rm+17,mid);
    s+='<g class="seg" data-arc="'+c.num+'" data-tab="eu" tabindex="0" role="link" aria-label="'+esc(c.roman+' '+c.nome)+(t==null?', teste não feito':', '+t+' de 8')+'" style="opacity:'+(t==null?.5:(.5+.5*t/8).toFixed(2))+'"><title>'+esc(c.roman+' · '+c.nome)+(t==null?'':' · '+t+'/8')+'</title>'
     +'<path d="'+sector(r0,Math.max(rr,r0+3),a0,a1)+'" fill="'+(t==null?'var(--surface2)':col)+'" stroke="'+col+'" stroke-width="'+(t==null?1:.6)+'"/>'
     +'<text x="'+lp[0]+'" y="'+lp[1]+'" style="'+(c.roman.length>3?'font-size:10px':'')+'">'+esc(c.roman)+'</text></g>'});
  s+='<circle cx="210" cy="210" r="'+(r0-7)+'" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.2"/><g stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" fill="none"><circle cx="210" cy="210" r="9" fill="var(--accent)" stroke="none"/>';
  for(var k=0;k<12;k++){var a=k*30,p=pol(15,a),q=pol(k%2?22:27,a);s+='<path d="M'+(+p[0])+','+(+p[1])+' L'+(+q[0])+','+(+q[1])+'"/>'}
  return s+'</g></svg>'}
function mapItem(c,hi){var b=c.pred.bands,t=score(c.num);
  return '<details class="mi" style="--ac:'+ac(c)+'"><summary><span class="rn">'+roman(c)+'</span><span>'+esc(c.nome)+'</span><span class="v">'+t+'/8</span></summary><div class="prose"><p>'+esc(hi?b[2]:b[0])+'</p>'
   +(hi?'<p><strong>Pergunta-oráculo:</strong> <em>'+esc(c.oraculo)+'</em></p>':'<p><strong>Experimento da semana:</strong> '+esc(c.ativ.exp)+'</p><p class="afirm"><strong>Afirmação:</strong> <em>'+esc(c.ativ.afirm)+'</em></p>')
   +'<button class="link noprint" data-arc="'+c.num+'" data-tab="eu">Abrir a carta</button></div></details>'}
function vMapa(){var done=D.cards.filter(function(c){return score(c.num)!=null});
  var h='<div class="ph"><div class="kicker">Predominância</div><h1>Meu mapa</h1></div><p class="prose" style="margin:0 0 6px">Reúne os testes “É um arquétipo predominante em mim?” de cada carta. Mostra onde você tem mais acesso hoje e o que pede atenção. É um retrato do momento, não uma identidade.</p>';
  h+='<div class="wheelbox">'+wheel()+'</div><div class="legend">'+ACTS.map(function(a){return '<span style="--c:var('+a.cls+')">'+a.short+'</span>'}).join('')+'</div>';
  if(!done.length)h+='<div class="box" style="margin-top:14px"><b>Nenhum teste feito ainda.</b><p style="margin:6px 0 10px;font-size:14px;color:var(--muted)">Abra uma carta, vá em “Para mim” e marque as frases. Sua roda se desenha aqui, carta a carta.</p><button class="btn sm" data-arc="0" data-tab="eu">Começar pelo Louco</button></div>';
  else{var hi=done.filter(function(c){return score(c.num)>=6}),lo=done.filter(function(c){return score(c.num)<=2});
    var li=function(a,isHi){return a.length?a.map(function(c){return mapItem(c,isHi)}).join(''):'<div class="empty" style="padding:0">Nenhum por enquanto.</div>'};
    h+='<div class="cols"><div class="box"><h3 style="color:var(--a1)">Predominantes agora</h3>'+li(hi,true)+'</div><div class="box"><h3 style="color:var(--a2)">Pouco acessados</h3>'+li(lo,false)+'</div></div><p class="note" style="margin:0 0 6px">Cada carta de menos acesso é um convite: o que ela oferece e você ainda não usa? Cada predominante tem um oposto na sombra. Toque em uma carta para ver como ler o resultado.</p>'}
  h+='<div class="row-actions noprint" style="margin:14px 0 0"><button class="btn sm" data-act="printmap">Salvar meu mapa em PDF</button></div>';
  ACTS.forEach(function(a){var list=D.cards.filter(function(c){return c.ato===a.k});
    h+='<div class="act-head" style="--ac:var('+a.cls+')"><h2>'+a.name+'</h2></div>';
    list.forEach(function(c){var t=score(c.num);h+='<button class="mrowmap'+(t==null?' empty':'')+'" data-arc="'+c.num+'" data-tab="eu" style="--ac:'+ac(c)+'"><span class="rn">'+roman(c)+'</span><span><span class="nm">'+esc(c.nome)+'</span><span class="track"><i style="width:'+(t==null?0:t/8*100)+'%"></i></span></span><span class="v">'+(t==null?'fazer':t+'/8')+'</span></button>'})});
  return h+'<p class="note">Os arquétipos de Carol Pearson e o Mapa Arquetípico podem ser cruzados com este resultado no acompanhamento do curso.</p>'}

/* ---------- busca ---------- */
function buildIndex(){D.idx=[];D.cards.forEach(function(c){var t=[c.nome,c.palavras,c.oraculo].concat(Object.keys(c.sec).map(function(k){return strip(c.sec[k])})).concat(c.ativ.prompts).join(' · ');D.idx.push({t:t,n:norm(t),title:c.roman+' · '+c.nome,go:{view:'arc',n:c.num,tab:'img'}})});
  D.chap.forEach(function(c,i){var t=c.title+' '+strip(c.html);D.idx.push({t:t,n:norm(t),title:c.title,go:{view:'chap',i:i}})})}
function openSearch(){var ov=$('#ov');ov.hidden=false;ov.innerHTML='<div class="in"><div style="display:flex;gap:10px"><input class="sinput" id="q" type="search" placeholder="Buscar: sombra, individuação, Mago, luto…" autocomplete="off"><button class="ibtn" data-act="closeov" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div id="res"></div></div>';var q=$('#q');q.focus();q.addEventListener('input',function(){doSearch(q.value)})}
function doSearch(v){var r=$('#res'),q=norm(v.trim());if(q.length<2){r.innerHTML='';return}var out=[];
  D.idx.forEach(function(e,ix){var p=e.n.indexOf(q);if(p<0)return;var cnt=e.n.split(q).length-1;var a=Math.max(0,p-50),sn=e.t.slice(a,p+q.length+90);
    var pre=esc(sn.slice(0,p-a)),mid=esc(sn.slice(p-a,p-a+q.length)),post=esc(sn.slice(p-a+q.length));
    out.push({ix:ix,cnt:cnt,title:e.title,html:(a>0?'…':'')+pre+'<mark>'+mid+'</mark>'+post+'…'})});
  out.sort(function(a,b){return b.cnt-a.cnt});
  r.innerHTML=out.length?out.slice(0,25).map(function(o){return '<button class="hit" data-hit="'+o.ix+'"><b>'+esc(o.title)+'</b><span>'+o.html+'</span></button>'}).join(''):'<div class="empty">Nada encontrado para “'+esc(v)+'”.</div>'}
function closeOv(){var ov=$('#ov');ov.hidden=true;ov.innerHTML=''}
function zoom(n,k){var c=D.cards[n],ov=$('#ov');ov.hidden=false;ov.innerHTML='<div class="light" data-act="closeov"><img src="'+img(k,n)+'" alt="'+esc(c.nome)+'"><div class="note">'+esc(c.roman)+' · '+esc(c.nome)+' · '+(k==='rws'?'Rider-Waite-Smith':'Marselha')+' — toque para fechar</div></div>'}

/* ---------- abertura com a capa ---------- */
function showSplash(){var s=$('#splash');s.hidden=false;document.body.classList.add('noscroll');
  s.innerHTML='<div class="sp-art" role="img" aria-label="Capa da apostila Tarô Arquetípico: A Jornada do Herói, de Patricia Faccio"></div><div class="sp-cta"><button class="btn" data-act="enter">Iniciar a jornada</button><span>Toque para entrar</span></div>';
  var b=$('.btn',s);if(b)b.focus()}
function hideSplash(){var s=$('#splash');s.hidden=true;s.innerHTML='';document.body.classList.remove('noscroll');S.seen=1;save()}

/* ---------- eventos ---------- */
function onActivate(e){var t=e.target.closest('[data-go],[data-arc],[data-chap],[data-play],[data-tab],[data-act],[data-zoom],[data-hit],[data-pl],[data-delfree]');if(!t)return;
  var a=t.dataset.act;
  if(a==='enter'){hideSplash();return}
  if(a==='splash'){showSplash();return}
  if(a==='closeov'){closeOv();return}
  if(t.dataset.hit!=null){var h=D.idx[+t.dataset.hit];closeOv();go(h.go);return}
  if(t.dataset.zoom!=null){zoom(+t.dataset.zoom,t.dataset.k);return}
  if(t.dataset.pl){if(t.dataset.pl==='toggle')plToggle();else plMove(t.dataset.pl==='next'?1:-1);return}
  if(t.dataset.delfree){S.free=S.free.filter(function(x){return String(x.t)!==t.dataset.delfree});save();render();return}
  if(a==='otherq'){dayOff++;render();return}
  if(a==='read'){var y=window.scrollY;S.read[R.n]=!S.read[R.n];save();render();window.scrollTo(0,y);return}
  if(a==='addfree'){var ta=$('#freeText'),v=ta.value.trim();if(v){S.free.push({t:Date.now(),x:v});save();render()}return}
  if(a==='copyall'){var txt=exportText(),ok=function(m){var c=$('#copied');if(c)c.textContent=m};
    try{navigator.clipboard.writeText(txt).then(function(){ok('Copiado.')},function(){ok('Não foi possível copiar.')})}catch(er){ok('Não foi possível copiar.')}return}
  if(a==='dltxt'){download('diario-tarot-arquetipico.txt',exportText());return}
  if(a==='exportjson'){saveNow();download('tarot-arquetipico-backup.json',JSON.stringify(S,null,1),'application/json');return}
  if(a==='importjson'){var f=$('#impfile');if(f)f.click();return}
  if(a==='printmap'){window.print();return}
  if(t.dataset.tab&&t.dataset.arc!=null){go({view:'arc',n:+t.dataset.arc,tab:t.dataset.tab});return}
  if(t.dataset.tab&&R.view==='arc'){go({view:'arc',n:R.n,tab:t.dataset.tab},true);return}
  if(t.dataset.arc!=null){go({view:'arc',n:+t.dataset.arc,tab:'img'});return}
  if(t.dataset.chap!=null){go({view:'chap',i:+t.dataset.chap});return}
  if(t.dataset.play!=null){go({view:'play',n:+t.dataset.play});return}
  if(t.dataset.go){go({view:t.dataset.go})}}
document.addEventListener('click',onActivate);
$('#splash').addEventListener('click',function(e){if(!e.target.closest('[data-act="enter"]'))hideSplash()});
document.addEventListener('input',function(e){var t=e.target;
  if(t.dataset&&t.dataset.note){S.notes[t.dataset.note]=t.value;save();var s=t.parentNode.querySelector('.saved');if(s)s.textContent='Salvo'}});
document.addEventListener('change',function(e){var t=e.target;
  if(t.id==='voice'){if(P){P.voice=t.checked;if(P.playing)plStep()}return}
  if(t.id==='impfile'){if(t.files&&t.files[0])importJson(t.files[0]);t.value='';return}
  if(t.dataset&&t.dataset.pred!=null){var n=+t.dataset.pred,a=S.pred[n]||D.cards[n].pred.items.map(function(){return false});a[+t.dataset.i]=t.checked;S.pred[n]=a;save();$('#score').innerHTML=scoreInner(D.cards[n],score(n))}});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){closeOv();if(!$('#splash').hidden)hideSplash();return}
  var el=e.target;
  if((e.key==='Enter'||e.key===' ')&&el.getAttribute&&el.getAttribute('role')==='link'&&el.closest('svg')){e.preventDefault();onActivate({target:el});return}
  var typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement&&document.activeElement.tagName);
  if(!typing&&R.view==='arc'&&$('#ov').hidden&&$('#splash').hidden&&(e.key==='ArrowLeft'||e.key==='ArrowRight')&&!e.altKey&&!e.ctrlKey&&!e.metaKey){
    var n=R.n+(e.key==='ArrowRight'?1:-1);if(n>=0&&n<22)go({view:'arc',n:n,tab:R.tab||'img'})}});
$('#brand').addEventListener('click',function(){go({view:'home'})});
$('#btnSearch').addEventListener('click',function(){openSearch()});
$('#btnTheme').addEventListener('click',function(){S.theme=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';setTheme(S.theme);save()});
$('#btnFs').addEventListener('click',function(){S.fs=((S.fs||0)+1)%FS.length;setFs();save()});
window.addEventListener('hashchange',function(){var r=fromHash();if(hashOf(r)!==hashOf(R)){R=r;render();window.scrollTo(0,0)}});
/* ao imprimir o mapa, abre todos os detalhes para sair completo no PDF */
var wasOpen=[];
window.addEventListener('beforeprint',function(){wasOpen=[];document.querySelectorAll('details.mi').forEach(function(d,i){if(!d.open){d.open=true;wasOpen.push(i)}})});
window.addEventListener('afterprint',function(){var all=document.querySelectorAll('details.mi');wasOpen.forEach(function(i){if(all[i])all[i].open=false})});

/* ---------- início ---------- */
setTheme(S.theme);setFs();
D.chap=[{title:(D.pre.match(/<h1>(.*?)<\/h1>/)||[0,'Antes de começar'])[1].replace(/<[^>]+>/g,''),html:D.pre.replace(/<h1>.*?<\/h1>/,'')}].concat(D.intro);
buildIndex();R=fromHash();render();
if(!S.seen&&R.view==='home')showSplash();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
})();
