const accountEl = document.getElementById("account-el");
const navBarBrand = document.querySelector(".navbar-brand");
const navBarMenu = document.querySelector(".navbar-menu");
const modal = document.querySelector(".modal");
const landingMsg = document.getElementById("landing-msg");

const deleteAccountBtn = document.getElementById("delete-account-btn");

const accountForm = document.getElementById("account-form");
const usernameInput = document.getElementById("username-input");
const startingDeck = document.getElementById("deck-select");
const experienceLevel = document.getElementsByName("experience");

const newGameForm = document.getElementById("new-game-form");
const nameInput = document.getElementById("name-input");
const classSelect = document.getElementById("class-select");
const difficultyInput = document.getElementsByName("difficulty");
const profanityInput = document.getElementById("profanity-input");

const feltView = document.getElementById("felt-view");
const heroEl = document.querySelector(".hero");
const heroHead = document.querySelector(".hero-head");
const heroBody = document.querySelector(".hero-body");
const heroFoot = document.querySelector(".hero-foot");
const footer = document.querySelector(".footer");

const gameOver = document.getElementById("game-over");

const enemyAvatar = document.getElementById("enemy-avatar");
const playerAvatar = document.getElementById("player-avatar");

const powerCounter = document.getElementById("power-counter");

const enemyHand = document.getElementById("enemy-hand");
const playerHand = document.getElementById("player-hand");

const noMansLand = document.getElementById("no-mans-land");

const enemyField = document.getElementById("enemy-field");
const playerField = document.getElementById("player-field");

const playerCard1 = document.getElementById("player-card-1");
const playerCard2 = document.getElementById("player-card-2");
const playerCard3 = document.getElementById("player-card-3");
const playerCard4 = document.getElementById("player-card-4");

const enemyCard1 = document.getElementById("enemy-card-1");
const enemyCard2 = document.getElementById("enemy-card-2");
const enemyCard3 = document.getElementById("enemy-card-3");
const enemyCard4 = document.getElementById("enemy-card-4");

const endTurnBtn = document.getElementById("end-turn-btn");
const imgTop = document.querySelector(".img-top");

const enemyHealth = document.getElementById("enemy-health");
const enemyPower = document.getElementById("enemy-power");
const playerHealth = document.getElementById("player-health");
const playerPower = document.getElementById("player-power");

const newGameBtn = document.getElementById("new-game-btn");

const youWon = document.getElementById("you-won");
const youLost = document.getElementById("you-lost");

const loadingBar = document.createElement("progress");
const msg = document.createElement("img");
msg.src = "./assets/images/box1.png";
msg.style.width = "25vw";
const msgText = document.createElement("div");

const localStorageData = JSON.parse(localStorage.getItem("bloodgateUser"));

const restartBtn = document.getElementById("restart-btn");

$insetGoldGlow =
  "inset gold -15px -15px 10px, inset gold 15px -15px 10px, inset gold 15px 15px 10px, inset gold -15px 15px 10px";
$insetRedGlow =
  "inset red 15px 15px 10px, inset red 15px -15px 10px, inset red -15px -15px 10px, inset red -15px 15px 10px";

$redGlow = "0 0 50px 25px rgb(255,0,0)";
$blueGlow = "0 0 50px 25px rgb(0,0,255)";
$goldGlow = "0 0 50px 25px rgb(255,215,0)";

let turnCounter = 0;

let bloodgateUser = {
  username: "",
  experience: "",
  startingDeck: "",
};

let player = {
  name: "",
  class: "",
  power: 0,
  health: 30,
  deck: null,
  hand: [],
};

let settings = {
  difficulty: 0,
  profanity: false,
};

let enemy = {
  name: "testBot",
  power: 0,
  health: 30,
  deck: "bloodfury-dominion",
  hand: [],
};

let discardPile = [];

let thinkingInterval;

let playerCards = playerField.children;
let enemyCards = enemyField.children;

function buttonPressed(event) {
  event.target.src = "./assets/images/buttonPressed.png";
  event.target.style.top = "0";
}

function buttonReleased(event) {
  event.target.src = "./assets/images/buttonHighLight.png";
  event.target.style.top = "-3px";
}

function hover(event) {
  event.target.style.boxShadow = $goldGlow;

  // 🎮 THREE.JS: Epic 3D hover effect
  if (typeof window.bloodgateThree !== 'undefined' && window.bloodgateThree && window.bloodgateThree.scene) {
    window.bloodgateThree.cardHoverEffect(event.target, true);
  }
}

function unhover(event) {
  event.target.style.boxShadow = $blueGlow;

  // 🎮 THREE.JS: Reset hover effect
  if (typeof window.bloodgateThree !== 'undefined' && window.bloodgateThree && window.bloodgateThree.scene) {
    window.bloodgateThree.cardHoverEffect(event.target, false);
  }
}

function attackTargetHover(event) {
  event.target.style.boxShadow = $redGlow;
}
function attackTargetUnhover(event) {
  event.target.style.boxShadow = $goldGlow;
}

// Opponent Trash Talk Window
function notification(message) {
  const notification = document.createElement("div");
  notification.classList.add("notification", "is-warning", "is-full");
  notification.style.whiteSpace = "nowrap";
  notification.style.width = "fit-content";
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete");
  notification.appendChild(deleteBtn);
  notification.textContent = message;
  const h = window.innerHeight / 1.5;
  gsap.fromTo(
    notification,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      yPercent: h,
    }
  );
  enemyAvatar.prepend(notification);
  setTimeout(function () {
    enemyAvatar.removeChild(notification);
  }, 6000);
}

// {Player's} card floats with red shadow
// *We use this to show which cards are in play on player's turn
function cardReady(cardEl) {
  cardEl.style.transition = "all 400ms";
  cardEl.style.transform = "translateY(-15px)";
  cardEl.style.boxShadow = $blueGlow;
  cardEl.style.animation = "3s ease 1200ms infinite alternate bounce";
}

// {Enemy's} card is highlighted by a gold shadow
// *Use this to show which enemy card the player is targeting for attack
function targetCard(cardEl) {
  cardEl.dataset.state = "in-play";
  cardEl.style.transition = "all 300ms";
  cardEl.style.boxShadow = $goldGlow;
  cardEl.addEventListener("mouseenter", attackTargetHover);
  cardEl.addEventListener("mouseleave", attackTargetUnhover);
  cardEl.addEventListener("click", attackTarget);
}
function removeTarget(cardEl) {
  cardEl.style.boxShadow = "none";
  cardEl.removeEventListener("mouseenter", attackTargetHover);
  cardEl.removeEventListener("mouseleave", attackTargetUnhover);
  cardEl.removeEventListener("click", attackTarget);
}

