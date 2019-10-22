'use strict';

module.exports = {
    prefix: "SW",
    alias: 'see-world',
    logo: '/images/see-world/logo.png',
    image: '/images/see-world/background.png',
    name: {
        en: 'Seaworld California',
        ru: 'Морской мир Калифорния'
    },
    location: {
        en: 'San Diego, CA',
        ru: 'San Diego, Калифорния'
    },
    description: {
        en: 'SeaWorld San Diego is an animal theme park, oceanarium, outside aquarium and marine mammal park, in San Diego, California, United States, inside Mission Bay Park. SeaWorld San Diego is a member of the Association of Zoos and Aquariums.',
        ru: 'SeaWorld San Diego - это тематический парк для животных, океанариум, открытый аквариум и парк морских млекопитающих в Сан-Диего, штат Калифорния, США, в парке Mission Bay. SeaWorld San Diego является членом Ассоциации зоопарков и аквариумов.'
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
                en: '2 theme parks in 1 ticket',
                ru: '2 тематических парка в 1 билете',
            },
            icon: '/images/icons/themepark.svg'
        }
    ],
    images: [
        '/images/see-world/image1.png',
        '/images/see-world/image2.png',
        '/images/see-world/image3.png'
    ],
    daysSelection: false,
    included: [],
    departure: {
        point: {
            en: 'SeaWorld San Diego',
            ru: 'SeaWorld Сан-Диего',
        },
        time: {
            en: 'Hours of operation vary, please check before you go.',
            ru: 'Часы работы варьируются, пожалуйста, проверьте, прежде чем идти.'
        },
        note: {
            en: 'Please note: Tickets are only valid on the selected date of travel.',
            ru: 'Обратите внимание: билеты действительны только на выбранную дату поездки.'
        }
    },
    additional: {
        en:'<ul>' +
        '<li>Confirmation will be received within 48 hours of booking, subject to availability</li>' +
        '<li>Minimum age is 5 years</li>' +
        '<li>In order to maintain the safety of guests, modified operating procedures have been put in place. Guests visiting the park will have their bags inspected by staff. Large bags and coolers will not be permitted in the park. Outside food is not permitted inside the park with the exception of bottle water, fruit and baby food.</li>' +
        '</ul>',
        ru: '<ul>' +
        '<li>Подтверждение будет получено в течение 48 часов после бронирования, при условии наличия</li>' +
        '<li>Минимальный возраст 5 лет</li>' +
        '<li>Для обеспечения безопасности гостей были введены модифицированные рабочие процедуры. Гости, посещающие парк, будут проверять свои сумки сотрудниками. Большие сумки и кулеры не будут разрешены в парке. В парке запрещается принимать пищу на улице, за исключением бутылочной воды, фруктов и детского питания.</li>' +
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