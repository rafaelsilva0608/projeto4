/**
 * Dados da paróquia e horários de missa (edite aqui — um único lugar para o projeto).
 */
(function (global) {
  global.ParoquiaDados = {
    info: {
      name: 'Paróquia São José Operário (Vila Paiva)',
      address:
        'R. Almenara, 146 – V. Paiva – 12213-470 – São José dos Campos – SP',
      priest: 'Sérgio de Jesus Ribeiro Júnior',
      phone: '(12) 3921-8611 · (12) 3911-5042',
      email: 'sjoseoperariosjc@hotmail.com',
      /** Resumo na área logada; a lista detalhada está em Horário de Missas. */
      massHours: 'Consulte a página Horário de Missas e preencha os horários em massSchedule (abaixo).',
    },
    /** Lista em horario-missas.html — substitua os “—” pelos horários reais. */
    massSchedule: [
      {
        parish: 'Paróquia São José Operário (Vila Paiva)',
        locality: 'R. Almenara, 146 – V. Paiva',
        day: 'Domingo',
        times: ['—'],
      },
      {
        parish: 'Paróquia São José Operário (Vila Paiva)',
        locality: 'R. Almenara, 146 – V. Paiva',
        day: 'Quarta',
        times: ['—'],
      },
      {
        parish: 'Paróquia São José Operário (Vila Paiva)',
        locality: 'R. Almenara, 146 – V. Paiva',
        day: 'Sábado',
        times: ['—'],
      },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