function resetGame() {
  // Reset game state
  turnCounter = 0;
  player.power = 0;
  player.health = 30;
  player.hand = [];
  enemy.power = 0;
  enemy.health = 30;
  enemy.hand = [];
  discardPile = [];

  // Clear fields
  while (playerField.firstChild) {
    playerField.removeChild(playerField.firstChild);
  }
  while (enemyField.firstChild) {
    enemyField.removeChild(enemyField.firstChild);
  }
  while (playerHand.firstChild) {
    playerHand.removeChild(playerHand.firstChild);
  }
  while (enemyHand.firstChild) {
    enemyHand.removeChild(enemyHand.firstChild);
  }

  // Recreate initial cards
  const cardContainer = document.createElement("div");
  for (let i = 1; i <= 4; i++) {
    const card = document.createElement("div");
    card.id = `player-card-${i}`;
    card.classList.add("player-card", "is-size-1", "has-text-black");
    const img = document.createElement("img");
    card.appendChild(img);
    playerHand.appendChild(card);
  }

  for (let i = 1; i <= 3; i++) {
    const card = document.createElement("div");
    card.id = `enemy-card-${i}`;
    card.classList.add("enemy-card");
    enemyHand.appendChild(card);
  }

  // Hide game over, show game view
  youWon.classList.add("is-hidden");
  youLost.classList.add("is-hidden");
  gameOver.classList.add("is-hidden");
  feltView.classList.remove("is-hidden");
  heroEl.style.backgroundImage = "url(./assets/images/red-felt.jpeg)";

  // Reload deck and restart game
  getDeck(player, bloodgateUser.startingDeck);
  getDeck(enemy, "bloodfury-dominion");

  // Restart game after brief delay to let decks load
  setTimeout(() => {
    // Re-assign card elements since we recreated them
    const newPlayerCard1 = document.getElementById("player-card-1");
    const newPlayerCard2 = document.getElementById("player-card-2");
    const newPlayerCard3 = document.getElementById("player-card-3");
    const newPlayerCard4 = document.getElementById("player-card-4");
    const newEnemyCard1 = document.getElementById("enemy-card-1");
    const newEnemyCard2 = document.getElementById("enemy-card-2");
    const newEnemyCard3 = document.getElementById("enemy-card-3");

    turnCounter++;
    player.power++;
    enemy.power++;
    powerCounter.textContent = player.power;

    playerHealth.value = player.health;
    playerPower.max = player.power * 100;
    playerPower.value = player.power * 100;

    newPlayerCard1.addEventListener("click", playCard);
    setCardProps(newPlayerCard1, player.deck);
    newPlayerCard1.children[0].src = newPlayerCard1.dataset.img;
    createStats(newPlayerCard1);
    player.hand.push(newPlayerCard1);

    newPlayerCard2.addEventListener("click", playCard);
    setCardProps(newPlayerCard2, player.deck);
    newPlayerCard2.children[0].src = newPlayerCard2.dataset.img;
    createStats(newPlayerCard2);
    player.hand.push(newPlayerCard2);

    newPlayerCard3.addEventListener("click", playCard);
    setCardProps(newPlayerCard3, player.deck);
    newPlayerCard3.children[0].src = newPlayerCard3.dataset.img;
    createStats(newPlayerCard3);
    player.hand.push(newPlayerCard3);

    newPlayerCard4.addEventListener("click", playCard);
    setCardProps(newPlayerCard4, player.deck);
    newPlayerCard4.children[0].src = newPlayerCard4.dataset.img;
    createStats(newPlayerCard4);
    player.hand.push(newPlayerCard4);

    setCardProps(newEnemyCard1, enemy.deck);
    enemy.hand.push(newEnemyCard1);
    setCardProps(newEnemyCard2, enemy.deck);
    enemy.hand.push(newEnemyCard2);
    setCardProps(newEnemyCard3, enemy.deck);
    enemy.hand.push(newEnemyCard3);

    enemyHealth.value = enemy.health;
    enemyPower.max = enemy.power * 100;
    enemyPower.value = enemy.power * 100;

    endTurnBtn.addEventListener("click", endPlayerTurn);
    endTurnBtn.addEventListener("mousedown", buttonPressed);
    endTurnBtn.addEventListener("mouseup", buttonReleased);
  }, 500);
}

function endGame() {
  // Save game stats to localStorage
  const stats = JSON.parse(localStorage.getItem("bloodgateStats")) || {
    wins: 0,
    losses: 0,
    gamesPlayed: 0
  };

  stats.gamesPlayed++;

  feltView.classList.add("is-hidden");
  gameOver.classList.remove("is-hidden");
  if (enemy.health <= 0) {
    stats.wins++;
    youWon.classList.remove("is-hidden");
    heroEl.style.backgroundImage = "url(./assets/images/victory.jpg)";
  } else {
    stats.losses++;
    youLost.classList.remove("is-hidden");
    heroEl.style.backgroundImage = "url(./assets/images/defeat.jpg)";
  }

  localStorage.setItem("bloodgateStats", JSON.stringify(stats));

  restartBtn.removeEventListener("click", location.reload);
  restartBtn.addEventListener("click", resetGame);
  return;
}

function gBCR(elem) {
  return elem.getBoundingClientRect();
}

function attackTarget(event) {
  const readyToAttack = document.querySelector(".ready-to-attack");
  for (let i = 0; i < playerCards.length; i++) {
    playerCards[i].removeEventListener("click", AtkMsg);
  }
  const target = event.currentTarget;

  // 🎮 THREE.JS: Epic attack projectile animation
  if (typeof window.bloodgateThree !== 'undefined' && window.bloodgateThree && window.bloodgateThree.scene) {
    window.bloodgateThree.createAttackAnimation(readyToAttack, target, readyToAttack.dataset.atk);
  }

  // If the player attacks the enemy directly
  if (target.id === "enemy-avatar") {
    enemy.health -= readyToAttack.dataset.atk;
    enemyHealth.value = enemy.health;
    var tween = gsap.fromTo(
      target,
      {
        boxShadow: "inset 0 0 25px 25px red",
      },
      {
        boxShadow: "inset 0 0 25px 0 red",
        ease: "elastic.out(1, 0.3)",
      }
    );
    tween.play();
    if (enemy.health <= 0) {
      endGame();
    }
  }
  // If the player attacks an enemy card
  else if (target.dataset.state === "in-play") {
    var tween2 = gsap.fromTo(
      target.children[0],
      {
        boxShadow: "inset 0 0 100px 25px red, 0 0 25px 25px red",
        duration: 1,
      },
      {
        clearProps: "box-shadow",
        ease: "elastic.out(1, 0.3)",
      }
    );
    tween2.play();
    // Subtract the player card's atk score from the enemy card's def score
    target.dataset.def -= readyToAttack.dataset.atk;
    target.children[3].textContent = target.dataset.def;
    target.children[3].style.color = "red";

    // If the enemy card survives the attack
    if (target.dataset.def > 0) {
      // Enemy card survived
    }
    // If the enemy card loses the battle
    else {
      if (player.class === "barbarian") {
        enemy.health -= -target.dataset.def;
        enemyHealth.value = enemy.health;
      }
      discardPile.push(target);
      target.remove();
    }
    readyToAttack.dataset.def -= target.dataset.atk;
    readyToAttack.children[3].textContent = readyToAttack.dataset.def;
    readyToAttack.children[3].style.color = "red";

    if (readyToAttack.dataset.def > 0) {
      // Player card survived
    } else {
      discardPile.push(readyToAttack);
      readyToAttack.remove();
    }
    if (playerCards.length < 4) {
      for (let i = 0; i < playerHand.children.length; i++) {
        playerHand.children[i].removeEventListener("click", playCard);
        playerHand.children[i].addEventListener("click", playCard);
      }
    }
  }
  enemyAvatar.style.boxShadow = "none";
  enemyAvatar.removeEventListener("mouseenter", attackTargetHover);
  enemyAvatar.removeEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.removeEventListener("click", attackTarget);

  if (enemyCards) {
    for (let i = 0; i < enemyCards.length; i++) {
      removeTarget(enemyCards[i]);
    }
  }

  readyToAttack.style.boxShadow = "none";
  readyToAttack.style.transform = "translateY(15px)";
  readyToAttack.dataset.state = "exhausted";
  readyToAttack.classList.add("card-inactive");
  readyToAttack.classList.remove("ready-to-attack");
  for (let i = 0; i < playerCards.length; i++) {
    if (playerCards[i].dataset.state === "on-guard") {
      cardReady(playerCards[i]);
      playerCards[i].addEventListener("click", AtkMsg);
    }
  }
}

function removeAtkMsg() {
  const readyToAttack = document.querySelector(".ready-to-attack");
  readyToAttack.style.boxShadow = "none";
  readyToAttack.style.transform = "translateY(15px)";
  readyToAttack.classList.add("played-card");
  for (let i = 0; i < playerCards.length; i++) {
    if (
      playerCards[i].dataset.state !== "exhausted" &&
      playerCards[i].dataset.state !== "in-play"
    ) {
      cardReady(playerCards[i]);
      playerCards[i].dataset.state = "on-guard";
      playerCards[i].addEventListener("click", AtkMsg);
      playerCards[i].addEventListener("mouseenter", hover);
      playerCards[i].addEventListener("mouseleave", unhover);
    }
  }
  readyToAttack.classList.remove("ready-to-attack");

  enemyAvatar.style.boxShadow = "none";
  enemyAvatar.removeEventListener("mouseenter", attackTargetHover);
  enemyAvatar.removeEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.removeEventListener("click", attackTarget);
  if (enemyCards) {
    for (let i = 0; i < enemyCards.length; i++) {
      removeTarget(enemyCards[i]);
    }
  }
}

