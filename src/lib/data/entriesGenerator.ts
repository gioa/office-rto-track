
import { Entry } from '../types';
import { currentUser } from './currentUser';

// Function to generate random entries for the last 3 months
export const generateMockEntries = (): Entry[] => {
  const entries: Entry[] = [];
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  // Loop through each day in the date range
  for (let d = new Date(threeMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    if (isWeekend) continue; // Skip weekends

    const dayOfWeek = d.getDay();
    const random = Math.random();

    // Create office visits - higher probability on Tues, Wed, Thurs
    if ((dayOfWeek >= 2 && dayOfWeek <= 4 && random > 0.2) || (random > 0.7)) {
      entries.push({
        id: `office-${d.toISOString()}`,
        date: new Date(d),
        type: 'office-visit',
        userId: currentUser.id,
      });
    } 
    // Occasionally add sick days
    else if (random < 0.05) {
      entries.push({
        id: `sick-${d.toISOString()}`,
        date: new Date(d),
        type: 'sick',
        note: 'Not feeling well',
        userId: currentUser.id,
      });
    } 
    // Occasionally add PTO
    else if (random >= 0.05 && random < 0.1) {
      entries.push({
        id: `pto-${d.toISOString()}`,
        date: new Date(d),
        type: 'pto',
        note: 'Personal time off',
        userId: currentUser.id,
      });
    }
  }

  // Add some company events
  const eventDates = [
    new Date(today.getFullYear(), today.getMonth() - 2, 15),
    new Date(today.getFullYear(), today.getMonth() - 1, 5),
    new Date(today.getFullYear(), today.getMonth(), 10),
  ];

  eventDates.forEach((date, index) => {
    if (date.getDay() !== 0 && date.getDay() !== 6) { // Not on weekends
      entries.push({
        id: `event-${index}`,
        date,
        type: 'event',
        note: 'Company All-Hands Meeting',
        userId: 'company',
      });
    }
  });

  // Add some holidays
  const holidays = [
    { date: new Date(today.getFullYear(), 0, 1), name: 'New Year\'s Day' },
    { date: new Date(today.getFullYear(), 4, 29), name: 'Memorial Day' },
    { date: new Date(today.getFullYear(), 6, 4), name: 'Independence Day' },
    { date: new Date(today.getFullYear(), 8, 5), name: 'Labor Day' },
    { date: new Date(today.getFullYear(), 10, 28), name: 'Thanksgiving Day' },
    { date: new Date(today.getFullYear(), 11, 25), name: 'Christmas Day' },
  ];

  holidays.forEach((holiday, index) => {
    if (holiday.date >= threeMonthsAgo && holiday.date <= today) {
      // Skip adding holidays on weekends
      const day = holiday.date.getDay();
      if (day !== 0 && day !== 6) {
        entries.push({
          id: `holiday-${index}`,
          date: holiday.date,
          type: 'holiday',
          note: holiday.name,
          userId: 'company',
        });
      }
    }
  });

  return entries;
};
