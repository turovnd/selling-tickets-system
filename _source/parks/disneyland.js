'use strict';

module.exports = {
    prefix: "DL",
    alias: 'disneyland',
    logo: '/images/disneyland/logo.png',
    image: '/images/disneyland/background.png',
    name: {
        en: 'Disneyland Park',
        ru: 'Диснейленд Парк'
    },
    location: {
        en: 'Anaheim, CA',
        ru: 'Анахайм, Калифорния'
    },
    description: {
        en: 'Disneyland Park, originally Disneyland, is the first of two theme parks built at the Disneyland Resort in Anaheim, California, opened on July 17, 1955. It is the only theme park designed and built to completion under the direct supervision of Walt Disney.',
        ru: 'Диснейленд Парк, первоначально Диснейленд, является первым из двух тематических парков, построенных на курорте Диснейленд в Анахайме, штат Калифорния, который был открыт 17 июля 1955 года. Это единственный тематический парк, спроектированный и построенный до конца под непосредственным руководством Уолта Диснея.'
    },
    features: [
        {
            name: {
                en: 'Dining options available',
                ru: 'Обеденные варианты доступны'
            },
            icon: '/images/icons/dining.svg'
        },
        {
            name: {
                en: 'FastPass (MaxPass)',
                ru: 'FastPass (MaxPass)'
            },
            icon: '/images/icons/fastpass.svg'
        },
        {
            name: {
                en: '2 theme parks in 1 ticket',
                ru: '2 тематических парка в 1 билете'
            },
            icon: '/images/icons/themepark.svg'
        }
    ],
    images: [
        '/images/disneyland/image1.png',
        '/images/disneyland/image2.png',
        '/images/disneyland/image3.png'
    ],
    daysSelection: true,
    included: [
        {
            title: null,
            list: [
                {
                    isInclude: true,
                    text: {
                        en: 'Entrance to Disneyland® Park and/or entrance to Disney California Adventure® Park depending on option booked',
                        ru: 'Вход в Disneyland® парк и/или вход в Disney California Adventure® парк в зависимости от забронированного варианта'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'One (1) Magic Morning admission on 3, 4 or 5 days tickets',
                        ru: 'Один (1) вход Magic Morning на билеты на 3, 4 или 5 дней'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Hotel pickup and drop-off',
                        ru: 'Маршрут от отеля и обратно'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Souvenir photos (available to purchase)',
                        ru: 'Сувенирные фото (доступны для покупки)'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Parking',
                        ru: 'Парковка'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Food and drinks',
                        ru: 'Еда и напитки'
                    }
                }
            ]
        }
    ],
    departure: {
        point: {
            en: 'Disneyland Resort',
            ru: 'Диснейленд Курорт'
        },
        time: {
            en: 'Hours vary by season',
            ru: 'Часы меняются в зависимости от сезона'
        },
        note: {
            en: 'Please note: Tickets are only valid on the selected date of travel.',
            ru: 'Обратите внимание: билеты действительны только на выбранную дату поездки.'
        }

    },
    additional: {
        en: '<ul>' +
        '<li>Confirmation will be received within 48 hours of booking, subject to availability</li>' +
        '<li>Multi-day 1-Park Per Day eTickets are valid for entrance into either Disneyland® Park or Disney California Adventure® Park each day over a specified number of days. Park-per-Day tickets are not valid for visits to both theme parks on the same day.</li>' +
        '<li>Multi-day Park Hopper® eTickets are valid for entrance into both Disneyland® Park or Disney California Adventure® Park each day over a specified number of days.</li>' +
        '<li>Vouchers must be redeemed on the selected date of travel</li>' +
        '<li>eTickets expire 13 days after first use or January 12, 2021, whichever occurs first</li>' +
        '<li>FASTPASS® is subject to availability</li>' +
        '<li>Disneyland® Resort eTickets of three days and above include one Magic Morning admission for early entry into a designated Theme Park</li>' +
        '<li>Wheelchair accessible</li>' +
        '<li>Stroller accessible</li>' +
        '<li>Service animals allowed</li>' +
        '<li>Near public transportation:</li>' +
        '<ul>' +
        '<li>Infants must sit on laps</li>' +
        '<li>Transportation is wheelchair accessible</li>' +
        '<li>Surfaces are wheelchair accessible</li>' +
        '<li>Most travelers can participate</li>' +
        '</ul>' +
        '</ul>',
        ru: '<ul>' +
        '<li>Подтверждение будет получено в течение 48 часов после бронирования, при условии наличия</li>' +
        '<li>Многодневные электронные билеты с 1 парком в день действительны для входа в парк Disneyland® или Disney California Adventure® каждый день в течение определенного количества дней. Билеты Park-per-Day не действительны для посещения обоих тематических парков в один и тот же день..</li>' +
        '<li>Многодневные электронные билеты Hopper® парк действительны для входа в Disneyland® парк или Disney California Adventure® парк каждый ден.</li>' +
        '<li>Ваучеры должны быть использованы в выбранную дату поездки</li>' +
        '<li>Срок действия электронных билетов истекает через 13 дней после первого использования или 12 января 2021 года, в зависимости от того, что произойдет раньше</li>' +
        '<li>FASTPASS® зависит от наличия</li>' +
        '<li>Электронный билеты Disneyland® Курорт от трех дней и выше включает одно входное сообщение Magic Morning для раннего входа в тематический парк</li>' +
        '<li>Доступно для инвалидов</li>' +
        '<li>Доступна коляска</li>' +
        '<li>Допускаются служебные животные</li>' +
        '<li>Рядом с общественным транспортом:</li>' +
        '<ul>' +
        '<li>Младенцы должны сидеть на коленях</li>' +
        '<li>Транспорт доступен для инвалидов</li>' +
        '<li>Поверхности доступны для инвалидных колясок</li>' +
        '<li>Большинство путешественников могут участвовать</li>' +
        '</ul>' +
        '</ul>'
    },
    cancellation: {
        en: '<p>For cancellations made 30 days or more prior to Guest arrival, amounts paid (minus cancellation fees assessed by third party hotels or other suppliers, non-refundable air transportation, non-refundable travel protection plan costs, and other amounts owed) will be refunded.</p>' +
        '<p>For cancellations made 2 days to 29 days prior to Guest arrival, amounts paid (minus a cancellation fee of $200 per package and minus any cancellation fees assessed by third party hotels or other suppliers, non-refundable air transportation, non-refundable travel protection plan costs, and other amounts owed) will be refunded.</p>' +
        '<p>For cancellations made 1 day or less prior to Guest arrival or for no-shows, the full price of the package is non-refundable.</p>' +
        '<p>Guest will be responsible for any cancellation fees assessed by an airline. In the case of a non-refundable airline ticket, the cancellation fee is equal to the entire ticket price. Cancellation of a refundable airline ticket must be made at least 24 hours prior to the scheduled airline departure time. No refunds for airline tickets will be made after travel has commenced or if a flight is missed/delayed.</p>',
        ru: '<p>За отмены, сделанные за 30 или более дней до прибытия Гостя, выплачиваются суммы (за вычетом сборов за отмену, начисленных сторонними отелями или другими поставщиками, невозвратными воздушными перевозками, невозмещаемыми расходами по плану защиты путешествий и другими причитающимися суммами) будет возвращен.</p>' +
        '<p>За отмены, сделанные за 2 дня до 29 дней до прибытия Гостя, выплачиваются суммы (минус плата за отмену в размере 200 долларов США за пакет и за вычетом любых сборов за отмену бронирования, начисленных сторонними отелями или другими поставщиками, невозвратные авиаперевозки, возмещаемые расходы по плану защиты путешествий и другие причитающиеся суммы) будут возвращены.</p>' +
        '<p>В случае отмены бронирования за 1 день или менее до прибытия Гостя или в случае незаезда полная стоимость пакета не возвращается.</p>' +
        '<p>Гость будет нести ответственность за любые сборы за отмену, начисленные авиакомпанией. В случае невозвратного авиабилета, плата за отмену равна всей стоимости билета. Отмена подлежащего возврату авиабилета должна быть произведена как минимум за 24 часа до запланированного времени вылета авиакомпании. Возмещение за авиабилеты не будет произведено после начала путешествия или если рейс пропущен / задержан.</p> '
    }
};