import { Clock, QrCode, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LectureInfo {
  id: string;
  subject: string;
  time: string;
  attendanceCount?: number;
  totalStudents?: number;
}

interface LectureCardProps {
  lecture: LectureInfo;
  onGenerateQR: (id: string) => void;
  onViewAttendance: (id: string) => void;
}

export function LectureCard({ lecture, onGenerateQR, onViewAttendance }: LectureCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{lecture.subject}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{lecture.time}</span>
          </div>
        </div>

        {lecture.attendanceCount !== undefined && lecture.totalStudents !== undefined && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {lecture.attendanceCount}/{lecture.totalStudents}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => onGenerateQR(lecture.id)}
          className="gap-1.5"
        >
          <QrCode className="h-3.5 w-3.5" />
          Show QR
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewAttendance(lecture.id)}
        >
          View Attendance
        </Button>
      </div>
    </div>
  );
}
