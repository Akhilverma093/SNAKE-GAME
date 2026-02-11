const board=document.querySelector('.board');
const startButton=document.querySelector(".btn-start")
const modal=document.querySelector(".modal")
const stratGameModal=document.querySelector(".start-game")
const gameOverModadl = document.querySelector(".game-over")
const restartButton=document.querySelector(".btn-restart")
const highScoreElement=document.querySelector("#high-score")
const scoreElement=document.querySelector("#score");
const timeElement=document.querySelector("#time")


const blockHeight=50
const blockwidth=50

let highScore=localStorage.getItem("highScore")||0;//0 is liye hai ki starting mai local storage mai koi bhi value nhi hogi toh undefine dega toh usse bachne ke liye humne 0 diya hai
let score=0
let time=`00:00`

//ye page reload pr ayega lekin hame restart krne pr bhi yhi ana chahiye uske liye hum restart fxn mai bhi likhenge ye
highScoreElement.innerText=highScore

const cols = Math.floor(board.clientWidth/blockwidth);
const rows= Math.floor(board.clientHeight/blockHeight);
let intervalId=null;
let timerIntervalId=null;//ye time ko calculate krne ke liye banaya hai
//for food-
let food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}



const blocks=[];
//now we make a snake whose initial length is 1.
//snake ka mouth uss side hoga jo snake ke array mai pehla element hoga
let snake=[{x:1,y:3}]

let direction='right';



// for(let i=0;i<rows*cols;i++){
//     const block=document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }
//OR both are same loops
for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
    const block=document.createElement('div');
    block.classList.add("block");
    board.appendChild(block);
    // block.innerText=`${row}-${col}`;
    blocks[`${row}-${col}`]=block
    }
}

function render(){

    let head=null
    
    blocks[`${food.x}-${food.y}`].classList.add("food")

    //ye snake ko direction dene ke liye hai
    if(direction==="left"){
        head={x:snake[0].x,y:snake[0].y-1}
    }else if(direction==="right"){
        head={x:snake[0].x,y:snake[0].y+1}
    }else if(direction==="down"){
         head={x:snake[0].x+1,y:snake[0].y}
    }else if(direction==="up"){
         head={x:snake[0].x-1,y:snake[0].y}
    }

    if(head.x<0 ||head.x>=rows || head.y<0 || head.y>=cols){
        clearInterval(intervalId);
        modal.style.display="flex"
        stratGameModal.style.display="none";
        gameOverModadl.style.display="flex";
        return;
    }
     //ye logic food consume krne ke liye hai
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food")
        food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
        blocks[`${food.x}-${food.y}`].classList.add("food")
        snake.unshift(head)
//this is score calcualting code part-
        score+=5;
        scoreElement.innerText=score;

        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",highScore)
        }
    }


     snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
     })
    snake.unshift(head);
    // unshift se array ke starting mai append ho jayega
    snake.pop();


     snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill")
     })
}

startButton.addEventListener("click",()=>{
    modal.style.display="none";
    intervalId=setInterval(()=>{render()},200)

    //this is the code to set a time 
    timerIntervalId=setInterval(()=>{
      //split ek kisi symbol ke basis pr split kr deta hai aur usko ek array ki form mai deta hai
        let[min,sec]=time.split(":").map(Number);
        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }

        time=`${min}:${sec}`
        timeElement.innerText=time;
    },1000)
})

restartButton.addEventListener("click",restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    score=0
    time=`00:00`
    scoreElement.innerText=score;
    timeElement.innerText=time
    highScoreElement.innerText=highScore

    modal.style.display="none";
    direction="down"
    snake=[{x:1,y:3}]
    food={x:Math.floor(Math.random()*rows),y:Math.floor(Math.random()*cols)}
    intervalId=setInterval(()=>{render()},200)
}

 addEventListener("keydown",function(event){
    if(event.key=="ArrowUp"){
        direction="up";
    }else if(event.key=="ArrowRight"){
        direction="right";
    }else if(event.key=="ArrowLeft"){
        direction="left"
    }else if(event.key=="ArrowDown"){
        direction="down"
    }

 })
