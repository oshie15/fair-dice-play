#!/usr/bin/env node
const crypto = require('crypto');
const prompt = require('prompt-sync')({ sigint: true });

function parseDiceArgs(args) {
  if (args.length < 3) {
    console.error('You must specify at least 3 dice (6 comma-separated integers each).');
    console.log('Example: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
    process.exit(1);
  }

  return args.map((arg, i) => {
    const values = arg.split(',').map(Number);
    if (values.length !== 6 || values.some(isNaN)) {
      console.error(`Invalid dice at position ${i + 1}. Must have 6 integers.`);
      process.exit(1);
    }
    return values;
  });
}

function generateKey() {
  return crypto.randomBytes(32);
}

function hmac(key, message) {
  return crypto.createHmac('sha3-256', key).update(String(message)).digest('hex');
}

function fairRoll(max) {
  const key = generateKey();
  const computerValue = crypto.randomInt(0, max);
  const hash = hmac(key, computerValue);

  console.log(`I selected a value in 0..${max - 1} (HMAC=${hash})`);

  let userValue;
  while (true) {
    const input = prompt(`Your number (0-${max - 1}, X to exit): `).trim();
    if (input.toLowerCase() === 'x') process.exit(0);
    userValue = parseInt(input);
    if (!isNaN(userValue) && userValue >= 0 && userValue < max) break;
    console.log('Invalid input. Try again.');
  }

  const result = (userValue + computerValue) % max;
  console.log(`My number was ${computerValue} (KEY=${key.toString('hex')})`);
  console.log(`Result: (${userValue} + ${computerValue}) % ${max} = ${result}`);
  return result;
}

function pickDice(diceList, takenIndex = null) {
  diceList.forEach((dice, i) => {
    if (i !== takenIndex) console.log(`${i}: [${dice.join(',')}]`);
  });

  while (true) {
    const input = prompt('Pick your dice (X to exit): ').trim();
    if (input.toLowerCase() === 'x') process.exit(0);
    const idx = parseInt(input);
    if (!isNaN(idx) && idx >= 0 && idx < diceList.length && idx !== takenIndex) {
      return idx;
    }
    console.log('Invalid choice. Try again.');
  }
}

// ---- Main game starts here ----

const args = process.argv.slice(2);
const diceList = parseDiceArgs(args);

// Decide who goes first
console.log("Let's decide who goes first.");
const first = fairRoll(2);
const userFirst = first === 0;
console.log(userFirst ? 'You go first.' : 'Computer goes first.');

// Select dice
let userIdx, compIdx;
if (userFirst) {
  userIdx = pickDice(diceList);
  compIdx = pickDice(diceList, userIdx);
} else {
  compIdx = crypto.randomInt(0, diceList.length);
  console.log(`Computer picked: [${diceList[compIdx].join(',')}]`);
  userIdx = pickDice(diceList, compIdx);
}

// Roll dice
console.log("\nComputer is rolling...");
const compFace = diceList[compIdx][fairRoll(6)];
console.log(`Computer rolled: ${compFace}`);

console.log("\nYour turn to roll...");
const userFace = diceList[userIdx][fairRoll(6)];
console.log(`You rolled: ${userFace}`);

// Result
if (userFace > compFace) {
  console.log("You win!");
} else if (compFace > userFace) {
  console.log("Computer wins.");
} else {
  console.log("It's a draw.");
}
