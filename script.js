const cardImages = ['card1.png', 'card2.png', 'card3.png']; // match your real images!
const cardBack = 'card.png';
const shuffleDuration = 5000;
const shuffleSpeed = 140;

const landingBox = document.getElementById('landing-box');
const gameBox = document.getElementById('game-box');
const resultBox = document.getElementById('result-box');
const cardsDiv = document.getElementById('cards');
const gameMessage = document.getElementById('game-message');
const startBtn = document.getElementById('start-btn');
const shareBtn = document.getElementById('share-btn');
const restartBtn = document.getElementById('restart-btn');
const resultTitle = document.getElementById('result-title');
const resultDesc = document.getElementById('result-desc');

let cardsState = [0, 1, 2]; // current card index at each slot (visual order)
let userInitialPick = null; // value: 0, 1, or 2 (which card user chose)
let canPick = false;
let shuffleTimer = null;

// Landing → Game
startBtn.onclick = () => {
  landingBox.style.display = 'none';
  resultBox.style.display = 'none';
  initGame();
};

// Restart (from result screen)
restartBtn.onclick = () => {
  resultBox.style.display = 'none';
  landingBox.style.display = '';
};

// Share on X
shareBtn.onclick = () => {
  window.open(
    'https://x.com/intent/tweet?text=' +
      encodeURIComponent('I just won the Union Cards Shuffle game! My Union maxi vision is next-level. 🦅 Preach Union! #UnionMaxi'),
    '_blank'
  );
};

function initGame() {
  cardsState = [0, 1, 2];
  userInitialPick = null;
  canPick = true;
  gameBox.style.display = '';
  drawCardsFaceUp();
  gameMessage.textContent = 'Pick a card to track…';
}

function drawCardsFaceUp() {
  cardsDiv.innerHTML = '';
  cardsDiv.style.position = 'relative';
  cardsDiv.style.width = `${3 * 112 - 14}px`; // 3 cards, gap 14px
  cardsDiv.style.height = '142px';
  cardsState.forEach((cIdx, i) => {
    const img = document.createElement('img');
    img.src = `images/${cardImages[cIdx]}`;
    img.className = 'card-img';
    img.style.position = 'absolute';
    img.style.left = `${i * 112}px`;
    img.style.top = `0px`;
    img.style.transform = 'none';
    img.onclick = () => {
      if (!canPick) return;
      userInitialPick = cIdx;
      canPick = false;
      highlightCard(i);
      setTimeout(() => flipAllToBacks(), 600);
    };
    cardsDiv.appendChild(img);
  });
}

function highlightCard(idx) {
  const imgs = cardsDiv.querySelectorAll('.card-img');
  imgs.forEach((img, i) => {
    img.classList.toggle('selected', i === idx);
  });
}

function flipAllToBacks() {
  cardsDiv.querySelectorAll('.card-img').forEach(img => {
    img.src = `images/${cardBack}`;
    img.classList.remove('selected');
  });
  gameMessage.textContent = 'Shuffling cards… Watch closely!';
  setTimeout(() => startShuffle(), 500);
}

function startShuffle() {
  canPick = false;
  let t = 0;
  // Setup absolute positions for animation
  setupAbsoluteCardLayout();

  shuffleTimer = setInterval(() => {
    const [a, b] = getTwoUnique(0, 2);
    [cardsState[a], cardsState[b]] = [cardsState[b], cardsState[a]];
    animateShuffle();
    t += shuffleSpeed;
  }, shuffleSpeed);

  setTimeout(() => {
    clearInterval(shuffleTimer);
    animateShuffle();
    canPick = true;
    gameMessage.textContent = 'Where is your card? Tap to find out!';
    enableFinalSelection();
  }, shuffleDuration);
}

// Make cards absolute for visible movement (ensures perfect layout always)
function setupAbsoluteCardLayout() {
  const cards = cardsDiv.querySelectorAll('.card-img');
  cardsDiv.style.position = 'relative';
  cardsDiv.style.width = `${3 * 112 - 14}px`;
  cardsDiv.style.height = '142px';
  cards.forEach((img, i) => {
    img.style.position = 'absolute';
    img.style.left = `${i * 112}px`;
    img.style.top = `0px`;
    img.style.transition = 'left 0.28s cubic-bezier(.23,1.18,.48,.97)';
    img.onclick = null;
  });
}

// Animate to current cardsState
function animateShuffle() {
  const cards = cardsDiv.querySelectorAll('.card-img');
  let slotForIndex = [0, 0, 0]; // cardIdx -> slot position
  cardsState.forEach((cardIdx, slot) => {
    slotForIndex[cardIdx] = slot;
  });
  cards.forEach((img, idx) => {
    // original DOM order matches cardIdx
    const slot = slotForIndex[idx];
    img.style.left = `${slot * 112}px`;
  });
}

function enableFinalSelection() {
  const cards = cardsDiv.querySelectorAll('.card-img');
  cards.forEach((img, idx) => {
    img.onclick = () => {
      if (!canPick) return;
      canPick = false;
      // Reveal all cards
      cards.forEach((im, slot) => {
        im.src = `images/${cardImages[cardsState[slot]]}`;
        im.classList.toggle('selected', slot === idx);
      });
      setTimeout(() => {
        if (cardsState[idx] === userInitialPick) {
          showResult(true);
        } else {
          showResult(false);
        }
      }, 900);
    };
  });
}

// Result page
function showResult(win) {
  gameBox.style.display = 'none';
  resultBox.style.display = '';
  if (win) {
    resultTitle.textContent = '🎉 Congratulations, You Won!';
    resultDesc.textContent =
      'I just won the Union Cards Shuffle game!\n\nMy Union maxi vision is next-level.\n\nPreach Union! #UnionMaxi\n\nTry the game yourself: union-card.vercel.app\n\nx.com/shinosuka';
    shareBtn.style.display = '';
  } else {
    resultTitle.textContent = '❌ Wrong Card!';
    resultDesc.textContent =
      'Not quite! Try again to hone your Union maxi eyes.';
    shareBtn.style.display = 'none';
  }
}

// Utility
function getTwoUnique(min, max) {
  const a = Math.floor(Math.random() * (max + 1));
  let b;
  do {
    b = Math.floor(Math.random() * (max + 1));
  } while (b === a);
  return [a, b];
}

// Optional: Always start on landing box
window.onload = () => {
  landingBox.style.display = '';
  gameBox.style.display = 'none';
  resultBox.style.display = 'none';
};
