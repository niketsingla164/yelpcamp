const a = document.querySelector('.click');
document.addEventListener('click',(e)=>{
    e.preventDefault();
    e.stopPropagation();
})