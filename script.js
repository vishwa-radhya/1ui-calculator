const clockIcon=document.getElementById('clock-svg');
const queryInput=document.getElementById('query-input');
const solutionInput=document.getElementById('solution-input');
const historyInfo=document.getElementById('history-info');
const historyInfoContainer=document.getElementById('history-info-cont');
const clearHistoryBtn=document.getElementById('clear-history');
const changeTheme=document.getElementById('change-theme').children[0]
const delIcon=document.getElementById('del');
const delIconImg=document.getElementById('del').children[0];
let toggleUrl = false;
let clockUrl='assets/clock.svg';
let calcUrl='assets/calculator.svg';
const argArray=['%','÷','×','-','+'];
let isDecimal=false;
const keys=document.getElementsByClassName('key');
const errorEle=document.getElementById('error-ele');
let historyObject={};

window.onload=()=>{
    changeTheme.style.visibility='visible';
}

function replaceIcons(){
    toggleUrl=!toggleUrl;
    clockIcon.src= toggleUrl ? calcUrl : clockUrl;
    expandHistory()
}

function changeThemeFixer(arg){
    if(arg==='light'){
        clockUrl='assets/clock-l.svg';
        calcUrl='assets/calculator-l.svg';
        clockIcon.src=clockUrl;
        delIconImg.src='assets/delete-l.svg';
    }else{
        clockUrl='assets/clock.svg';
        calcUrl='assets/calculator.svg';
        clockIcon.src=clockUrl;
        delIconImg.src='assets/delete.svg';
    }
}

function changeThemeHandler(){
    if(changeTheme.classList[1]==='fa-sun'){
        changeThemeFixer('light')
        changeTheme.classList.replace('fa-sun','fa-moon');
        document.documentElement.setAttribute('data-theme','white')
    }else{
        changeTheme.classList.replace('fa-moon','fa-sun');
        changeThemeFixer('dark')
        document.documentElement.setAttribute('data-theme','dark')
    }
    // document.documentElement.setAttribute('data-theme','white')
}

changeTheme.addEventListener('click',changeThemeHandler);


function expandHistory(){
    const innerWidth=window.innerWidth;
    if(toggleUrl){
        if(innerWidth>1200 || (innerWidth<1200 && innerWidth>430) ){
            historyInfo.style.width='28rem'
        }else if(innerWidth<430 && innerWidth>375){
            historyInfo.style.width='28rem'
        }else if(innerWidth<370 && innerWidth>250){
            historyInfo.style.width='19rem'
        }else if(innerWidth<250){
            historyInfo.style.width='15rem'
        }
        if(window.innerHeight>749){
            historyInfo.style.width='30rem'
        }
        historyInfo.style.borderRight='1px solid rgb(80, 77, 77,0.4)'
        // historyInfoContainer.style.width='auto'
        // clearHistoryBtn.style.width='60%'
        clearHistoryBtn.style.visibility='visible'
    }else{
        historyInfo.style.width='0px'
        historyInfo.style.borderRight='none'
        // historyInfoContainer.style.width='0px'
        // clearHistoryBtn.style.width='0px'
        clearHistoryBtn.style.visibility='hidden'
    }
}

function adddToQuery(arg){
    resetSolutionQueryColor()
    if(queryInput.value.startsWith('0')){
        queryInput.value=queryInput.value.slice(1)
    }
    queryInput.value+=arg;
}

function adddToQueryZero(arg){
    resetSolutionQueryColor()
    if(queryInput.value===''){
        queryInput.value+='0'
        return;
    }
    queryInput.value+='0';
}

function clearQuery(){
    queryInput.value=''
    solutionInput.value=''
    resetSolutionQueryColor()
}

function deleteQuery(){
    resetSolutionQueryColor()
    const content=queryInput.value;
    queryInput.value=content.slice(0,content.length-1)
    if(!queryInput.value){
        solutionInput.value=''
    }
}

function addOperators(arg){
    if(queryInput.value==='' || queryInput.value[queryInput.value.length-1]==='(') return;
    if(argArray.includes(queryInput.value[queryInput.value.length-1])){
        return;
    }
    queryInput.value+=arg;
}

