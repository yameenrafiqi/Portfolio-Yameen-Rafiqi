'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface BookingCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingCalendar = ({ isOpen, onClose }: BookingCalendarProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[900px] h-[700px] p-0 border-none shadow-2xl bg-white rounded-xl overflow-hidden transition-all duration-300 ease-in-out"
      >
        
        {/* Close Button (top-right corner) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        {/* Embedded Calendar */}
        <iframe
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ09SA_X-AMdicOvtP7ASAvdzA7YqXXITde13j8_KkEZlv4nIgoh_lfKzZ84GutR_N8pxshCG3Ya?gv=true"
          style={{
            border: "none",
            width: "100%",
            height: "100%",
          }}
          allowFullScreen
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingCalendar;