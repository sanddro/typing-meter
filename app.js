(async () => {
    const maxSentences = 1;
    const wordLength = 6;
    const api = 'https://www.randomtext.me/api/gibberish/w/8-80';

    async function getText() {
        let data = await (await fetch(api)).json();
        return data.text_out;
    }

    let box = document.querySelector('.box');
    let timer = document.querySelector('.timer');
    let wpmInfo = document.querySelector('.wpm-info');
    let popup = document.querySelector('.end-popup');
    let seconds = document.querySelector('.seconds');
    let accuracy = document.querySelector('.accuracy');
    let errors = document.querySelector('.errors');
    let wpmEnd = document.querySelector('.wpm');

    let text = await getText();

    for (let i = 0; i < text.length; i++) {
        let elem = document.createElement('span');
        elem.innerHTML = text[i];
        box.appendChild(elem);
    }
    let letters = document.querySelectorAll('.box span');
    box.style.display = 'block';

    
    let timerInterval = {};

    let nPressed = 0;
    let lettersIdx = 0;
    let secondsPassed = 0;
    function keyPressHandler(e) {
        if(nPressed == 0){
            timerInterval = setInterval(() => {
                secondsPassed++;
                let txt = secondsPassed + ' s';
                if(secondsPassed > 60){
                    let minutes = Math.floor(secondsPassed / 60);
                    let seconds = secondsPassed - minutes * 60;
                    txt = minutes + ' m ' + seconds + ' s'; 
                }
                timer.innerHTML = txt;
                let words = lettersIdx / wordLength;
                realWpm = (words / (secondsPassed || 1) * 60).toFixed(1);
                wpmInfo.innerHTML = realWpm + ' wpm';
                
            }, 1000);
        }
        nPressed++;
        if (text[lettersIdx] == e.key) {
            letters[lettersIdx].classList.add('typed');
            lettersIdx++;
            if(lettersIdx == text.length){
                end();
            }
        } else {
            box.classList.add('err');
            setTimeout(() => {
                box.classList.remove('err');
            }, 100);
        }
    }

    function end(){
        document.removeEventListener('keypress', keyPressHandler);
        clearInterval(timerInterval);
        popup.style.display = 'block';
        seconds.innerHTML = secondsPassed;
        errors.innerHTML = nPressed - text.length;
        
        let nMissed = nPressed - text.length;
        let acc = ((1 - nMissed / nPressed) * 100).toFixed(2);
        accuracy.innerHTML = acc;
        let words = lettersIdx / wordLength;
        let wpm = (words / (secondsPassed || 1) * 60).toFixed(1);
        wpmEnd.innerHTML = wpm;
    }

    document.addEventListener('keypress', keyPressHandler);
})();