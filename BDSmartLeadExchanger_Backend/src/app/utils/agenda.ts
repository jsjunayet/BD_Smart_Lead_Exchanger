// src/agenda/agenda.ts
import Agenda from 'agenda';

export const agenda = new Agenda({
  db: {
    address: process.env.DATABASE_URL!,
    collection: 'jobSchedules',
  },
  processEvery: '30 seconds', // schedule check interval
});

// Worker start
export async function startAgenda() {
  await agenda.start();
}
