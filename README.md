# 🎲 Simple Non-Transitive Dice Game (Fair Version)

This is a simplified Node.js console dice game using provably fair HMAC-based randomness.

## ✅ Requirements
- Node.js v18+  
- Run `npm install prompt-sync`

## 🚀 How to Play


   ✅ 1. Launch with 4 identical dice
   ```
   node game.js 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6

   ```

   ✅ 2. Launch with 3 classic non-transitive dice
   ```
   node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
   ```

## ❌ Invalid Input Example

No dice:
   ```bash
   node game.js
   ```

Only 2 dice:
   ```bash
   node game.js 1,2,3,4,5,6 6,6,6,6,6,6
   ```
Non-integer face:
   ```bash
   node game.js 1,2,3,five,6,7 6,6,6,6,6,6 2,2,4,4,9,9
   ```

Output:
   ```
   Error: You must specify at least 3 dice.
   Example: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
   ```

