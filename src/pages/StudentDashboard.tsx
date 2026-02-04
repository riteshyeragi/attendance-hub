import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ClassCard, ClassInfo } from "@/components/ClassCard";
import { CardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

// Mock data
const mockClasses: ClassInfo[] = [
  { id: "1", subject: "Data Structures & Algorithms", time: "9:00 AM - 10:30 AM", isMarked: true },
  { id: "2", subject: "Operating Systems", time: "11:00 AM - 12:30 PM", isMarked: false },
  { id: "3", subject: "Computer Networks", time: "2:00 PM - 3:30 PM", isMarked: false },
  { id: "4", subject: "Database Management Systems", time: "4:00 PM - 5:30 PM", isMarked: true },
];

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setClasses(mockClasses);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkAttendance = (classId: string) => {
    setSelectedClassId(classId);
    setShowQRScanner(true);
  };

  const handleConfirmAttendance = () => {
    if (selectedClassId) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === selectedClassId ? { ...c, isMarked: true } : c
        )
      );
    }
    setShowQRScanner(false);
    setSelectedClassId(null);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const markedCount = classes.filter((c) => c.isMarked).length;

  return (
    <div className="min-h-screen bg-background">
      <Header userName="Alex Johnson" userRole="student" />

      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Today's Classes</h1>
          {!isLoading && classes.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {markedCount} of {classes.length} attendance marked
            </p>
          )}
        </div>

        {/* Classes Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              title="No classes today"
              description="You don't have any scheduled classes for today. Enjoy your day off!"
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {classes.map((classInfo) => (
              <ClassCard
                key={classInfo.id}
                classInfo={classInfo}
                onMarkAttendance={handleMarkAttendance}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!isLoading && classes.length > 0 && (
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-3">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">{classes.length}</div>
                <div className="text-xs text-muted-foreground">Total Classes</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-success">{markedCount}</div>
                <div className="text-xs text-muted-foreground">Marked</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">{classes.length - markedCount}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">
                  {Math.round((markedCount / classes.length) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Attendance</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        title="Mark Attendance"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Scan the QR code displayed by your teacher to mark your attendance.
          </p>
          
          {/* Placeholder for QR scanner */}
          <div className="aspect-square rounded-lg bg-secondary border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">QR Scanner</div>
              <div className="text-xs text-muted-foreground mt-1">Camera access required</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowQRScanner(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirmAttendance}>
              Simulate Scan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
