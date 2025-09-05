import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export default function DatePickerWithRange({ className, setDateRange }) {
  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(Date.now(), 5),
  });

  const [showcal, setshowcal] = useState(false);

  React.useEffect(() => {
    if (!date) {
      setDate({ from: new Date(), to: new Date() });
    } else {
      setDateRange(date);
    }
  }, [date]);

  return (
    <div className={cn(' grid gap-2 ', className)}>
      <div>
        <div
          className="border-none text-black hover:bg-transparent"
        >
          <button
            id="date"
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
            onClick={() => setshowcal(!showcal)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{'>'}{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span className="text-base font-semibold">Pick a date</span>
            )}
          </button>
        </div>
      { showcal && (<div  data-state={showcal ? 'open' : 'closed'} className={cn(
                'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                "w-auto p-0",
              )} >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={(date) => date < new Date()}
          />
        </div>)
}
      </div>
    </div>
  );
}