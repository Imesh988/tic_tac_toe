//body ektm event lisnter kenek set karai
document.addEventListener('DOMContentLoaded', () => {
    //DOM element
    const status = document.getElementById('status');
    //class name ekak gnne  . walim
    const cells = document.querySelectorAll('.cell');
    const resetBtn = document.getElementById('resetBtn');
    const soundToggle = document.getElementById('soundToggle');
    const musicToggle = document.getElementById('musicToggle');
    const computerScoreEl = document.getElementById('computerScore');
    const playerScoreEl = document.getElementById('playerScore');
    const tieScoreEl = document.getElementById('tieScore');

    //audio eliment (sound set kari)
    const baclgroundMusic = document.getElementById('backgroundMusic');
    const clickSound = document.getElementById('clickSound');
    const winSound = document.getElementById('winSound');
    const loseSound = document.getElementById('loseSound');
    const drowSound = document.getElementById('drowSound');

    //game status
    //new design in arry create   9 kiynne element gana cunstructor ekat  denne element gana 
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;
    let scores = { player: 0, computer: 0, ties: 0 };
    let soundEnable = true;
    let musicEnable = true;

    //winning patterns
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    function initGame() {
        //initalize parat   mulinm run wenne meka
        board = Array(9).fill(null);
         currentPlayer = 'X';
         gameActive = true;
        status.textContent = 'You turn (x)';

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        if(musicEnable){
            baclgroundMusic.currentTime = 0;
            baclgroundMusic.play().catch(e => console.log('Autoplay prevented :',e));
        }

    }
//play sound if sound
    function playSound(clickSound){
        if(soundEnable){
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Sound error : ", e));
        }
    }

    //handle cell click karan wena dewal tika
    function handleCellClick(e){
        const index = e.target.getAttribute('data-index');

        if(board[index] || !gameActive) return

        playSound(currentPlayer);
        makeMove(index, currentPlayer);

        if(checkWin(currentPlayer)){
            endGame(currentPlayer === 'X' ? 'player' : 'computer');
            return;
        }
        if(checkDraw()){
            endGame('tie');
            return;
        }

        currentPlayer = '0';
        status.textContent = "computer's turn ";

        setTimeout(computerMove, 800);
    }

    function makeMove(index, player){
        //paya kran parat eka 
        board[index] = player;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    };

    function computerMove(){
        if(!gameActive) return;

        //try to win
        let move = findwinningMove('0');

        //block player's winning move
        if(move === null){
            move = findwinningMove('X');
        }

        	//chose center if available
        if(move === null && board[4] === null){
            move = 4;
        }

        //chose random available coners
        if(move === null){
            const coners = [0,2,6,8].filter(i => board[i] === null);
            if(coners.length > 0 ){
                move = coners[Math.floor(Math.random()*coners.length)];
            }
        }
         //chose random available coners
        if(move === null){
            const edges  = [1,3,5,7].filter(i => board[i] === null);
            if(edges.length > 0 ){
                move = edges[Math.floor(Math.random()*edges.length)];
            }
        }

        //make the move 
        if(move !== null){
            playSound(clickSound);
            makeMove(move, '0');

            //check for win or drow 
            if(checkWin('0')){
                endGame('computer');
                return;
            }

            if(checkDraw()){
                endGame('tie');
                return;
            }

            //swich back to player's turn
            currentPlayer = 'X';
            status.textContent =  'Your turn (X)';

        }
    }

    function findwinningMove(player){
        for(const pattern of winPatterns){
            const [a, b, c] = pattern;

            if(board[a] === player && board[b] === player && board[c] === null) return c;
            if(board[a] === player && board[c] === player && board[b] === null) return b;
            if(board[b] === player && board[c] === player && board[a] === null) return a;
        }
        return null;
    }

    function checkWin(player){
        return winPatterns.some(pattern => {
            return pattern.every(index => {
                return board[index] === player;
            })
        })
    }

    function checkDraw(){
        return board.every(cell => cell !== null);
    }

    function endGame(winner){
        gameActive = false;
        
        if(winner !== 'tie'){
            highlightwinningCell();
        }

        //update status and score
        switch(winner){
            case 'player':
                status.textContent = 'You Win! 🎉';
                scores.player++;
                playerScoreEl.textContent = scores.player;
                playSound(winSound);
                break;

                case 'computer':
                status.textContent = 'computer wins!  🤖';
                scores.computer++;
                computerScoreEl.textContent = scores.computer;
                playSound(loseSound);
                break;
                
                case 'tie':
                    status.textContent = 'Game ended in a drow! 🤝';
                    scores.ties++;
                    tieScoreEl.textContent = scores.ties;
                    playSound(drowSound);
                    break; 
        }
    }

    function highlightwinningCell(){
        const winningPattern = winPatterns.find(pattern => {
            const [a,b,c] = pattern;
            return board[a] && board[a]===board[b] && board[a]===board[c];
        });
        
        if(winningPattern){
            winningPattern.forEach(index => {
                document.querySelector(`[data-index="${index}"]`).classList.add('win');
            });
        }
    }

    function toggleSound(){
        soundEnable = !soundEnable;
        soundToggle.classList.toggle('active', soundEnable);
        soundToggle.innerHTML = soundEnable ? `<i class="fas fa-volume-up"></i>`:
        `<i class="fas fa-volume-mute"></i>`;
    }

    function toggleMusic(){
        musicEnable = !musicEnable;
        musicToggle.classList.toggle('active', musicEnable);
        musicToggle.innerHTML = musicEnable ? `<i class="fas fa-music"></i>`:
        `<i class="fas fa-volume-off"></i>`;

        if(musicEnable){
            baclgroundMusic.play().catch(e => console.log("music play prevented: ", e));
        }else{
            baclgroundMusic.pause();
        }
    }

    //event listners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);

    });
    resetBtn.addEventListener('click',initGame);
    soundToggle.addEventListener('click', toggleSound);
    musicToggle.addEventListener('click', toggleMusic);

    toggleSound();
    toggleMusic();

    //start the game
    initGame();

})