function AtkMsg() {
  const attacker = this;
  attacker.removeEventListener("mouseenter", hover);
  attacker.removeEventListener("mouseleave", unhover);
  if (attacker.dataset.state === "ready-to-attack") {
    removeAtkMsg();
    return;
  }
  /* For each card in the player's field, if it is not the attacker, set its animation to null, set its
  box shadow to none, and set its transform to translateY(15px). If the card is not exhausted or in
  play, set its state to on-guard. */
  for (let i = 0; i < playerCards.length; i++) {
    if (playerCards[i] !== attacker) {
      playerCards[i].removeEventListener("mouseenter", hover);
      playerCards[i].removeEventListener("mouseleave", unhover);
      playerCards[i].style.animation = null;
      playerCards[i].style.boxShadow = "none";
      playerCards[i].style.transform = "translateY(15px)";
      if (
        playerCards[i].dataset.state !== "exhausted" &&
        playerCards[i].dataset.state !== "in-play"
      ) {
        playerCards[i].dataset.state = "on-guard";
      }
    }
  }
  attacker.style.animation = null;
  attacker.style.boxShadow = $redGlow;
  attacker.classList.remove("played-card");
  attacker.classList.add("ready-to-attack");
  attacker.dataset.state = "ready-to-attack";
  enemyAvatar.style.transition = "all 300ms";
  enemyAvatar.style.boxShadow = $goldGlow;
  enemyAvatar.addEventListener("mouseenter", attackTargetHover);
  enemyAvatar.addEventListener("mouseleave", attackTargetUnhover);
  enemyAvatar.addEventListener("click", attackTarget);
  if (enemyCards) {
    for (let i = 0; i < enemyCards.length; i++) {
      targetCard(enemyCards[i]);
    }
  }
}

function displayHand(hand) {
  let output = "";
  for (let i = 0; i < hand.length; i++) {
    output += hand[i].dataset.name + " cost=" + hand[i].dataset.cost + ", ";
  }
  return output;
}

function startPlayerTurn() {
  // draws a card
  if (player.deck.length > 0) {
    const newCard = document.createElement("div");
    newCard.classList.add("player-card", "is-size-1", "has-text-black");
    setCardProps(newCard, player.deck);
    const cardImg = document.createElement("img");
    cardImg.src = newCard.dataset.img;
    cardImg.style.transform = "scale(1.2)";
    newCard.appendChild(cardImg);

    const costStat = document.createElement("div");
    costStat.classList.add("cost-stat");
    costStat.textContent = newCard.dataset.cost;
    newCard.appendChild(costStat);

    const atkStat = document.createElement("div");
    atkStat.classList.add("atk-stat");
    atkStat.textContent = newCard.dataset.atk;
    newCard.appendChild(atkStat);

    const defStat = document.createElement("div");
    defStat.classList.add("def-stat");
    defStat.textContent = newCard.dataset.def;
    newCard.appendChild(defStat);

    gsap.fromTo(
      newCard,
      {
        onStart: function () {
          playerHand.append(newCard);
        },
        x: 700,
        onComplete: function () {
          playerHand.appendChild(newCard);
        },
      },
      {
        x: 0,
        onComplete: function () {
          gsap.set(newCard, {
            clearProps: "all",
          });
        },
      }
    );
    player.hand.push(newCard);
  }

  // Make cards in hand clickable to play
  if (playerCards.length < 4) {
    for (let i = 0; i < playerHand.children.length; i++) {
      playerHand.children[i].removeEventListener("click", playCard);
      playerHand.children[i].addEventListener("click", playCard);
    }
  }

  // Initiates cards for attack
  if (playerCards) {
    for (let i = 0; i < playerCards.length; i++) {
      cardReady(playerCards[i]);
      playerCards[i].dataset.state = "on-guard";
      playerCards[i].addEventListener("click", AtkMsg);
      playerCards[i].addEventListener("mouseenter", hover);
      playerCards[i].addEventListener("mouseleave", unhover);
    }
  }
  endTurnBtn.addEventListener("click", endPlayerTurn);
  endTurnBtn.addEventListener("mousedown", buttonPressed);
  endTurnBtn.addEventListener("mouseup", buttonReleased);
}

function yourTurnMsg() {
  msg.style = "position:relative; top:0; left:0; margin: 0 auto;";
  msgText.style =
    "position:relative; top:-5rem; left:0; margin: 0 auto; font-family:'MedievalSharp',serif; font-size: 3em; font-weight:bolder; color:black;";
  msgText.textContent = "Your Turn";
  enemyField.after(msg);
  msg.after(msgText);
  gsap.to(msg, {
    duration: 1,
    opacity: 1,
    onComplete: function () {
      gsap.to(msg, {
        duration: 1,
        opacity: 0,
      });
    },
  });
  gsap.to(msgText, {
    duration: 1,
    opacity: 1,
    onComplete: function () {
      gsap.to(msgText, {
        duration: 1,
        opacity: 0,
      });
    },
  });
}

function endEnemyTurn() {
  turnCounter++;
  if (player.class === "mage") {
    player.power = turnCounter + 2;
  } else {
    player.power = turnCounter;
  }
  powerCounter.textContent = player.power;
  playerPower.max = player.power * 100;
  playerPower.value = player.power * 100;
  showTurnIndicator(true); // Show YOUR TURN indicator
  yourTurnMsg();
  startPlayerTurn();
}

function coinToss() {
  return Math.floor(Math.random() * 2);
}

function enemyAttack() {
  // Loop through enemy field and find cards that are on-guard
  // if a card is on guard then attack the player
  // Should they attack the player directly or an available card?
  // For now, let's make it random

  for (let i = 0; i < enemyCards.length; i++) {
    if (enemyCards[i].dataset.state === "on-guard") {
      // First choose whether to attack the player or a card
      if (coinToss() === 0 || playerCards.length === 0) {
        player.health -= enemyCards[i].dataset.atk;
        playerHealth.value = player.health;
        gsap.to(".hero", {
          duration: 1,
          boxShadow: "inset 0 0 100vmin 0 red",
          onComplete: function () {
            gsap.to(".hero", {
              duration: 1,
              boxShadow: "none",
            });
          },
        });
        if (player.health <= 0) {
          endGame();
        }
      }
      // If enemy attacks player's cards
      else {
        const randomIndex = Math.floor(Math.random() * playerCards.length);
        gsap.to(".hero", {
          duration: 1,
          boxShadow: "inset 0 0 100vmin 0 red",
          onComplete: function () {
            gsap.to(".hero", {
              duration: 1,
              boxShadow: "none",
            });
          },
        });
        playerCards[randomIndex].dataset.def -= enemyCards[i].dataset.atk;
        playerCards[randomIndex].children[3].textContent =
          playerCards[randomIndex].dataset.def;
        playerCards[randomIndex].children[3].style.color = "red";

        enemyCards[i].dataset.def -= playerCards[randomIndex].dataset.atk;
        enemyCards[i].children[3].textContent = enemyCards[i].dataset.def;
        enemyCards[i].children[3].style.color = "red";
        if (playerCards[randomIndex].dataset.def <= 0) {
          discardPile.push(playerCards[randomIndex]);
          playerCards[randomIndex].remove();
        }
        if (enemyCards[i].dataset.def > 0) {
          // Enemy card survived
        } else {
          discardPile.push(enemyCards[i]);
          enemyCards[i].remove();
          i--;
        }
      }
    }
  }
    endEnemyTurn();
}

