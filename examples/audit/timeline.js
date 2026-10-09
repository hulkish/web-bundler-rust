import parseISO from "date-fns/parseISO/index.js";
import format from "date-fns/format/index.js";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays/index.js";
import isWithinInterval from "date-fns/isWithinInterval/index.js";
import subDays from "date-fns/subDays/index.js";

export function selectEvents(rows, asOf, windowDays) {
  const end = parseISO(asOf);
  const start = subDays(end, windowDays);
  const picked = rows
    .map((row) => {
      const date = parseISO(row.date);
      return {
        date: row.date,
        title: row.title,
        kind: row.kind,
        when: date,
        days: differenceInCalendarDays(end, date),
      };
    })
    .filter((event) => isWithinInterval(event.when, { start, end }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    total: rows.length,
    shown: picked,
    label: format(end, "d MMM yyyy"),
  };
}
