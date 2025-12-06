// 상태 변수
let totalSpent = 0;
let totalWon = 0;
let purchaseCount = 0;

// 등수별 당첨 횟수 (0은 낙첨)
let rankCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    0: 0
};

const PRIZE_MONEY = {
    1: 2000000000,
    2: 50000000,
    3: 2000000,
    4: 50000,
    5: 5000
};

// DOM 요소
const elTotalSpent = document.getElementById('total-spent');
const elBuyCount = document.getElementById('buy-count');
const elTotalWon = document.getElementById('total-won');
const elYieldRate = document.getElementById('yield-rate');
const elWinNumbers = document.getElementById('win-numbers');
const elMyNumbers = document.getElementById('my-numbers');
const elMessage = document.getElementById('message');
const btnBuy = document.getElementById('buy-btn');
const btnReset = document.getElementById('reset-btn');

// 카운트 표시 요소들
const elCounts = {
    1: document.getElementById('count-1'),
    2: document.getElementById('count-2'),
    3: document.getElementById('count-3'),
    4: document.getElementById('count-4'),
    5: document.getElementById('count-5'),
    0: document.getElementById('count-0')
};

// 랜덤 번호 생성
function getLottoNumbers(count) {
    const numbers = new Set();
    while (numbers.size < count) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return [...numbers].sort((a, b) => a - b);
}

// 공 색상
function getBallColor(num) {
    if (num <= 10) return '#fbc400';
    if (num <= 20) return '#69c8f2';
    if (num <= 30) return '#ff7272';
    if (num <= 40) return '#aaaaaa';
    return '#b0d840';
}

function createBallElement(num) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.innerText = num;
    ball.style.backgroundColor = getBallColor(num);
    return ball;
}

// 메인 게임 함수
function playLotto() {
    totalSpent += 1000;
    purchaseCount += 1;

    // 번호 생성
    const allNumbers = Array.from({length: 45}, (_, i) => i + 1);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    const winNumbers = shuffled.slice(0, 6).sort((a, b) => a - b);
    const bonusNumber = shuffled[6];
    const myNumbers = getLottoNumbers(6);

    // 렌더링
    renderBalls(elWinNumbers, winNumbers, bonusNumber);
    renderBalls(elMyNumbers, myNumbers);

    // 결과 확인
    checkResult(winNumbers, bonusNumber, myNumbers);
    
    // UI 업데이트
    updateScoreboard();
    updateRankCounts();
}

function renderBalls(container, numbers, bonus = null) {
    container.innerHTML = '';
    numbers.forEach(num => {
        container.appendChild(createBallElement(num));
    });

    if (bonus) {
        const plus = document.createElement('span');
        plus.innerText = '+';
        plus.classList.add('plus-sign');
        container.appendChild(plus);
        container.appendChild(createBallElement(bonus));
    }
}

function checkResult(winNums, bonusNum, myNums) {
    let matchCount = 0;
    myNums.forEach(num => {
        if (winNums.includes(num)) matchCount++;
    });

    let rank = 0; // 0은 낙첨
    let prize = 0;

    if (matchCount === 6) rank = 1;
    else if (matchCount === 5 && myNums.includes(bonusNum)) rank = 2;
    else if (matchCount === 5) rank = 3;
    else if (matchCount === 4) rank = 4;
    else if (matchCount === 3) rank = 5;

    // 당첨 횟수 증가
    rankCounts[rank]++;

    if (rank > 0) {
        prize = PRIZE_MONEY[rank];
        totalWon += prize;
        elMessage.innerText = `${rank}등 당첨 (${prize.toLocaleString()}원)`;
        elMessage.style.color = '#ffd700';
    } else {
        elMessage.innerText = `낙첨`;
        elMessage.style.color = '#ccc';
    }
}

function updateScoreboard() {
    elTotalSpent.innerText = totalSpent.toLocaleString() + '원';
    elBuyCount.innerText = purchaseCount.toLocaleString() + '회';
    elTotalWon.innerText = totalWon.toLocaleString() + '원';
    
    let yieldRate = 0;
    if (totalSpent > 0) {
        yieldRate = ((totalWon - totalSpent) / totalSpent) * 100;
    }
    
    elYieldRate.innerText = yieldRate.toFixed(2) + '%';
    
    elYieldRate.className = '';
    if (yieldRate >= 0) {
        elYieldRate.classList.add('val-green');
    } else {
        elYieldRate.classList.add('val-red');
    }
}

// 당첨 횟수 패널 업데이트
function updateRankCounts() {
    for (let r = 0; r <= 5; r++) {
        elCounts[r].innerText = rankCounts[r].toLocaleString() + '회';
    }
}

// 초기화
function resetGame() {
    totalSpent = 0;
    totalWon = 0;
    purchaseCount = 0;
    
    // 카운트 초기화
    rankCounts = { 1:0, 2:0, 3:0, 4:0, 5:0, 0:0 };

    elWinNumbers.innerHTML = '<span class="placeholder">추첨 대기중...</span>';
    elMyNumbers.innerHTML = '<span class="placeholder">구매 대기중...</span>';
    elMessage.innerText = '추첨';
    elMessage.style.color = '#ffd700';
    
    updateScoreboard();
    updateRankCounts();
}

btnBuy.addEventListener('click', playLotto);
btnReset.addEventListener('click', resetGame);