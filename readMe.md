Це все писалось до потрапляння на github, тому це все рахується як повідомлення про оновлення.
Загалом **[Mini-car racing](https://mini-car-racing.netlify.app)**- це онлайн гра, створена в розважальних цілях.
В ній присутня:

- хоч якась фізика машин з індикаторами: тахометр, спідометр, показник передач;
- простенький сюжет, що поділяється на 4 частини, в першій з яких гравець проходить навчання, а в наступних застосовує набуті знання по-новому - ганяє проти ботів;
- 3d повороти в 2d грі, якій ще й повністю рандомні, що викликає нові враження з кожним проходженням;
- самі справжні титри, де описаний особовий склад людей, причетних до гри;
- можливість сконтактуватись зі мною, при цьому оцінивши гру то написаши свою ел. адресу;
- музичний супровід, по стандарту - з 4 пісень, одна з яких випадково обирається та займає гравцеві вуха;
- меню паузи, котре доступне в любю мить і зупиняє гру. Воно несе в собі багато функцій:

1. можливість обрати своє власне розміщення функцій на клавіатурі в меню паузи;
2. побачити назви застосованих саундтреків;
3. прочитати опис поворотів та пораду про ефективний розгін;
4. можливість зхитрувати - зчитерити, за що на одну хивлину гравцю зменшує швидксть і розгін.

## Технології :

- Jquery, Jquery-cookie;
- SCSS;
- TYPESCRIPT;
- AOS (animate on scroll library);

Якщо ви це читаєте - мені приємно!

## Версія 1.0 - 2.2 - Уява розробника тільки розігрівається {

> Версія 1.0 - машина керується клавіатурою або мишкою на кнопки вправо, вліво, вгору і вниз. Може розвертатись на 180 градусів.

> Версія 1.1 - додано малюнки з умовною механікою потужності і швидкості руху машини.

> Версія 2.0 - Дорога рухається відносно машини; механіка оборотів прив'язана до швидкості машини; в HTML все зображено у вигляді електричних спідометрів; додано передачі.

> Версія 2.1 - Додано сюжет і навчанння гравця.

> Версія 2.2 - Колеса машини крутяться і з'являється "полум'я з вихлопної труби"

}

## Версія 3.0 - 3.4 - Тут розробник опреділився з бажанням КОДИТИ {

> Версія 3.0 - Максимально перероблені механіки торможіння, розгону, в HTML змінено всі показники машини (швидкість, ...); пофіксив недолік функції "onkeydown" при 2 або більше клавішах водночас.

> Версія 3.1 - Додано паузу, меню з клавішами управління, нихил машини при торможінні і розгоні.

> Версія 3.2 - кардинально перероблене закінчення вступу і на початку добавлена додаткова анімація

> Версія 3.3 - в кінці вступу можна зберегти прогрес і запустити любу гонку вперше або повторно.

> Версія 3.4 - В меню паузи можна обрати пояснення якоїсь механіки тегом select.

}

## Версії 4.0 - 4.6 - Концентрація на першій гонці {

> Вресія 4.0 - Почато оброблення вступу до першої гонки. Зроблена анімація під'їжджання автомобіля суперника

> Версія 4.1 - Фундаментальний перепис коду. Змінено розміщення багаьох змінних і додано до всіх функцій параметр "car", котрий означає авто, для якого виконуються функції. Найголовніше - стилі розсортовано по різним css файлам і js поділено на головний і другорядний.

> Версія 4.2 - Зроблено прототип функції руху авто суперника БЕЗ втручання гравця.

> Версія 4.2.1 - дороблено рух суперника, обороти його коліс і перемикання передач завдяки умовам функцій. Тепер функції руху ОФІЦІЙНО універсальні і можуть застосовуватись для різних машин водночас.

> Версія 4.2.2 - Зроблено ф-ю для обгону різними авто.

> Версія 4.2.3 - Додано знак, що показує твою дистанцію до авто суперника.

> Версія 4.3 - Дороблено функції :нахилу авто при розгоні і торможіння; показу вихлопного спалаху.

> Версія 4.4 - НЕПОВНІСТЮ ЗРОБЛЕНА МЕХАНІКА ПОВОРОТІВ, ЇХ ПОЗНАЧКИ і додано пояснення ПРО НИХ в меню паузи. Крім цього повороти підв'язані по сюжету і їм характерний дизайн повний властивостей transform.

> Версія 4.4.1 - Змінено код дизайну повороту для кращого вигляду.

