export const questionPriceHint = <p>
  <b>Стоимость вопроса</b> — это число очков, обычно кратное 100, которое получает игрок
  в случае правильного ответа и теряет в случае неправильного ответа (за исключением ответа на Вопрос без риска).
  Это число отображается в таблице раунда.
</p>

export const questionTypesHint = <>
  <p>
    <b>Обычный</b> — Этот вопрос задаётся, затем у всех игроков есть время, чтобы подумать и нажать на кнопку.
    Нажавший раньше остальных отвечает. В случае верного ответа стоимость вопроса прибавляется к счёту
    игрока, в случае неверного - стоимость вопроса снимается со счёта игрока. В случае неверного ответа
    кнопку снова могут жать не отвечавшие игроки.
  </p>
  <p>
    <b>Со ставкой (аукцион)</b> — При розыгрыше этого вопроса игроки последовательно, в порядке возрастания сумм (но начиная
    с того, кому вопрос достался), делают ставки, перекрывая ставки оппонентов. Минимальная ставка равна
    номинальной стоимости вопроса. Можно сказать «Пас» и выйти из торгов. Можно пойти «ва-банк» —
    поставить всё на кон. Ва-банк перекрывает все простые ставки, но пойти ва-банк можно только
    перекрывая по сумме предыдущую ставку. Тот, кто поставит больше остальных, будет единилично
    играть этот вопрос без возможности отказаться. Стоимость вопроса равна стоимости ставки играющего.
  </p>
  <p>
    <b>С секретом</b> — Тот, кому достался вопрос, обязан передать его другом игроку, и последний обязан
    ответить на полученный вопрос. Вопрос имеет собственную тему и стоимость, неизвестную до отдачи.
  </p>
  <p>
    <b>Кот в мешке</b> — На этот вопрос отвечает 1 человек. Отвечающего назначает открывший вопрос игрок.
    У вопроса имеется собственная тема и стоимость.
  </p>
  <p>
    <b>Без риска</b> — На этот вопрос отвечает только игрок, открывший его. В случае правильного ответа
    он зарабатывает сумму, равную удвоенному номиналу вопроса. В случае неверного ответа он ничего не теряет.
  </p>
</>

export const realPriceHint = <p>
    Раннее указанная стоимость отображается в таблице с темами, в то время как настоящая стоимость влияет на счет
    игроков после ответа. Это поле действует лишь для вопросов с секретом и кот в мешке.
</p>

export const realPriceStepperHint = <>
  <p>
    Раннее указанная стоимость отображается в таблице с темами, в то время как настоящая стоимость влияет на счет
    игроков после ответа. Это поле действует лишь для вопросов с секретом и кот в мешке.
  </p>
  <p>
    Если не указано поле шаг, выбирать можно только из минимума и максимума.
  </p>
</>

export const realThemeHint = 'Настоящая тема вопроса — это строка, ее узнает игрок вместе с настоящей стоимостью. \
Вопрос должен быть именно на тему, указанную в этом поле.'

export const bagcatRealPriceTypeHint = <>
  <p>
    У вопроса Кот в мешке существует «настоящая стоимость», которая влияет на счет игроков после ответа, в отличии
    от обычной стоимости, которая отображается в таблице раунда.
  </p>
  <p>
    Настоящая стоимость для каждого вопроса может быть фиксированной или определяться в течение игры. Если вы выберете
    <b>фиксированную настоящую стоимость</b>, вам необходимо будет указать ее ниже.
  </p>
  <p>
    Во втором случае, настоящая стоимость выбирается игроком, на выбор которому дается два варианта: наименьшая и
    наибольшая стоимость из всех вопросов в раунде.
  </p>
  <p>
    Третий вариант это когда настоящая стоимость вопроса выбирается игроком в заданном вам интервале с заданным вами шагом.
    Если шаг не указан, выбирать можно только крайние значения
  </p>
</>

export const scenarioHint = <>
  <p>
    У каждого вопроса есть <b>сценарий</b> — порядок действий, выполняемый при выборе вопроса.
    Большинству вопросов достаточно одного события в сценарии — текста, изображения, аудио или видео,
    тем не менее, вы можете добавить до 100 событий в один сценарий.
  </p>
  <p>
    Ответ на вопрос это всегда строка, но вы можете добавить к ней сценарий. Например, если вы хотите после ответа игрока
    показать картинку или проиграть звук/видео, добавьте маркер &quot;<i>[Игроки отвечают]</i>&quot;, после которого
    вы сможете добавить сценарий, исполняющийся после ответа. Этот маркер добавлять необязательно, без него игроки также
    смогут ответить на вопрос и узнают правильный ответ.
  </p>
</>
