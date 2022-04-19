const map = document.querySelector('.contacts__map-section');
const closeInfoBtn = document.querySelector('.info__close');
const info = document.querySelector('.info');
const title = document.querySelector('.contacts__title')

closeInfoBtn.addEventListener('click', () => {
  info.classList.add('close')
})
title.addEventListener('click', () => {
  info.classList.remove('close')
})