function enemyPlayCard() {
  setTimeout(function () {
    // loop through hand
    if (enemyCards.length < 4) {
      for (let i = 0; i < enemyHand.children.length; i++) {
        const card = enemyHand.children[i];
        // Play a card from the hand that has <= cost than power
        if (card.dataset.cost <= enemy.power && enemyCards.length < 4) {
          const cardFace = document.createElement("img");
          cardFace.src = card.dataset.img;
          cardFace.style.transform = "scale(1.2)";
          card.appendChild(cardFace);
          card.classList.add("played-enemy-card");
          card.dataset.state = "in-play";

          const enemyCostStat = document.createElement("div");
          enemyCostStat.classList.add("enemy-cost-stat");
          enemyCostStat.textContent = card.dataset.cost;
          card.appendChild(enemyCostStat);

          const enemyAtkStat = document.createElement("div");
          enemyAtkStat.classList.add("enemy-atk-stat");
          enemyAtkStat.textContent = card.dataset.atk;
          card.appendChild(enemyAtkStat);

          const enemyDefStat = document.createElement("div");
          enemyDefStat.classList.add("enemy-def-stat");
          enemyDefStat.textContent = card.dataset.def;
          card.appendChild(enemyDefStat);

          const w = window.innerWidth / 4;
          const h = window.innerHeight / 8;
          gsap.from(card, {
            duration: 2,
            ease: "power4",
            scale: 1.5,
            xPercent: w,
            yPercent: -h,
          });
          enemyField.appendChild(card);
          enemy.power -= card.dataset.cost;
          enemyPower.value = enemy.power * 100;
        }
      }
    }
    enemyAttack();
  }, 3000);
}

function cardPop(card) {
  setTimeout(function () {
    card.style.transform = "translateY(5rem)";
    setTimeout(function () {
      card.style.transform = "translateY(0rem)";
    }, 200);
  }, 200);
}

function enemyThinking() {
  if (!thinkingInterval) {
    thinkingInterval = setInterval(function () {
      const randomIndex = Math.floor(Math.random() * enemyHand.children.length);
      cardPop(enemyHand.children[randomIndex]);
    }, 200);
  }
  // This needs to wait
  setTimeout(enemyPlayCard, 2000);
  setTimeout(function () {
    clearInterval(thinkingInterval);
    thinkingInterval = null;
  }, 2000);
}

function enemyTurn() {
  showTurnIndicator(false); // Show ENEMY TURN indicator

  if (settings.difficulty === "easy") {
    enemy.power = turnCounter;
  } else if (settings.difficulty === "medium") {
    enemy.power = turnCounter + 2;
  } else if (settings.difficulty === "hard") {
    enemy.power = turnCounter + 4;
  } else {
    enemy.power = turnCounter + 6;
  }
  enemyPower.max = enemy.power * 100;
  enemyPower.value = enemy.power * 100;

  for (let i = 0; i < enemyCards.length; i++) {
    if (enemyCards[i].dataset.state === "in-play") {
      enemyCards[i].dataset.state = "on-guard";
    }
  }

  // draws a card
  if (enemy.deck.length > 0) {
    const newCard = document.createElement("div");
    newCard.classList.add("enemy-card");
    gsap.fromTo(
      newCard,
      {
        onStart: function () {
          enemyHand.after(newCard);
        },
        x: 700,
        onComplete: function () {
          enemyHand.appendChild(newCard);
        },
      },
      {
        x: 0,
      }
    );
    setCardProps(newCard, enemy.deck);
    enemy.hand.push(newCard);
  }
  enemyThinking();
}

function compliment() {
  // Use local compliments (API has CORS issues)
  const fallbackCompliments = [
    "You're doing great!",
    "Impressive strategy!",
    "Your skills are improving!",
    "Well played, champion!",
    "Keep up the good work!",
    "Outstanding move!",
    "You're a natural!",
    "Brilliant tactics!",
    "Masterful play!",
    "You're unstoppable!"
  ];
  trashTalk = fallbackCompliments[Math.floor(Math.random() * fallbackCompliments.length)];
}

// Show epic turn indicator
function showTurnIndicator(isPlayerTurn) {
  const indicator = document.createElement('div');
  indicator.className = `turn-indicator ${isPlayerTurn ? 'player-turn' : 'enemy-turn'}`;
  indicator.textContent = isPlayerTurn ? 'YOUR TURN' : 'ENEMY TURN';
  document.body.appendChild(indicator);

  setTimeout(() => {
    indicator.remove();
  }, 2000);
}

function endPlayerTurn() {
  endTurnBtn.removeEventListener("click", endPlayerTurn);
  for (let i = 0; i < playerField.children.length; i++) {
    if (playerField.children[i].dataset.state === "ready-to-attack") {
      removeAtkMsg();
    }
    playerField.children[i].removeEventListener("click", AtkMsg);
    playerField.children[i].removeEventListener("mouseenter", hover);
    playerField.children[i].removeEventListener("mouseleave", unhover);
    playerField.children[i].style =
      "transition: all 400ms; box-shadow:none; transform: translateY(15px); animation:none;";
  }
  for (let i = 0; i < playerHand.children.length; i++) {
    if (playerHand.children[i].dataset.state === "in-hand") {
      playerHand.children[i].removeEventListener("click", playCard);
    }
  }
  if (settings.profanity) {
    fuckOff("https://cors-anywhere.herokuapp.com/http://foaas.com/");
  } else {
    compliment();
  }
  setTimeout(() => notification(trashTalk), 2000);
  setTimeout(enemyTurn, 2000);
}

// This array holds API call commands for foaas API

let trashTalk = "";

async function fuckOff(url) {
  // These variables are for the insult array
  let insult = [
    `anyway/${player.name}`,
    `asshole`,
    `back`,
    `bag`,
    `blackadder`,
    `bus/${player.name}`,
    `bye`,
    `caniuse/shears`,
    `cocksplat/${player.name}`,
    `dosomething/waste/time`,
    `dumbledore`,
    `everyone`,
    `everything`,
    `fascinating`,
    `field/${player.name}`,
    `give`,
    `holygrail`,
    `horse`,
    `legend/${player.name}`,
    `life`,
    `linus/${player.name}`,
    `mornin`,
    `nugget/${player.name}`,
    `problem/${player.name}`,
    `ridiculous`,
    `sake`,
    `shakespeare/${player.name}`,
    `shit`,
    `thinking/${player.name}`,
    `waste/${player.name}`,
  ];
  let from = enemy.name;
  const randomIndex = Math.floor(Math.random() * insult.length);
  const result = url + insult[randomIndex] + "/" + from;

  try {
    const response = await fetch(result, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      trashTalk = data.message;
    } else {
      // Fallback trash talk if API fails
      const fallbackTrashTalk = [
        "You're going down!",
        "Is that the best you can do?",
        "Prepare to be defeated!",
        "Your deck is no match for mine!",
        "Victory will be mine!"
      ];
      trashTalk = fallbackTrashTalk[Math.floor(Math.random() * fallbackTrashTalk.length)];
    }
  } catch (error) {
    // Fallback trash talk on network error
    trashTalk = "You cannot defeat me!";
  }
}

// Create particle burst effect
function createParticleBurst(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle particle-magic';
    particle.style.width = (Math.random() * 8 + 4) + 'px';
    particle.style.height = particle.style.width;
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';

    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / 15;
    const velocity = Math.random() * 100 + 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    gsap.to(particle, {
      duration: 1,
      x: vx,
      y: vy,
      opacity: 0,
      scale: 0,
      onComplete: () => particle.remove()
    });
  }
}