> Версія 4.4.2 - зроблено рандомне визначення поворотів (їх різкість, максимальну швидкість, тривалість, дистанцію до них) і рандомну к-сть поворотів (але це є зайвим)

> Версія 4.4.3 - Чітко визначена к-сть поворотів на гонку.

> Версія 4.5 - додано пранк з музикою NEVER GONNA GIVE YOU UP - RICK ASTLEY (буде всім rickroll) ("https://ia600605.us.archive.org/8/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3"). Вже намічено плейлист музики для гри :

        1) running in the 90s - Max Coveri ("https://ia800503.us.archive.org/15/items/RunningInThe90s_201608/Running_in_the_90s.mp3")
        2) Deja vu - Dave Rodgers ("https://ia800701.us.archive.org/34/items/InitialDDejaVu_201811/Initial%20D-Deja%20Vu.mp3")
        3) Gas Gas Gas - Manuel ("https://dn720306.ca.archive.org/0/items/gas-gas-gas/Gas%20Gas%20Gas.mp3")
        4) Styles of Beyond - Nine Thou (Superstars Remix) : ("https://ia601301.us.archive.org/22/items/61-zb-4-pz-6-sf-l.-ac-uf-1000-1000-ql-80/01.%20Styles%20of%20Beyond%20-%20Nine%20Thou%20%28Superstars%20Remix%29.mp3")
        5) на фінальну гонку піде THE TOP by KEN BLAST
        Решту пісень я вже не записуватиму, бо вони і так відображатимуться в меню паузи.

}

## Версія 5.0 - 5.8 - ПОВНЕ ПЕРЕРОБЛЕННЯ {

> Версія 5.0 - Переписано код, музику запхано в один об'єкт, повороти в інший, деякі змінні ще в інший об'єкт і пофіксано баг з функцією setInterval() для розгону. Фотографії нарешті розсортовані по папкам.

> Версія 5.1 - Я ЗА 3 ДНІ ЗРОБИВ ПОТУЖНИЙ ПЕРЕПИС СТИЛІВ -ПОВНИЙ ПЕРЕХІД НА SCSS! За перший день я його підключив(як і Node.js), за 2 я про нього почитав і на 3 день ЗРОБИВ ЦЕ! Тут поки нема слова @if і нема слова :root, але аж 3 @mixin сильно запхані в код! Окремо в папці розташовуються scss модулі, а застосовуються вони імпортом через інший scss файл.

> Версія 5.2 - Нова зміна будови сайту - всі Javascript функції розділені по файлах, і на диво - БЕЗ import і export, а фотографії - посортовані і переназвані. Додано зберігання порядкового номеру музики за допомогою jquery-cookie.js . Доробив пранк і зробив нове пояснення в меню паузи.

> Версія 5.3 - Повна зміна використання автомобілів. Трішки відбулась еміграція до об'єктно-орієнтованого програмування (використання класів для утворення об'єкта авто зі своїми властивостями). Ще покращив пранк: застосовування музики в ньому; Зберігання ефекту ЧИТЕРСТВА протягом хвилини завдяки cookie. Змінив один js файл на keyboard.js, де додав модливість натиснувши Escape відкрити меню паузи, і додав до всіх js файлів зверху пояснення українською мовою про його функції. Поставив властивість "position:fixed" для іконки і меню паузи.

> Версія 5.4 - Зроблено машину противника дещо швидшою, а саме - ТАКОЮ Ж, ЯК І МОЮ. На фінальій гонці єдиним способом перемогти буде обганяти противника до поворота (бо він зарано тормозить). Поправив функцію обгону для машини суперника і змінив функцію "оголошення" повороту і фінішу (я почав робити фініш в першій гонці)

> Версія 5.4.1 - Дороблено фініш гонки - автомобіль в'їжджає наче в тунель і відкривається меню. Для цього довелось в Paint3D переробляти всі картинки дороги і самого тунелю. Поправлено торможіння в противника, щоб він не обганяв гравця в поворотах. Почато стоврення другої гонки.

> Версія 5.5 - Знову переписано код під використання import i export в .js файлах. Тепер мені навіть не доведеться вводити інкапсуляцію до властивостей класу Vehicle, бо і так всі змінні в консолі не відображаються

> Версія 5.6 - Я про це постійно думав І НАРЕШТІ ЗРОБИВ - можна поставити власне управління в меню (його дизайн використовує display:grid), яке до того ж буде зберігатись в localStorage І його можна змінювати ДИНАМІЧНО В ЛЮБУ СЕКУНДУ. Ще можна використовувати навіть кнопку "Space", хоч її назва в коді = " " (просто пробіл).

