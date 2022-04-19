const burger = document.querySelector('.burger');
const menu = document.querySelector('.burger-menu');
const close = document.querySelector('.burger-menu__close');

burger.addEventListener('click', () => {
  menu.classList.add('open');
})

close.addEventListener('click', () => {
  menu.classList.remove('open');
})