function playCard(event) {
  const chosenCard = event.currentTarget;
  if (player.power >= chosenCard.dataset.cost) {
    const index = player.hand.indexOf(chosenCard);
    player.hand.splice(index, 1);
    chosenCard.classList.remove("player-card");
    chosenCard.classList.add("played-card");
    chosenCard.setAttribute("data-state", "in-play");
    if (player.class === "rogue") {
      cardReady(chosenCard);
      chosenCard.dataset.state = "on-guard";
      chosenCard.addEventListener("click", AtkMsg);
      chosenCard.addEventListener("mouseenter", hover);
      chosenCard.addEventListener("mouseleave", unhover);
    }
    chosenCard.removeEventListener("click", playCard);
    const w = window.innerWidth / 4;
    const h = window.innerHeight / 8;
    // Add card play animation
    chosenCard.classList.add('card-play-animation');
    setTimeout(() => {
      chosenCard.classList.remove('card-play-animation');
    }, 800);

    gsap.from(chosenCard, {
      duration: 2,
      ease: "power4",
      scale: 1.5,
      xPercent: -w,
      yPercent: -h,
    });
    playerField.appendChild(chosenCard);
    player.power -= chosenCard.dataset.cost;
    powerCounter.textContent = player.power;
    playerPower.value = player.power * 100;

    // Create particle burst effect
    createParticleBurst(chosenCard);

    // 🎮 THREE.JS: Epic 3D card play animation
    if (typeof window.bloodgateThree !== 'undefined' && window.bloodgateThree && window.bloodgateThree.scene) {
      setTimeout(() => {
        const cardData = {
          name: chosenCard.dataset.name,
          rarity: chosenCard.classList.contains('legendary') ? 'legendary' :
                  chosenCard.classList.contains('epic') ? 'epic' :
                  chosenCard.classList.contains('rare') ? 'rare' : 'common'
        };
        window.bloodgateThree.createCardPlayParticles(
          new THREE.Vector3(0, 5, 2),
          cardData
        );
      }, 100);
    }
  }
}

function drawCard(deck) {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const drawnCard = deck[randomIndex];
  deck.splice(randomIndex, 1);
  return drawnCard;
}

function setCardProps(cardEl, fromDeck) {
  cardEl.setAttribute("data-state", "in-hand");
  const cardProps = Object.entries(drawCard(fromDeck));
  for (let i = 0; i < cardProps.length; i++) {
    if (i === 0) {
      cardEl.setAttribute("data-name", cardProps[i][1]);
    } else if (i === 1) {
      cardEl.setAttribute("data-cost", cardProps[i][1]);
    } else if (i === 2) {
      cardEl.setAttribute("data-atk", cardProps[i][1]);
    } else if (i === 3) {
      cardEl.setAttribute("data-def", cardProps[i][1]);
    } else {
      cardEl.setAttribute("data-img", cardProps[i][1]);
    }
  }
}

function createStats(cardEl) {
  const costStat = document.createElement("div");
  costStat.classList.add("cost-stat");
  costStat.textContent = cardEl.dataset.cost;
  cardEl.appendChild(costStat);

  const atkStat = document.createElement("div");
  atkStat.classList.add("atk-stat");
  atkStat.textContent = cardEl.dataset.atk;
  cardEl.appendChild(atkStat);

  const defStat = document.createElement("div");
  defStat.classList.add("def-stat");
  defStat.textContent = cardEl.dataset.def;
  cardEl.appendChild(defStat);
}

function displayFelt() {
  loadingBar.remove();
  msg.remove();
  heroEl.style =
    "background-image:url(./assets/images/new-bg.png); cursor:url('./assets/images/custom-cursor.png'), auto;";
  heroBody.style.width = "100%";
  heroBody.classList.add("p0");
  heroBody.style.flexDirection = "column";
  heroBody.style.justifyContent = "space-between";

  // Re-append feltView to heroBody (it was removed when we cleared heroBody for the loading screen)
  heroBody.appendChild(feltView);
  feltView.classList.remove("is-hidden");

  // Initialize Three.js 3D effects - pass feltView container directly
  console.log('🔍 Checking for bloodgateThree...', typeof window.bloodgateThree);
  if (typeof window.bloodgateThree !== 'undefined' && window.bloodgateThree) {
    console.log('✅ bloodgateThree found, calling init()...');
    console.log('🔍 Passing feltView container:', feltView);
    const initSuccess = window.bloodgateThree.init(feltView);
    if (initSuccess) {
      console.log('🎮 3D effects activated successfully!');
    } else {
      console.error('❌ Failed to initialize 3D effects');
    }
  } else {
    console.error('❌ bloodgateThree not found - 3D effects will not be available');
  }

  turnCounter++;
  player.power++;
  enemy.power++;
  powerCounter.textContent = player.power;

  playerHealth.value = player.health;
  playerPower.max = player.power * 100;
  playerPower.value = player.power * 100;

  playerCard1.addEventListener("click", playCard);
  setCardProps(playerCard1, player.deck);
  playerCard1.children[0].src = playerCard1.dataset.img;
  createStats(playerCard1);
  playerCard1.classList.add('card-hover-effect');
  player.hand.push(playerCard1);

  playerCard2.addEventListener("click", playCard);
  setCardProps(playerCard2, player.deck);
  playerCard2.children[0].src = playerCard2.dataset.img;
  createStats(playerCard2);
  playerCard2.classList.add('card-hover-effect');
  player.hand.push(playerCard2);

  playerCard3.addEventListener("click", playCard);
  setCardProps(playerCard3, player.deck);
  playerCard3.children[0].src = playerCard3.dataset.img;
  createStats(playerCard3);
  playerCard3.classList.add('card-hover-effect');
  player.hand.push(playerCard3);

  playerCard4.addEventListener("click", playCard);
  setCardProps(playerCard4, player.deck);
  playerCard4.children[0].src = playerCard4.dataset.img;
  createStats(playerCard4);
  playerCard4.classList.add('card-hover-effect');
  player.hand.push(playerCard4);

  setCardProps(enemyCard1, enemy.deck);
  enemy.hand.push(enemyCard1);
  setCardProps(enemyCard2, enemy.deck);
  enemy.hand.push(enemyCard2);
  setCardProps(enemyCard3, enemy.deck);
  enemy.hand.push(enemyCard3);

  enemyHealth.value = enemy.health;
  enemyPower.max = enemy.power * 100;
  enemyPower.value = enemy.power * 100;

  endTurnBtn.addEventListener("click", endPlayerTurn);
  endTurnBtn.addEventListener("mousedown", buttonPressed);
  endTurnBtn.addEventListener("mouseup", buttonReleased);
}

function loadScreen() {
  navBarBrand.classList.add("is-hidden");
  navBarMenu.classList.add("is-hidden");

  // Create cinematic loading screen
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';

  // Loading title
  const loadingTitle = document.createElement('div');
  loadingTitle.className = 'loading-title';
  loadingTitle.textContent = 'BLOODGATE';

  // Progress container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'loading-progress-container';

  const progressBar = document.createElement('div');
  progressBar.className = 'loading-progress-bar';

  const progressFill = document.createElement('div');
  progressFill.className = 'loading-progress-fill';
  progressFill.style.width = '0%';

  const progressText = document.createElement('div');
  progressText.className = 'loading-progress-text';
  progressText.textContent = '0%';

  progressBar.appendChild(progressFill);
  progressBar.appendChild(progressText);
  progressContainer.appendChild(progressBar);

  // Loading tips
  const tips = [
    'Strategic card placement is the key to victory',
    'Each class has unique strengths - choose wisely',
    'Higher difficulty means tougher enemies and better rewards',
    'Combo attacks can turn the tide of battle',
    'Manage your power wisely - it increases each turn',
    'Legendary cards have devastating abilities',
    'Defense is just as important as offense',
    'Study your opponent\'s moves carefully'
  ];

  const tipsContainer = document.createElement('div');
  tipsContainer.className = 'loading-tips';

  const tipElement = document.createElement('div');
  tipElement.className = 'loading-tip';
  tipElement.textContent = tips[Math.floor(Math.random() * tips.length)];

  tipsContainer.appendChild(tipElement);

  // Particles container
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'loading-particles';

  // Create floating particles
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'loading-particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
  }

  // Assemble loading screen
  loadingScreen.appendChild(particlesContainer);
  loadingScreen.appendChild(loadingTitle);
  loadingScreen.appendChild(progressContainer);
  loadingScreen.appendChild(tipsContainer);

  heroBody.innerHTML = '';
  heroBody.appendChild(loadingScreen);

  // Animate progress bar
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    progressFill.style.width = progress + '%';
    progressText.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          displayFelt();
        }, 500);
      }, 500);
    }
  }, 200);

  // Add optional profanity message
  if (settings.profanity) {
    setTimeout(() => {
      tipElement.textContent = 'Get ready to kick some ass!';
    }, 1500);
  }
}

/**
 * It removes the is-active class from the modal and adds the is-hidden class to the landing message.
 * @param event - The event object that was triggered.
 */