> Версія 5.7 - Зміна коду поворотів (фундамент для наступних гонок). Мені недавно сказав мій однокласник-тестувальник: "ЗАЙМИСЬ ОПТИМІЗАЦІЄЮ", і тому я тепер зводжу до мінімуму к-сть функцій setInterval() з setTimeout() (Розгін мій і мого противника, торможіння моє і мого противника - все в один setInterval; рух дороги і обгони противника - інший setInterval), дописав до більшості фотографій атрибут loading="lazy" і зменшив частоту повторювання головного інтервалу з 30 мілісекунд до 60 мілісекунд. І я нарешті доробив функцію gameOver i кнопку для повернення в меню.

}

## Версія 6.0 - 6.1 - МАКСИМАЛЬНА СПІШКА (дедлайн розробки перенесли на 1 місяць вперед - на 2 червня) {

> Версія 6.0 (25.05.2024) - Змінив код сюжету: зроблені класи як в машин і всі сюжети засунуті в один файл. Код читається ще краще, ніж за окремих файлів. Написана друга гонка.

> Версія 6.1 (26.05.2024) - Поправлена кнопка збереження прогресу, дещо замінено музику, Додано збереження музики , що відкриввається по ходу гри і її показ в поясненнях у меню паузи, покращена функція для читів, дуже поправлена друга гонка, почато створення фінальної гонки.

> Версія 6.2 (27.05.2024) - Написані ТИТРИ в кінці гри

> Версія 6.3 (28.05.2024) - Дописано: ТИТРИ; можливість зі мною сконтактуватись, використовуючи Formspree; можливість скинути весь прогрес. Саме основне в гонці - ГОТОВЕ!!!

> Версія 6.4 (29.05.2024) - Переписана функція по слуханню музики до і після перезагрузки сайту на рандомну; покращена фунція перемикання передач (навіть швидке перемикання передач вгору і вниз машині не страшне), пофіксив позицію машини противника повороті; Змінено js в contact.html; додано AOS;

> Версія 6.5 (30.05.2024) - Трохи дописав десь код (доробив) і титри тепер самі гортаються вниз.

> Версія 6.6 (31.05.2024) - Я навчився використовувати Github сам і у VS CODE, тому тепер моя гонка знаходиться там

> Версія 6.7 (01.06.2024) - Я додав багато нової музики до гри і трохи пофіксив решту функцій, функції тепер можуть працювати на любій мові на клавіатурі (двигун - кнопка "а", а працює і при "f")

}

## Версія 7.0 - 7.. - робота до нового дедлайну (29.06.2024) {

> Версія 7.0 (01.06.2024) - змінив дизайн контактування і від'єднав титри від основного файлу

> Версія 7.1 - Адаптивність просто перевернута з голови на ноги (в хорошому сенсі), до того ж - БЕЗ ЖОДНОГО ВИКОРИСТАННЯ СЛОВА @media (корінь хитрості - .scss), а саме за допомоги такого коду:

```
@function setSizeWithMath($content, $container: 1920, $value: 100vw) {
  @return math.div($content, $container) * $value;
}
```

> Версія 7.2 (06.06.2024) - Довелось через багато пройти перед тим, як зрозуміти, що при використанні телефона можна просто запихати в html новий тег link зі стилями для телефону...

> Версія 7.3 (08.06.2024) - Повороти повністю виправлені для адаптивності (за допомогою косинуса) і змінено дизайн (нарешті) спідометра

> Версія 7.4 (12.06.2024) - Я доробив дизайн і роботу управління для телефонів, перерозташував другорядні функції, дописав підказки у вступі для телефонів, переробив запис функцій в об'єктах з такого (a:()=>{},) в такий (a(){},), змінив при вході вікно запитання, де до вибору є 3 види управління

> Версія 7.5 (14.06.2024) - Повністю перероблене перше вікно з запитом про девайс та покращене переключання між подібними вікнами, для телефонів створена кнопка для входу і виходу з повноекранного режиму

> Версія 7.6 (15.06.2024) - Виправлено помилки з тунелем і поворотами

> Версія 7.7(24.06.2024) - Гра тепер накодована на TYPESCRIPT

> Версія 7.8 (28.06.2024) - Зменшені розміри файлів .css і 2 .html.

}
