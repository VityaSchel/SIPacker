# SIPacker

Онлайн-редактор паков для Своей Игры (SiGame Владимиря Хиля)

<p align="center">
  <img src="https://user-images.githubusercontent.com/59040542/137257961-73f0aceb-19c9-4e1f-a3fe-80204f145f2d.png" />
</p>

## Развернутая версия

[https://vityaschel.github.io/SIPacker](https://vityaschel.github.io/SIPacker) (ветка gh-pages)

## Запуск локально

### Способ 1: Готовый билд (может быть устаревшим)

Скачайте репозиторий, откройте ветку gh-pages и откройте файл index.html в корне репозитория. Судя по спецификации w3c, протокол file:// находится в SecureContext, а значит все технологии PWA должны работать, но лучше все же запустить сервер на localhost.

### Способ 2: Запуск сервера для разработки

Скачайте репозиторий, зайдите в корень репозитория и запустите

```
$ ESLINT_NO_DEV_ERRORS=true npm start
```

Если вам необходимо изменить порт, введите

```
$ ESLINT_NO_DEV_ERRORS=true PORT=1234 npm start
```

На ветке master всегда устаревшая, но стабильная версия приложения. На ветке dev я делаю коммиты довольно часто, но возможны рантайм-ошибки.

### Способ 3: Локальный билд

```
$ DISABLE_ESLINT_PLUGIN=true npm run build
```

Если необходимо сделать билд с префиксом в url, установите его в переменной REACT_APP_PREFIX с косой чертой вначале, но без нее в конце.

```
$ DISABLE_ESLINT_PLUGIN=true REACT_APP_PREFIX=/SIPacker npm run build
```

Выводится в папку build

## Contributing

Не надо

## Спонсирование

Пожалуйста задонатьте мне пожалуйста [https://donationalerts.com/r/vityaschel](https://donationalerts.com/r/vityaschel).

Как только получу статус самозанятого так сразу перейду куда-то еще, а пока будьте добры донатить не меньше 250 руб чтобы я мог их вывести :)))