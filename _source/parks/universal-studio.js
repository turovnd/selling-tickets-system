'use strict';

module.exports = {
    prefix: "US",
    alias: 'universal-studio',
    logo: '/images/universal-studio/logo.png',
    image: '/images/universal-studio/background.png',
    name: {
        en: 'Universal Studios Hollywood',
        ru: 'Юниверсал Студиос Голливуд'
    },
    location: {
        en: 'Los Angeles, CA',
        ru: 'Лос Анджелес, Калифорния'
    },
    description: {
        en: 'Universal Studios Hollywood is a film studio and theme park in the San Fernando Valley area of Los Angeles County, California. About 70% of the studio lies within the unincorporated county island known as Universal City while the rest lies within the city limits of Los Angeles, California.',
        ru: 'Юниверсал Студиос Голливуд - киностудия и тематический парк в районе долины Сан-Фернандо округа Лос-Анджелес, штат Калифорния. Около 70% студии находится на некорпоративном уездном острове, известном как Universal City, в то время как остальные находятся в черте города Лос-Анджелес, Калифорния.'
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
                en: 'VIP Experience',
                ru: 'VIP опция'
            },
            icon: '/images/icons/vip.svg'
        }
    ],
    images: [
        '/images/universal-studio/image1.png',
        '/images/universal-studio/image2.png',
        '/images/universal-studio/image3.png'
    ],
    daysSelection: false,
    included: [
        {
            title: {
                en: 'Tickets without VIP Experience Tickets',
                ru: 'Билеты без VIP опции'
            },
            list: [
                {
                    isInclude: true,
                    text: {
                        en: 'Entry to all rides and attractions',
                        ru: 'Вход на все аттракционы и аттракционы'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'Express ticket (based on option selected)',
                        ru: 'Экспресс-билет (в зависимости от выбранной опции)'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'Admission to Universal Studios Hollywood (number of days based on option selected)',
                        ru: 'Прием в Universal Studios Hollywood (количество дней в зависимости от выбранной опции)'
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
                        en: 'Food and drinks (available for purchase)',
                        ru: 'Еда и напитки (доступны для покупки)',
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Sideshow games',
                        ru: 'Игры с шоу'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Express ticket (unless option selected)',
                        ru: 'Экспресс-билет (если не выбран вариант)'
                    }
                },
                {
                    isInclude: false,
                    text:{
                        en: 'Movie tickets for Universal CityWalk Cinemas',
                        ru: 'Билеты в кино в кинотеатрах Universal CityWalk'
                    }
                }
            ]
        },
        {
            title: {
                en: 'VIP Experience Tickets',
                ru: 'VIP Билеты'
            },
            list: [
                {
                    isInclude: true,
                    text: {
                        en: 'Valet parking',
                        ru: 'Парковка с обслуживающим персоналом'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'Admission Ticket',
                        ru: 'Входной билет'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'VIP Tour',
                        ru: 'VIP Тур'
                    }
                },
                {
                    isInclude: true,
                    text: {
                        en: 'Gourmet catered lunch',
                        ru: 'Обед для гурманов'
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
                        en: 'Sideshow games',
                        ru: 'Игры с шоу'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Beverages',
                        ru: 'Напитки'
                    }
                },
                {
                    isInclude: false,
                    text: {
                        en: 'Movie tickets for Universal CityWalk Cinemas',
                        ru: 'Билеты в кино в кинотеатрах Universal CityWalk'
                    }
                }
            ]
        }
    ],
    departure: {
        point: {
            en: 'You must exchange your voucher at the VIP Window of Universal Studios Hollywood, located next to the Guest Services Window at the right side of the entrance to the park.',
            ru: 'Вы должны обменять свой ваучер в VIP-окне Universal Studios Hollywood, расположенном рядом с окном для обслуживания гостей с правой стороны от входа в парк..'
        },
        time: {
            en: 'Park hours vary based on the season. It is advised that you call and reconfirm directly with Universal Studios Hollywood prior to your date of travel. Departure times will be advised upon reconfirmation. Please follow the directions listed on your pre-paid voucher which will be received after booking.',
            ru: 'Время парковки зависит от сезона. Рекомендуется позвонить и подтвердить непосредственно в Universal Studios Hollywood до даты вашего путешествия. Время отправления будет сообщено при повторном подтверждении. Пожалуйста, следуйте инструкциям, указанным в предоплаченном ваучере, который будет получен после бронирования.'
        },
        note: {
            en: 'Please note: Tickets are only valid on the selected date of travel.',
            ru: 'Обратите внимание: билеты действительны только на выбранную дату поездки.'
        }
    },
    additional:{
        en: '<ul>' +
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
