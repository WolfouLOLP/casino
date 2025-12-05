// ---------------------------let tokens = parseInt(localStorage.getItem('playerTokens'),10);
if(isNaN(tokens)) tokens=100;

if(!localStorage.getItem('playerName')){
  const pseudo = prompt("Bienvenue au casino ! Choisis ton pseudo :","Joueur");
  localStorage.setItem('playerName',pseudo||"Joueur");
}

updateTokens();

function updateTokens(){
  document.getElementById('token-balance').innerText = `Jetons : ${tokens}`;
  localStorage.setItem('playerTokens', tokens);
  animateBalance();
  saveLeaderboard();
}

function animateBalance(){
  const bal = document.getElementById('token-balance');
  bal.classList.add('animate');
  setTimeout(()=> bal.classList.remove('animate'),300);
}

// ---------- Leaderboard ----------
function saveLeaderboard(){
  const name = localStorage.getItem('playerName') || 'Joueur';
  let lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  const existing = lb.find(e => e.name===name);
  if(existing){ if(tokens>existing.tokens) existing.tokens=tokens;}
  else lb.push({name,tokens});
  lb.sort((a,b)=>b.tokens-a.tokens);
  localStorage.setItem('leaderboard', JSON.stringify(lb.slice(0,10)));
}

function openLeaderboard(){
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('leaderboard-area').classList.remove('hidden');

  const list = document.getElementById('leaderboard-list');
  list.innerHTML='';
  const lb = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  if(lb.length===0) list.innerHTML="<li>Aucun joueur pour le moment</li>";
  else lb.forEach((e,i)=>{
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${e.name} — ${e.tokens} jetons`;
    list.appendChild(li);
  });
}

function closeLeaderboard(){
  document.getElementById('leaderboard-area').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
}

// ---------- Recharger ----------
document.getElementById('refill-tokens').onclick = ()=>{
  if(tokens>0){ alert("Tu as encore des jetons !"); return;}
  tokens=100; updateTokens(); alert("Tes jetons ont été rechargés !");
}

// ---------- Jeux ----------
function openGame(name){
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('leaderboard-area').classList.add('hidden');
  const container = document.getElementById('game-container');
  document.getElementById('game-area').classList.remove('hidden');
  container.innerHTML = '';

  if(name==='slots') playSlots(container);
  else if(name==='roulette') playRoulette(container);
  else if(name==='dice') playDice(container);
  else if(name==='coinFlip') playCoin(container);
  else if(name==='guessNumber') playGuess(container);
}

function closeGame(){
  document.getElementById('game-area').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
}

// ---------- Slots ----------
function playSlots(container){
  container.innerHTML = `
    <h3>🎰 Slots</h3>
    <p id="slot-msg">Misez 10 jetons</p>
    <button onclick="spinSlots()">Spin</button>
  `;
}

function spinSlots(){
  if(tokens<10){ alert("Pas assez de jetons !"); return; }
  tokens-=10; 
  updateTokens();
  const fruits = ['🍒','🍋','🍊','🍉','⭐'];
  const result = [rand(fruits),rand(fruits),rand(fruits)];
  const msg = document.getElementById('slot-msg');
  msg.textContent = result.join(' | ');
  if(result[0]===result[1] && result[1]===result[2]){
    tokens+=50;
    updateTokens();
    animateTokens(10);
    msg.textContent += ' — Jackpot +50 jetons ! 🎉';
  }
}

// ---------- Roulette ----------
function playRoulette(container){
  container.innerHTML = `
    <h3>🎡 Roulette</h3>
    <p id="roulette-msg">Misez un nombre entre 0 et 5 (10 jetons)</p>
    <input type="number" id="roulette-bet" min="0" max="5">
    <button onclick="spinRoulette()">Spin</button>
  `;
}

function spinRoulette(){
  const bet = parseInt(document.getElementById('roulette-bet').value,10);
  if(isNaN(bet)||bet<0||bet>5){ alert("Nombre invalide !"); return; }
  if(tokens<10){ alert("Pas assez de jetons !"); return; }
  tokens-=10;
  updateTokens();
  const number = Math.floor(Math.random()*6);
  const msg = document.getElementById('roulette-msg');
  msg.textContent = `Numéro sorti : ${number}`;
  if(number===bet){
    tokens+=60;
    updateTokens();
    animateTokens(10);
    msg.textContent += ' — Gagné +60 jetons ! 🎉';
  }
}

// ---------- Dés ----------
function playDice(container){
  container.innerHTML = `
    <h3>🎲 Dés</h3>
    <p id="dice-msg">Misez 5 jetons sur Pair ou Impair</p>
    <select id="dice-bet"><option value="pair">Pair</option><option value="impair">Impair</option></select>
    <button onclick="rollDice()">Lancer</button>
  `;
}

function rollDice(){
  if(tokens<5){ alert("Pas assez de jetons !"); return; }
  tokens-=5;
  updateTokens();
  const dice = Math.floor(Math.random()*6)+1;
  const msg = document.getElementById('dice-msg');
  msg.textContent = `Résultat du dé : ${dice}`;
  const choice = document.getElementById('dice-bet').value;
  if((dice%2===0 && choice==='pair')||(dice%2===1 && choice==='impair')){
    tokens+=10;
    updateTokens();
    animateTokens(5);
    msg.textContent += ' — Gagné +10 jetons ! 🎉';
  }
}

// ---------- Pile ou Face ----------
function playCoin(container){
  container.innerHTML = `
    <h3>🪙 Pile ou Face</h3>
    <p id="coin-msg">Misez 5 jetons sur Pile ou Face</p>
    <select id="coin-bet"><option value="pile">Pile</option><option value="face">Face</option></select>
    <button onclick="flipCoin()">Lancer</button>
  `;
}

function flipCoin(){
  if(tokens<5){ alert("Pas assez de jetons !"); return; }
  tokens-=5;
  updateTokens();
  const result = rand(['pile','face']);
  const bet = document.getElementById('coin-bet').value;
  const msg = document.getElementById('coin-msg');
  msg.textContent = `Résultat : ${result}`;
  if(result===bet){
    tokens+=10;
    updateTokens();
    animateTokens(5);
    msg.textContent += ' — Gagné +10 jetons ! 🎉';
  }
}

// ---------- Chiffre Mystère ----------
function playGuess(container){
  container.innerHTML = `
    <h3>🔢 Chiffre Mystère</h3>
    <p id="guess-msg">Misez 5 jetons et devinez un nombre entre 1 et 5</p>
    <input type="number" id="guess-bet" min="1" max="5">
    <button onclick="guessNumber()">Deviner</button>
  `;
}

function guessNumber(){
  if(tokens<5){ alert("Pas assez de jetons !"); return; }
  tokens-=5;
  updateTokens();
  const number = Math.floor(Math.random()*5)+1;
  const bet = parseInt(document.getElementById('guess-bet').value,10);
  const msg = document.getElementById('guess-msg');
  msg.textContent = `Le chiffre était : ${number}`;
  if(bet===number){
    tokens+=20;
    updateTokens();
    animateTokens(5);
    msg.textContent += ' — Gagné +20 jetons ! 🎉';
  }
}

// ---------- Animation jetons ----------
function animateTokens(count){
  const container=document.getElementById('token-animation');
  for(let i=0;i<count;i++){
    const token=document.createElement('div');
    token.innerText='💰';
    token.style.position='absolute';
    token.style.fontSize=`${10+Math.random()*20}px`;
    token.style.left=`${Math.random()*window.innerWidth}px`;
    token.style.top='-30px';
    token.style.opacity=1;
    token.style.transition='transform 2s ease, opacity 2s ease';
    container.appendChild(token);
    setTimeout(()=>{
      token.style.transform=`translateY(${window.innerHeight+50}px) rotate(${Math.random()*360}deg)`;
      token.style.opacity=0;
    },50);
    setTimeout(()=>container.removeChild(token),2100);
  }
}

// ---------- Utilitaires ----------
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

