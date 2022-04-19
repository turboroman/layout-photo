ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
    center: [55.76, 37.61],
    zoom: 13.5,
    saturation: -1,
  }, {
    searchControlProvider: 'yandex#search'
  }),

    myPlacemark = new ymaps.Placemark([55.76841929606315, 37.63958360445713], {
      hintContent: 'Собственный значок метки',
      balloonContent: 'Это красивая метка'
    }, {
      iconLayout: 'default#image',
      iconImageHref: '../img/map-point.jpg',
      iconImageSize: [12, 12],
    });
  myMap.geoObjects
    .add(myPlacemark)
});