function addBrackets(arg){
    const content=queryInput.value;
    if(queryInput.value===''){
        queryInput.value+='('
        return;
    }
    queryInput.value+=arg;
}

//should modify
function addPoint(){
    resetSolutionQueryColor()
    const content=queryInput.value;
    if(queryInput.value==='' || argArray.includes(queryInput.value[queryInput.value.length-1])){
        queryInput.value+='0.'
        return;
    }
    if(queryInput.value[queryInput.value.length-1]==='.'){
        return;
    }
    if(!isDecimal && (content === '' || isOperator(content.slice(-1)))){
        queryInput.value+='.'
        isDecimal=true;
        return;
    }
    queryInput.value+='.'
    checkDec()
}
function isOperator(char){
    return char==='+' || char==='-' || char==='×' || char==='÷' || char==='%'
}

function stringContainsAny(str, stringArray) {
    return stringArray.some(item => str.includes(item));
  }

function addNegative(){
    const content=queryInput.value;
    if(content===''){
        queryInput.value+='(-'
        return;
    }
    if(content[content.length-1]==='-' && content[content.length-2]==='('){
        queryInput.value=content.slice(0,content.length-2);
        return;
    }
    if(content[content.length-1]===')'){
        queryInput.value=content+'×(-'
        return;
    }

    queryInput.value+='(-';
}

function checkDec(){
    const content =queryInput.value;
    if(content[content.length-1] === content[content.length-3]){
        queryInput.value=content.slice(0,content.length-1)
    } 
}

function attemptingAutoCalc(){
    let query = queryInput.value;
    query=query.replace(/[×]/g,'*')
    query=query.replace(/[÷]/g,'/')
    if(queryInput.value ===''){
        return;
    }
    try{
        if(Number(query[query.length-1]) || Number(query[query.length-2])){
            solutionInput.value=eval(query)
        }
    }catch(e){
        console.log(e);
    }
}

function solveQuery(){
    try{
    let query = queryInput.value;
    let queryForHistory =query;
    query=query.replace(/[×]/g,'*')
    query=query.replace(/[÷]/g,'/')
    let result = eval(query);
    if(solutionInput.value){
        queryInput.value=result;
        solutionInput.style.color='rgb(15, 15, 15)'
    }
    else{
        solutionInput.value=result;
    }
    historyObject[queryForHistory]=result;
    updateHistoryTab()
    }
    catch(e){
        if(e.message==='Unexpected end of input'){
            errorEle.classList.remove('hid')
            errorEle.classList.add('sho')
            setTimeout(()=>{
                errorEle.classList.remove('sho')
                errorEle.classList.add('hid')
            },2000)
        }
    }
}

function resetSolutionQueryColor(){
    solutionInput.style.color='rgb(87, 70, 73)'
}

for(let key of keys){
    key.addEventListener('click',attemptingAutoCalc);
}

function clearUndefinedHistory(){
    for(let prop in historyObject){
        if(historyObject[prop]===undefined){
            delete historyObject[prop];
        }
    }
}

function updateHistoryTab(){
    clearUndefinedHistory()
    const [entryCheck]=Object.keys(historyObject)
    if(entryCheck){
    const lastIndexKeyArr=Object.keys(historyObject).slice(-1);
    const lastIndexValArr=Object.values(historyObject).slice(-1);
    const [query]=lastIndexKeyArr;
    const [solution]=lastIndexValArr;
    const queryP=document.createElement('p')
    const solutionP=document.createElement('p')
    queryP.textContent=query
    solutionP.textContent='= '+solution
    queryP.classList.add('hist-p')
    solutionP.classList.add('hist-p')
    queryP.classList.add('hist-query')
    solutionP.classList.add('hist-solution')
    historyInfoContainer.appendChild(queryP)
    historyInfoContainer.appendChild(solutionP)
    }else{
        return;
    }
}

function formatHistoryHandler(){
    historyInfoContainer.innerHTML=''
}

function formatHistory(){
    for(let prop in historyObject ){
        if(historyObject.hasOwnProperty(prop)){
            delete historyObject[prop];
        }
    }
    formatHistoryHandler()
}

clearHistoryBtn.addEventListener('click',formatHistory);

delIcon.addEventListener('')