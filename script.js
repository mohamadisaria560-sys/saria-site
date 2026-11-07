/* ============================================================
   ۱. مدیریت تب‌ها
   ============================================================ */
   const tabButtons = document.querySelectorAll('.tab-btn');
   const panels = document.querySelectorAll('.panel');
   
   tabButtons.forEach((btn) => {
     btn.addEventListener('click', () => {
       tabButtons.forEach((b) => b.classList.remove('active'));
       panels.forEach((p) => p.classList.remove('active'));
       btn.classList.add('active');
       document.getElementById(btn.dataset.tab).classList.add('active');
   
       // وقتی تب بازی تقسیم باز شد، بازی را شروع کن
       if (btn.dataset.tab === 'divGame') {
         startDivisionGame();
       }
     });
   });
   
   /* ============================================================
      ۲. جدول ضرب گرافیکی
      ============================================================ */
   function buildMultTable() {
     const table = document.getElementById('multTable');
     if (!table) return;
     table.innerHTML = '';
   
     const corner = document.createElement('div');
     corner.className = 'cell header corner';
     corner.textContent = '×';
     table.appendChild(corner);
   
     for (let c = 1; c <= 10; c++) {
       const h = document.createElement('div');
       h.className = 'cell header';
       h.textContent = c;
       table.appendChild(h);
     }
   
     for (let r = 1; r <= 10; r++) {
       const rowHeader = document.createElement('div');
       rowHeader.className = 'cell header';
       rowHeader.textContent = r;
       table.appendChild(rowHeader);
   
       for (let c = 1; c <= 10; c++) {
         const cell = document.createElement('div');
         cell.className = 'cell';
         const a = r, b = c;
         cell.textContent = `${a}×${b}`;
         cell.addEventListener('click', () => {
           if (!cell.classList.contains('revealed')) {
             cell.textContent = a * b;
             cell.classList.add('revealed');
           } else {
             cell.textContent = `${a}×${b}`;
             cell.classList.remove('revealed');
           }
         });
         table.appendChild(cell);
       }
     }
   }
   buildMultTable();
   
   /* ============================================================
      ۳. تقسیم بصری
      ============================================================ */
   const divideBtn = document.getElementById('divideBtn');
   const divisionResult = document.getElementById('divisionResult');
   
   function renderDivision() {
     const total = parseInt(document.getElementById('totalItems').value) || 1;
     const basketsCount = parseInt(document.getElementById('baskets').value) || 1;
   
     if (total < 1 || basketsCount < 1) return;
   
     const perBasket = Math.floor(total / basketsCount);
     const remainder = total % basketsCount;
   
     divisionResult.innerHTML = '';
   
     for (let b = 1; b <= basketsCount; b++) {
       const basket = document.createElement('div');
       basket.className = 'basket';
   
       const label = document.createElement('div');
       label.className = 'label';
       label.textContent = `سبد ${b}`;
       basket.appendChild(label);
   
       const apples = document.createElement('div');
       apples.className = 'apples';
   
       const count = perBasket + (b <= remainder ? 1 : 0);
       for (let i = 0; i < count; i++) {
         const apple = document.createElement('span');
         apple.textContent = '🍎';
         apples.appendChild(apple);
       }
       basket.appendChild(apples);
       divisionResult.appendChild(basket);
     }
   
     const answer = document.createElement('div');
     answer.className = 'answer-line';
     if (remainder === 0) {
       answer.textContent = `${total} ÷ ${basketsCount} = ${perBasket} 🎉`;
     } else {
       answer.textContent = `${total} ÷ ${basketsCount} = ${perBasket} و باقی‌مانده ${remainder} ✨`;
     }
     divisionResult.appendChild(answer);
   }
   
   if (divideBtn) divideBtn.addEventListener('click', renderDivision);
   renderDivision();
   
   /* ============================================================
      ۴. بازی ضرب
      ============================================================ */
   let mulScore = 0;
   const mulQuestionEl = document.getElementById('mulQuestion');
   const mulOptionsEl = document.getElementById('mulOptions');
   const mulFeedbackEl = document.getElementById('mulFeedback');
   const mulScoreEl = document.getElementById('mulScore');
   
   function newMulQuestion() {
     mulFeedbackEl.textContent = '';
     mulFeedbackEl.className = 'feedback';
     mulOptionsEl.innerHTML = '';
   
     const a = Math.floor(Math.random() * 9) + 2;
     const b = Math.floor(Math.random() * 9) + 2;
     const correct = a * b;
   
     mulQuestionEl.textContent = `${a} × ${b} = ?`;
   
     const options = new Set([correct]);
     let safety = 0;
     while (options.size < 4 && safety < 100) {
       safety++;
       const offset = Math.floor(Math.random() * 20) - 10;
       const wrong = correct + offset;
       if (wrong > 0 && wrong !== correct) options.add(wrong);
     }
   
     const shuffled = [...options].sort(() => Math.random() - 0.5);
   
     shuffled.forEach((val) => {
       const btn = document.createElement('button');
       btn.className = 'option-btn';
       btn.textContent = val;
       btn.addEventListener('click', () => handleMulAnswer(btn, val, correct));
       mulOptionsEl.appendChild(btn);
     });
   }
   
   function handleMulAnswer(btn, val, correct) {
     mulOptionsEl.querySelectorAll('.option-btn').forEach((b) => (b.disabled = true));
   
     if (val === correct) {
       btn.classList.add('correct');
       mulScore++;
       mulScoreEl.textContent = mulScore;
       mulFeedbackEl.textContent = '🎉 آفرین! درست بود';
       mulFeedbackEl.className = 'feedback good';
       setTimeout(newMulQuestion, 1200);
     } else {
       btn.classList.add('wrong');
       mulFeedbackEl.textContent = `❌ اشتباه بود! جواب درست: ${correct}`;
       mulFeedbackEl.className = 'feedback bad';
       mulOptionsEl.querySelectorAll('.option-btn').forEach((b) => {
         if (parseInt(b.textContent) === correct) b.classList.add('correct');
       });
       setTimeout(newMulQuestion, 1800);
     }
   }
   
   document.getElementById('mulRestart').addEventListener('click', () => {
     mulScore = 0;
     mulScoreEl.textContent = 0;
     newMulQuestion();
   });
   
   newMulQuestion();
   
   /* ============================================================
      ۵. بازی تقسیم (Drag & Drop)
      ============================================================ */
   let divScore = 0;
   const divScoreEl = document.getElementById('divScore');
   const divQuestionEl = document.getElementById('divQuestion');
   const applePool = document.getElementById('applePool');
   const basketsRow = document.getElementById('basketsRow');
   const divFeedbackEl = document.getElementById('divFeedback');
   
   let currentTotal = 0;
   let currentBaskets = 0;
   let perBasket = 0;
   let placedCount = 0;
   let draggedApple = null;
   
   function startDivisionGame() {
     divFeedbackEl.textContent = '';
     divFeedbackEl.className = 'feedback';
     applePool.innerHTML = '';
     basketsRow.innerHTML = '';
   
     currentBaskets = Math.floor(Math.random() * 3) + 2; // ۲ تا ۴
     perBasket = Math.floor(Math.random() * 4) + 1;      // ۱ تا ۴
     currentTotal = currentBaskets * perBasket;
     placedCount = 0;
   
     divQuestionEl.textContent = `${currentTotal} ÷ ${currentBaskets} = ?`;
   
     // ساخت سیب‌ها در استخر
     for (let i = 0; i < currentTotal; i++) {
       const apple = document.createElement('span');
       apple.className = 'apple';
       apple.textContent = '🍎';
       apple.draggable = true;
   
       // --- رویدادهای HTML5 Drag (برای دسکتاپ) ---
       apple.addEventListener('dragstart', (e) => {
         draggedApple = apple;
         apple.classList.add('dragging');
         e.dataTransfer.setData('text/plain', 'apple');
         e.dataTransfer.effectAllowed = 'move';
       });
   
       apple.addEventListener('dragend', () => {
         apple.classList.remove('dragging');
         draggedApple = null;
         basketsRow.querySelectorAll('.drop-basket').forEach((b) => b.classList.remove('drag-over'));
       });
   
       // --- پشتیبانی لمس (موبایل) ---
       setupTouchDrag(apple);
   
       applePool.appendChild(apple);
     }
   
     // ساخت سبدها
     for (let b = 1; b <= currentBaskets; b++) {
       const basket = document.createElement('div');
       basket.className = 'drop-basket';
   
       const label = document.createElement('div');
       label.className = 'basket-label';
       label.textContent = `سبد ${b}`;
       basket.appendChild(label);
   
       const content = document.createElement('div');
       content.className = 'basket-content';
       basket.appendChild(content);
   
       basket.addEventListener('dragover', (e) => {
         e.preventDefault();
         e.dataTransfer.dropEffect = 'move';
         basket.classList.add('drag-over');
       });
   
       basket.addEventListener('dragleave', () => {
         basket.classList.remove('drag-over');
       });
   
       basket.addEventListener('drop', (e) => {
         e.preventDefault();
         basket.classList.remove('drag-over');
         if (draggedApple) {
           moveAppleToBasket(draggedApple, basket);
         }
       });
   
       basketsRow.appendChild(basket);
     }
   }
   
   function moveAppleToBasket(apple, basket) {
     // مطمئن شویم سیب هنوز در استخر است
     if (apple.parentElement !== applePool) return;
   
     apple.remove();
   
     const content = basket.querySelector('.basket-content');
     const clone = document.createElement('span');
     clone.textContent = '🍎';
     content.appendChild(clone);
   
     placedCount++;
     checkDivisionWin();
   }
   
   function checkDivisionWin() {
     if (placedCount !== currentTotal) return;
   
     const baskets = basketsRow.querySelectorAll('.drop-basket');
     let allCorrect = true;
   
     baskets.forEach((b) => {
       const count = b.querySelectorAll('.basket-content span').length;
       if (count === perBasket) {
         b.classList.add('correct-all');
       } else {
         allCorrect = false;
       }
     });
   
     if (allCorrect) {
       divScore++;
       divScoreEl.textContent = divScore;
       divFeedbackEl.textContent = `🎉 عالی بود! هر سبد ${perBasket} سیب دارد. جواب: ${perBasket}`;
       divFeedbackEl.className = 'feedback good';
       setTimeout(startDivisionGame, 2000);
     } else {
       divFeedbackEl.textContent = `🤔 همه سیب‌ها چیده شد، اما هر سبد باید دقیقاً ${perBasket} سیب داشته باشد. دوباره تلاش کن!`;
       divFeedbackEl.className = 'feedback bad';
       setTimeout(startDivisionGame, 2200);
     }
   }
   
   /* --- درگ لمسی (موبایل) --- */
   function setupTouchDrag(apple) {
     let touchClone = null;
     let activeBasket = null;
   
     apple.addEventListener('touchstart', (e) => {
       e.preventDefault();
       draggedApple = apple;
       activeBasket = null;
   
       const touch = e.touches[0];
       touchClone = apple.cloneNode(true);
       touchClone.style.position = 'fixed';
       touchClone.style.pointerEvents = 'none';
       touchClone.style.zIndex = '9999';
       touchClone.style.fontSize = '1.8rem';
       touchClone.style.opacity = '0.85';
       touchClone.style.left = touch.clientX - 15 + 'px';
       touchClone.style.top = touch.clientY - 15 + 'px';
       document.body.appendChild(touchClone);
   
       apple.style.opacity = '0.4';
     }, { passive: false });
   
     apple.addEventListener('touchmove', (e) => {
       if (!touchClone) return;
       e.preventDefault();
       const touch = e.touches[0];
       touchClone.style.left = touch.clientX - 15 + 'px';
       touchClone.style.top = touch.clientY - 15 + 'px';
   
       // تشخیص سبد زیر انگشت
       const elem = document.elementFromPoint(touch.clientX, touch.clientY);
       const basket = elem ? elem.closest('.drop-basket') : null;
   
       basketsRow.querySelectorAll('.drop-basket').forEach((b) => b.classList.remove('drag-over'));
       if (basket) basket.classList.add('drag-over');
       activeBasket = basket;
     }, { passive: false });
   
     apple.addEventListener('touchend', (e) => {
       if (touchClone) {
         touchClone.remove();
         touchClone = null;
       }
       apple.style.opacity = '1';
       basketsRow.querySelectorAll('.drop-basket').forEach((b) => b.classList.remove('drag-over'));
   
       if (activeBasket && draggedApple) {
         moveAppleToBasket(draggedApple, activeBasket);
       }
       draggedApple = null;
       activeBasket = null;
     });
   
     apple.addEventListener('touchcancel', () => {
       if (touchClone) { touchClone.remove(); touchClone = null; }
       apple.style.opacity = '1';
       basketsRow.querySelectorAll('.drop-basket').forEach((b) => b.classList.remove('drag-over'));
       draggedApple = null;
       activeBasket = null;
     });
   }
   
   document.getElementById('divRestart').addEventListener('click', () => {
     divScore = 0;
     divScoreEl.textContent = 0;
     startDivisionGame();
   });
   
   // بازی تقسیم رو در حالت مخفی آماده نکن؛ فقط وقتی تب باز شد اجرا شود
   // (اولین بار که کاربر روی تب کلیک کند اجرا می‌شود)