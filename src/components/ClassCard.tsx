import { cn } from "@/lib/utils";
import { Check, Clock } from "lucide-react";

export interface ClassInfo {
  id: string;
  subject: string;
  time: string;
  isMarked: boolean;
}

interface ClassCardProps {
  classInfo: ClassInfo;
  onMarkAttendance?: (id: string) => void;
}

export function ClassCard({ classInfo, onMarkAttendance }: ClassCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{classInfo.subject}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{classInfo.time}</span>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            classInfo.isMarked
              ? "bg-success/10 text-success"
              : "bg-secondary text-muted-foreground"
          )}
        >
          {classInfo.isMarked ? (
            <>
              <Check className="h-3 w-3" />
              Marked
            </>
          ) : (
            "Not marked"
          )}
        </div>
      </div>

      {!classInfo.isMarked && onMarkAttendance && (
        <div className="mt-4 pt-3 border-t border-border">
          <button
            onClick={() => onMarkAttendance(classInfo.id)}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Mark attendance →
          </button>
        </div>
      )}
    </div>
  );
}