function startGame(event) {
  event.preventDefault();
  player.name = nameInput.value.trim();
  player.class = classSelect.value;

  // Save game settings to localStorage
  let gameSettings = {
    playerName: player.name,
    playerClass: player.class,
    difficulty: settings.difficulty,
    profanity: settings.profanity
  };
  localStorage.setItem("bloodgateSettings", JSON.stringify(gameSettings));
  if (player.class === "barbarian") {
    playerAvatar.style.backgroundImage =
      "url(./assets/images/aliks_the_barbarian_by_lucy_lisett_da3v8lm-fullview.jpeg)";
  } else if (player.class === "mage") {
    playerAvatar.style.backgroundImage =
      "url(./assets/images/merlin_the_court_wizard_by_lucy_lisett_daakmxo-pre.jpeg)";
    player.power = 2;
  } else {
    playerAvatar.style.backgroundImage =
      "url(./assets/images/commander_by_lucy_lisett_dc6fkyu-pre.jpeg)";
  }

  for (i = 0; i < difficultyInput.length; i++) {
    if (difficultyInput[i].checked) {
      settings.difficulty = difficultyInput[i].value;
    }
  }

  getDeck(enemy, "bloodfury-dominion");

  if (settings.difficulty === "easy") {
    enemyAvatar.style.backgroundImage =
      "url(./assets/images/snake_witch_by_lucy_lisett_deecsrr-pre.jpeg)";
  } else if (settings.difficulty === "medium") {
    enemy.power = 2;
    enemyAvatar.style.backgroundImage =
      "url(./assets/images/black_demon_by_lucy_lisett_deiolkq-pre.jpeg)";
  } else if (settings.difficulty === "hard") {
    enemy.power = 4;
    enemyAvatar.style.backgroundImage =
      "url(./assets/images/dark_priest_by_lucy_lisett_deftk3k-pre.jpeg)";
  } else {
    enemy.power = 6;
    enemyAvatar.style.backgroundImage =
      "url(./assets/images/demonic_wizard_by_lucy_lisett_degm84n-pre.jpeg)";
  }

  settings.profanity = profanityInput.checked;

  // Save settings to localStorage
  gameSettings = {
    playerName: player.name,
    playerClass: player.class,
    difficulty: settings.difficulty,
    profanity: settings.profanity
  };
  localStorage.setItem("bloodgateSettings", JSON.stringify(gameSettings));

  heroEl.style.backgroundImage = "url(./assets/images/hero2.jpg)";
  heroEl.style.backgroundSize = "cover";
  heroEl.style.backgroundPosition = "top";
  heroEl.style.backgroundColor = "black";
  heroEl.style.boxShadow = "inset 0 0 28vmin 0 rgba(0, 0, 0, 0.9)";

  modal.classList.remove("is-active");
  landingMsg.classList.add("is-hidden");
  heroFoot.classList.add("is-hidden");
  footer.classList.add("is-hidden");
  loadScreen();
}

function createAccount(event) {
  bloodgateUser.username = usernameInput.value.trim();
  bloodgateUser.experience = experienceLevel.value;
  for (let i = 0; i < experienceLevel.length; i++) {
    if (experienceLevel[i].checked) {
      bloodgateUser.experience = experienceLevel[i].value;
    }
  }
  bloodgateUser.startingDeck = startingDeck.value;
  localStorage.setItem("bloodgateUser", JSON.stringify(bloodgateUser));
  newGameBtn.dataset.target = "new-game-modal";
  accountEl.children[0].textContent = `Welcome ${bloodgateUser.username}`;
}

function getDeck(user, deck) {
  // Load deck from local JSON file (API has reliability issues)
  return fetch(`./assets/json/${deck}.json`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load deck: ${deck}`);
      }
      return res.json();
    })
    .then(data => {
      user.deck = data.cards;
      return data.cards;
    })
    .catch(err => {
      console.error(`Error loading deck ${deck}:`, err);
      notification("Error loading deck. Please refresh the page.");
      return [];
    });
}

// Function to update leaderboard stats display
function updateLeaderboardStats() {
  const stats = JSON.parse(localStorage.getItem("bloodgateStats")) || {
    wins: 0,
    losses: 0,
    gamesPlayed: 0
  };

  document.getElementById("stat-games-played").textContent = stats.gamesPlayed;
  document.getElementById("stat-wins").textContent = stats.wins;
  document.getElementById("stat-losses").textContent = stats.losses;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  document.getElementById("stat-win-rate").textContent = winRate + "%";

  // Determine champion title based on wins
  let title = "Novice";
  if (stats.wins >= 50) title = "Legendary Champion";
  else if (stats.wins >= 30) title = "Master Warrior";
  else if (stats.wins >= 20) title = "Elite Fighter";
  else if (stats.wins >= 10) title = "Seasoned Veteran";
  else if (stats.wins >= 5) title = "Skilled Combatant";
  else if (stats.wins >= 1) title = "Apprentice";

  document.getElementById("stat-title").textContent = title;
}

// Add event listener to update stats when leaderboard modal opens
document.addEventListener("DOMContentLoaded", () => {
  const leaderboardTrigger = document.querySelector('[data-target="leaderboard-modal"]');
  if (leaderboardTrigger) {
    leaderboardTrigger.addEventListener("click", updateLeaderboardStats);
  }
});

accountForm.addEventListener("submit", createAccount);
newGameForm.addEventListener("submit", startGame);
deleteAccountBtn.addEventListener("click", function () {
  localStorage.removeItem("bloodgateUser");
  localStorage.removeItem("bloodgateStats");
  location.reload(true);
});

if (!localStorageData) {
  newGameBtn.dataset.target = "create-account-modal";
} else {
  accountEl.dataset.target = "settings-modal";
  accountEl.children[0].textContent = `Welcome ${localStorageData.username}!`;
  getDeck(player, localStorageData.startingDeck);

  // Load saved game settings if they exist
  const savedSettings = JSON.parse(localStorage.getItem("bloodgateSettings"));
  if (savedSettings) {
    // Restore previous difficulty and profanity settings
    settings.difficulty = savedSettings.difficulty || "easy";
    settings.profanity = savedSettings.profanity || false;
  }
}

// ===== EPIC GAME ENHANCEMENTS =====

// Particle Effects System
function createParticles(x, y, count, type = 'magic') {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle', `particle-${type}`);

    const size = Math.random() * 10 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    document.body.appendChild(particle);

    const angle = (Math.PI * 2 * i) / count;
    const velocity = Math.random() * 100 + 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    gsap.to(particle, {
      x: vx,
      y: vy,
      opacity: 0,
      duration: Math.random() * 0.5 + 0.5,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    });
  }
}

// Landing Page Particles
function initLandingParticles() {
  const particlesBg = document.getElementById('particles-bg');
  if (!particlesBg) return;

  setInterval(() => {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 3 + 1}px`;
    particle.style.height = `${Math.random() * 3 + 1}px`;
    particle.style.background = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.3})`;
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.pointerEvents = 'none';

    particlesBg.appendChild(particle);

    gsap.to(particle, {
      y: -100,
      opacity: 0,
      duration: Math.random() * 3 + 2,
      ease: 'power1.out',
      onComplete: () => particle.remove()
    });
  }, 200);
}

// Initialize landing particles on page load
if (document.getElementById('particles-bg')) {
  initLandingParticles();
}

// Floating Damage Number
function showDamageNumber(x, y, damage, type = 'damage') {
  const damageEl = document.createElement('div');
  damageEl.classList.add('damage-number');
  if (type === 'critical') damageEl.classList.add('critical');
  if (type === 'healing') damageEl.classList.add('healing');

  damageEl.textContent = `-${damage}`;
  if (type === 'healing') damageEl.textContent = `+${damage}`;

  damageEl.style.left = `${x}px`;
  damageEl.style.top = `${y}px`;

  document.body.appendChild(damageEl);

  setTimeout(() => damageEl.remove(), 1500);
}

// Screen Shake Effect
function screenShake(intensity = 'normal') {
  const hero = document.querySelector('.hero');
  hero.classList.add('screen-shake');
  setTimeout(() => hero.classList.remove('screen-shake'), 500);
}

// Card Rarity System
const cardRarities = {
  'Colossal Dragon': 'legendary',
  'Fire Dragon': 'legendary',
  'Undead Dragon': 'epic',
  'Cloud Dragon': 'epic',
  'Tiger Dragon': 'epic',
  'Forest Dragon': 'epic',
  'Dragon Sorcerer': 'epic',
  'Dragula': 'rare',
  'Elder Wizard': 'rare',
  'Empress Of The Deep': 'rare',
  'Giant King': 'rare',
  'Demon Priest': 'rare',
  'Dark Witch': 'rare',
  'Angelic Warrior': 'rare',
  'Stone Giant': 'common',
  'Swamp Giant': 'common',
  'Elven Archer': 'common',
  'Shamanic Archer': 'common',
  'Clawface': 'common',
  'Bull Demon': 'common'
};

function applyCardRarity(cardEl) {
  const cardName = cardEl.dataset.name;
  const rarity = cardRarities[cardName] || 'common';

  // Remove existing rarity classes
  cardEl.classList.remove('card-rarity-common', 'card-rarity-rare', 'card-rarity-epic', 'card-rarity-legendary');

  // Add new rarity class
  cardEl.classList.add(`card-rarity-${rarity}`);

  return rarity;
}

// Combo System
let comboCounter = 0;
let lastCardPlayed = null;

function checkCombo(cardName) {
  // Define combo patterns
  const combos = {
    'Dragon Fury': ['Fire Dragon', 'Dragon Sorcerer'],
    'Forest Alliance': ['Forest Dragon', 'Lady Of The Forest', 'Elven Archer'],
    'Dark Pact': ['Demon Priest', 'Dark Witch', 'Bull Demon'],
    'Giant Rampage': ['Giant King', 'Stone Giant', 'Swamp Giant']
  };

  // Check if this card forms a combo with recently played cards
  for (const [comboName, cards] of Object.entries(combos)) {
    if (cards.includes(cardName)) {
      comboCounter++;
      if (comboCounter >= 2) {
        showCombo(comboName, comboCounter);
        return true;
      }
    }
  }

  return false;
}

function showCombo(comboName, multiplier) {
  const comboEl = document.createElement('div');
  comboEl.classList.add('combo-display');
  comboEl.textContent = `${comboName}! x${multiplier} COMBO!`;

  document.body.appendChild(comboEl);

  setTimeout(() => comboEl.remove(), 2000);
}

function resetCombo() {
  comboCounter = 0;
}

// Achievement System
const achievements = {
  firstBlood: { id: 'firstBlood', name: 'First Blood', description: 'Win your first battle', icon: '⚔️', unlocked: false },
  cardMaster: { id: 'cardMaster', name: 'Card Master', description: 'Play 100 cards', icon: '🃏', unlocked: false },
  dragonSlayer: { id: 'dragonSlayer', name: 'Dragon Slayer', description: 'Defeat 5 dragon cards', icon: '🐉', unlocked: false },
  comboKing: { id: 'comboKing', name: 'Combo King', description: 'Execute a 5x combo', icon: '💥', unlocked: false },
  legendary: { id: 'legendary', name: 'Legendary Champion', description: 'Win 50 games', icon: '👑', unlocked: false }
};

function loadAchievements() {
  const saved = JSON.parse(localStorage.getItem('bloodgateAchievements')) || {};
  Object.keys(achievements).forEach(key => {
    if (saved[key]) {
      achievements[key].unlocked = saved[key].unlocked;
    }
  });
}

function saveAchievements() {
  localStorage.setItem('bloodgateAchievements', JSON.stringify(achievements));
}

function unlockAchievement(achievementId) {
  if (achievements[achievementId] && !achievements[achievementId].unlocked) {
    achievements[achievementId].unlocked = true;
    saveAchievements();
    showAchievement(achievements[achievementId]);
  }
}

function showAchievement(achievement) {
  const achievementEl = document.createElement('div');
  achievementEl.classList.add('achievement-notification');
  achievementEl.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-title">Achievement Unlocked!</div>
    <div class="achievement-title">${achievement.name}</div>
    <div class="achievement-description">${achievement.description}</div>
  `;

  document.body.appendChild(achievementEl);

  setTimeout(() => achievementEl.remove(), 5000);
}

