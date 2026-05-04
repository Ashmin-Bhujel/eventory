import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function DatePicker({ field, text }: { field: any; text: string }) {
  const [date, setDate] = useState<Date | undefined>(field.state.value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          id="start-date-picker-simple"
          className="justify-start gap-2 font-normal"
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <>
              <CalendarIcon className="text-muted-foreground" />

              <span className="text-muted-foreground">{text}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => {
            setDate(value);
            field.handleChange(value);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
