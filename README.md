# Man pages

> Лукьянов Илья, ПМИ-151, проект "Веб-приложение".

Проект — реализация просмотрщика man-страниц на клиентской стороне, использующего Polymer framework.

[Потыкать вживую](https://man.ilyaluk.ru/)

Формальные критерии: 

* 4: Реализовано веб-приложение, отображающее каталог с содержимым, и содержание man-страниц в виде их исходного текста. **сделано**

* 6: Реализовано преобразование текста из groff в HTML. **сделано**

* 8: Реализована поддержка сжатых gzip страниц. **сделано**

* +1 балл. Интерфейс реализован в соответствии с требованиями концепции Google Material Design. **Не уверен на 100%, но вроде бы похоже на него.**

* +1 балл. Реализован поиск по содержимому справочника. **сделано**

* +1 балл. Реализована корректная работа навигации средствами браузера (кнопка “Назад” работает правильно). **сделано**

Для установки надо запустить скрипт ./install.sh в папке проекта. Требуется python и bower. Ну и любой веб-сервер должен обслуживать данную директорию (желательно, чтобы это был корень домена).

Проект реализован при помощи фреймворка Polymer, использует библиотеки Manolo (для рендеринга groff), zlib.js (для распаковки gz), jQuery (много для чего).

Возникли сложности с элементом iron-ajax. При каких-то обстоятельствах при вставке его на страницу в chromium-based браузерах выжирается несколько гигабайт оперативной памяти. Сейчас я изучаю это поведение и напишу баг-репорт (если его ещё нет) в репозиторий элемента.

Я научился использовать Polymer framework и bower.