// Load achievements on page load
loadAchievements();

// Track stats for achievements
let cardsPlayedCount = 0;
let dragonsDefeated = 0;

// Enhanced Attack with Visual Effects
const originalAttackTarget = attackTarget;
window.attackTarget = function(event) {
  const readyToAttack = document.querySelector('.ready-to-attack');
  if (!readyToAttack) return;

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Determine particle type based on card
  const cardName = readyToAttack.dataset.name;
  let particleType = 'magic';
  if (cardName && cardName.includes('Dragon')) particleType = 'fire';
  if (cardName && (cardName.includes('Demon') || cardName.includes('Blood'))) particleType = 'blood';

  // Create particles
  createParticles(x, y, 15, particleType);

  // Show damage number
  const damage = parseInt(readyToAttack.dataset.atk);
  showDamageNumber(x, y, damage, damage > 5 ? 'critical' : 'damage');

  // Screen shake on big hits
  if (damage >= 7) {
    screenShake();
  }

  // Track dragon defeats
  if (target.dataset && target.dataset.name && target.dataset.name.includes('Dragon')) {
    dragonsDefeated++;
    if (dragonsDefeated >= 5) {
      unlockAchievement('dragonSlayer');
    }
  }

  // Call original function
  originalAttackTarget.call(this, event);
};

// Enhanced Play Card with Visual Effects
const originalPlayCard = playCard;
window.playCard = function(event) {
  const chosenCard = event.currentTarget;

  // Apply rarity effects
  applyCardRarity(chosenCard);

  // Check for combos
  const cardName = chosenCard.dataset.name;
  checkCombo(cardName);

  // Track cards played
  cardsPlayedCount++;
  if (cardsPlayedCount >= 100) {
    unlockAchievement('cardMaster');
  }

  // Create play particles
  const rect = chosenCard.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  createParticles(x, y, 10, 'magic');

  // Call original function
  originalPlayCard.call(this, event);

  lastCardPlayed = cardName;
};

// Enhanced End Game with Achievements
const originalEndGame = endGame;
window.endGame = function() {
  originalEndGame.call(this);

  // Check for first win achievement
  if (enemy.health <= 0) {
    const stats = JSON.parse(localStorage.getItem("bloodgateStats")) || { wins: 0 };
    if (stats.wins === 1) {
      unlockAchievement('firstBlood');
    }
    if (stats.wins >= 50) {
      unlockAchievement('legendary');
    }
  }

  // Reset combo counter
  resetCombo();
};

// Override the functions globally
attackTarget = window.attackTarget;
playCard = window.playCard;
endGame = window.endGame;

// ===== ADVANCED CARD ABILITIES SYSTEM =====

