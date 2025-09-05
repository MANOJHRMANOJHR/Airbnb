import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';

function Calendar({ className, classNames, ...props }) {
  // props is an object containing left elements and we are destructurizing it
  /*
  function Calendar(allProps) {
  const className = allProps.className;
  const classNames = allProps.classNames;
  const props = { ...allProps };     // copy
  delete props.className;
  delete props.classNames;
   props now contains the "rest"
   HERE props is an object containing the left elements
}  
  */
  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
       "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        //({ ...props }) =>
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
      required // day picker is like an input field
    />
  );
}
Calendar.displayName = 'Calendar';


/*
Every React component has a displayName property.
By default, React uses the function’s or variable’s name to label it in React DevTools, error messages, and debugging tools.
displayName lets you manually set or override that name.

Better debugging
If your component is anonymous or wrapped inside another function (e.g., higher-order components, React.memo), DevTools might show it as "Anonymous" or "Component". Setting displayName ensures you see "Calendar" instead.

export const MyComponent = React.memo(function (props) { ... });
Without displayName, DevTools might show:

But if you set:

MyComponent.displayName = 'Calendar';
you’ll see:

<Calendar>
For dynamically generated components
If a component is created in a factory function, it may not have a name, so displayName gives it one.
*/
export { Calendar };
