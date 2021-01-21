'use strict'

const character = document.querySelector('.game__character'),
    block = document.querySelector('.game__block');

window.addEventListener('keydown', (e) => {
    if (e.key == " ") {
        jump(e);
    }
});

function jump(e) {
    character.classList.add('game__character--active');

    setTimeout(() => {
        character.classList.remove('game__character--active');
    }, 600);
}

const counter = document.querySelector('.game__counter-current');
let i = 0

const setCounter = setInterval(() => {
    counter.innerHTML = `Current ${i}`;
    i++;
}, 100);

const score = document.querySelector('.game__score'),
    scoreText = document.querySelector('.game__score-text');

const checkDead = setInterval(() => {
    const characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
    const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));

    if (blockLeft <= 150 && blockLeft >= 100 && characterTop >= 250) {
        dead();
    }

}, 10);

function dead() {
    clearInterval(setCounter);
    block.classList.add('game__block--dead');
    score.classList.add('game__score--active');
    scoreText.innerHTML = `Your score = ${--i}`;
}