const cardAbilities = {
  'Fire Dragon': {
    name: 'Inferno Breath',
    type: 'damage',
    effect: (card) => {
      // Deals 2 extra damage to all enemy cards
      if (enemyCards.length > 0) {
        for (let i = 0; i < enemyCards.length; i++) {
          enemyCards[i].dataset.def = parseInt(enemyCards[i].dataset.def) - 2;
          enemyCards[i].children[3].textContent = enemyCards[i].dataset.def;
          const rect = enemyCards[i].getBoundingClientRect();
          showDamageNumber(rect.left + rect.width/2, rect.top + rect.height/2, 2);
          if (enemyCards[i].dataset.def <= 0) {
            discardPile.push(enemyCards[i]);
            enemyCards[i].remove();
            i--;
          }
        }
        notification('Fire Dragon breathes inferno! All enemies burn!');
      }
    }
  },
  'Elder Wizard': {
    name: 'Arcane Mastery',
    type: 'buff',
    effect: (card) => {
      // Grants +2 power to player
      player.power += 2;
      powerCounter.textContent = player.power;
      playerPower.value = player.power * 100;
      notification('Elder Wizard channels arcane energy! +2 Power!');
      const rect = card.getBoundingClientRect();
      showDamageNumber(rect.left + rect.width/2, rect.top, 2, 'healing');
    }
  },
  'Demon Priest': {
    name: 'Dark Ritual',
    type: 'drain',
    effect: (card) => {
      // Drains 3 health from player, gives to enemy
      player.health -= 3;
      playerHealth.value = player.health;
      enemy.health += 3;
      if (enemy.health > 30) enemy.health = 30;
      enemyHealth.value = enemy.health;
      notification('Demon Priest performs dark ritual!');
      screenShake();
    }
  },
  'Angelic Warrior': {
    name: 'Divine Shield',
    type: 'buff',
    effect: (card) => {
      // Heals player for 4 health
      player.health += 4;
      if (player.health > 30) player.health = 30;
      playerHealth.value = player.health;
      const rect = playerAvatar.getBoundingClientRect();
      showDamageNumber(rect.left + rect.width/2, rect.top + rect.height/2, 4, 'healing');
      notification('Angelic Warrior grants divine protection! +4 Health!');
    }
  },
  'Empress Of The Deep': {
    name: 'Tidal Wave',
    type: 'control',
    effect: (card) => {
      // Returns one random enemy card to their hand
      if (enemyCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * enemyCards.length);
        const targetCard = enemyCards[randomIndex];
        gsap.to(targetCard, {
          duration: 1,
          y: -200,
          opacity: 0,
          onComplete: () => {
            targetCard.remove();
            notification('Empress summons a tidal wave! Enemy card returned!');
          }
        });
      }
    }
  },
  'Dark Witch': {
    name: 'Curse',
    type: 'debuff',
    effect: (card) => {
      // Weakens all player cards by 1 defense
      if (playerCards.length > 0) {
        for (let i = 0; i < playerCards.length; i++) {
          playerCards[i].dataset.def = parseInt(playerCards[i].dataset.def) - 1;
          playerCards[i].children[3].textContent = playerCards[i].dataset.def;
          playerCards[i].children[3].style.color = 'purple';
          if (playerCards[i].dataset.def <= 0) {
            discardPile.push(playerCards[i]);
            playerCards[i].remove();
            i--;
          }
        }
        notification('Dark Witch curses your forces!');
      }
    }
  },
  'Colossal Dragon': {
    name: 'Earthquake',
    type: 'damage',
    effect: (card) => {
      // Massive screen shake and 1 damage to all cards on field
      screenShake();
      const allCards = [...playerCards, ...enemyCards];
      allCards.forEach(c => {
        c.dataset.def = parseInt(c.dataset.def) - 1;
        c.children[3].textContent = c.dataset.def;
        const rect = c.getBoundingClientRect();
        showDamageNumber(rect.left + rect.width/2, rect.top + rect.height/2, 1);
        if (c.dataset.def <= 0) {
          discardPile.push(c);
          c.remove();
        }
      });
      notification('Colossal Dragon causes an EARTHQUAKE!');
    }
  },
  'Enchantress': {
    name: 'Enchantment',
    type: 'buff',
    effect: (card) => {
      // Boosts a random friendly card +2/+2
      if (playerCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * playerCards.length);
        const targetCard = playerCards[randomIndex];
        targetCard.dataset.atk = parseInt(targetCard.dataset.atk) + 2;
        targetCard.dataset.def = parseInt(targetCard.dataset.def) + 2;
        targetCard.children[2].textContent = targetCard.dataset.atk;
        targetCard.children[3].textContent = targetCard.dataset.def;
        targetCard.children[2].style.color = 'gold';
        targetCard.children[3].style.color = 'gold';

        gsap.to(targetCard, {
          duration: 0.5,
          scale: 1.1,
          yoyo: true,
          repeat: 1
        });
        notification(`Enchantress empowers ${targetCard.dataset.name}! +2/+2!`);
      }
    }
  }
};

// Apply card ability when played
function applyCardAbility(card) {
  const cardName = card.dataset.name;
  if (cardAbilities[cardName]) {
    const ability = cardAbilities[cardName];

    // Add ability indicator
    const abilityIcon = document.createElement('div');
    abilityIcon.classList.add('card-ability-icon');

    if (ability.type === 'buff') {
      abilityIcon.classList.add('ability-buff');
      abilityIcon.textContent = '✨';
    } else if (ability.type === 'debuff') {
      abilityIcon.classList.add('ability-debuff');
      abilityIcon.textContent = '💀';
    } else if (ability.type === 'damage') {
      abilityIcon.classList.add('ability-spell');
      abilityIcon.textContent = '🔥';
    } else {
      abilityIcon.textContent = '⚡';
    }

    card.appendChild(abilityIcon);

    // Trigger ability effect after a short delay
    setTimeout(() => {
      ability.effect(card);
      createParticles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        20,
        ability.type === 'damage' || ability.type === 'debuff' ? 'fire' : 'magic'
      );
    }, 1000);
  }
}

// Enhanced Enemy Play Card with Abilities
const originalEnemyPlayCard = enemyPlayCard;
window.enemyPlayCard = function() {
  const initialEnemyCardsCount = enemyCards.length;

  originalEnemyPlayCard.call(this);

  // Check if a new card was played and apply its ability
  setTimeout(() => {
    if (enemyCards.length > initialEnemyCardsCount) {
      const newCard = enemyCards[enemyCards.length - 1];
      applyCardAbility(newCard);
    }
  }, 500);
};

enemyPlayCard = window.enemyPlayCard;

// Update playCard to include abilities
const enhancedPlayCard = window.playCard;
window.playCard = function(event) {
  enhancedPlayCard.call(this, event);

  // Find the card that was just played
  setTimeout(() => {
    if (playerCards.length > 0) {
      const latestCard = playerCards[playerCards.length - 1];
      applyCardAbility(latestCard);
    }
  }, 500);
};

playCard = window.playCard;

// Add special enter animations for legendary cards
function addLegendaryEntrance(card) {
  const rarity = applyCardRarity(card);

  if (rarity === 'legendary') {
    gsap.from(card, {
      duration: 1.5,
      scale: 0,
      rotation: 720,
      ease: 'back.out(1.7)',
      onStart: () => {
        const rect = card.getBoundingClientRect();
        createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 30, 'magic');
      }
    });
    notification('A LEGENDARY card enters the battlefield!');
  } else if (rarity === 'epic') {
    gsap.from(card, {
      duration: 1,
      scale: 0.5,
      rotation: 360,
      ease: 'power2.out',
      onStart: () => {
        const rect = card.getBoundingClientRect();
        createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 20, 'magic');
      }
    });
  }
}

// BULMA CODE
/* When a user clicks on a button, an element with the `.modal` class is opened. */
document.addEventListener("DOMContentLoaded", () => {
  // NAVBURGERS
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
  // END OF NAVBURGERS

  // DECK CARD SELECTION HANDLING
  const deckCards = document.querySelectorAll('.deck-card');
  const deckSelectInput = document.getElementById('deck-select');

  deckCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      deckCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      // Update hidden input value
      deckSelectInput.value = card.dataset.deck;
    });
  });

  // CLASS CARD SELECTION HANDLING
  const classCards = document.querySelectorAll('.class-card');
  const classSelectInput = document.getElementById('class-select');

  classCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all cards
      classCards.forEach(c => c.classList.remove('selected'));
      // Add selected class to clicked card
      card.classList.add('selected');
      // Update hidden input value
      classSelectInput.value = card.dataset.class;
    });
  });

  // DIFFICULTY OPTION SELECTION HANDLING
  const difficultyOptions = document.querySelectorAll('.difficulty-option');

  difficultyOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      difficultyOptions.forEach(o => o.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });

  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });

  /* For each element in the array returned by document.querySelectorAll('.notification .delete'), add a
  click event listener to the delete element that will remove the parent notification element from
  the DOM. */
  (document.querySelectorAll(".notification .delete") || []).forEach(
    ($delete) => {
      const $notification = $delete.parentNode;

      $delete.addEventListener("click", () => {
        $notification.parentNode.removeChild($notification);
      });
    }
  );
});
// END OF BULMA JS
