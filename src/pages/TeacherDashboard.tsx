import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { LectureCard, LectureInfo } from "@/components/LectureCard";
import { LectureCardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, QrCode } from "lucide-react";

// Mock data
const mockLectures: LectureInfo[] = [
  { id: "1", subject: "Data Structures & Algorithms", time: "9:00 AM - 10:30 AM", attendanceCount: 42, totalStudents: 50 },
  { id: "2", subject: "Operating Systems", time: "11:00 AM - 12:30 PM", attendanceCount: 38, totalStudents: 45 },
  { id: "3", subject: "Computer Networks", time: "2:00 PM - 3:30 PM", attendanceCount: 0, totalStudents: 48 },
];

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<LectureInfo[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<LectureInfo | null>(null);
  const [newLecture, setNewLecture] = useState({ subject: "", time: "" });

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setLectures(mockLectures);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerateQR = (id: string) => {
    const lecture = lectures.find((l) => l.id === id);
    if (lecture) {
      setSelectedLecture(lecture);
      setShowQRModal(true);
    }
  };

  const handleViewAttendance = (id: string) => {
    const lecture = lectures.find((l) => l.id === id);
    if (lecture) {
      setSelectedLecture(lecture);
      setShowAttendanceModal(true);
    }
  };

  const handleAddLecture = () => {
    if (newLecture.subject && newLecture.time) {
      const lecture: LectureInfo = {
        id: Date.now().toString(),
        subject: newLecture.subject,
        time: newLecture.time,
        attendanceCount: 0,
        totalStudents: 50,
      };
      setLectures([...lectures, lecture]);
      setNewLecture({ subject: "", time: "" });
      setShowAddModal(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalAttendance = lectures.reduce((acc, l) => acc + (l.attendanceCount || 0), 0);
  const totalStudents = lectures.reduce((acc, l) => acc + (l.totalStudents || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header userName="Dr. Sarah Miller" userRole="teacher" />

      <main className="container py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{today}</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Today's Lectures</h1>
            {!isLoading && lectures.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {lectures.length} lectures scheduled
              </p>
            )}
          </div>

          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lecture
          </Button>
        </div>

        {/* Lectures Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <LectureCardSkeleton key={i} />
            ))}
          </div>
        ) : lectures.length === 0 ? (
          <div className="rounded-lg border border-border bg-card">
            <EmptyState
              title="No lectures scheduled"
              description="You haven't scheduled any lectures for today. Add your first lecture to get started."
              action={
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lecture
                </Button>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {lectures.map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                onGenerateQR={handleGenerateQR}
                onViewAttendance={handleViewAttendance}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {!isLoading && lectures.length > 0 && (
          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-medium text-foreground mb-3">Today's Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">{lectures.length}</div>
                <div className="text-xs text-muted-foreground">Total Lectures</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-success">{totalAttendance}</div>
                <div className="text-xs text-muted-foreground">Total Present</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">{totalStudents}</div>
                <div className="text-xs text-muted-foreground">Expected Students</div>
              </div>
              <div className="text-center p-3 rounded-md bg-secondary">
                <div className="text-2xl font-semibold text-foreground">
                  {totalStudents > 0 ? Math.round((totalAttendance / totalStudents) * 100) : 0}%
                </div>
                <div className="text-xs text-muted-foreground">Avg. Attendance</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Attendance QR Code"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-foreground">{selectedLecture?.subject}</h3>
            <p className="text-sm text-muted-foreground">{selectedLecture?.time}</p>
          </div>

          {/* QR Code Placeholder */}
          <div className="aspect-square rounded-lg bg-foreground flex items-center justify-center mx-auto max-w-[200px]">
            <div className="text-center p-4">
              <QrCode className="h-24 w-24 text-background mx-auto" />
              <div className="text-xs text-background mt-2 font-mono">
                ATT-{selectedLecture?.id}-{Date.now().toString(36).toUpperCase()}
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Display this QR code to your students. The code expires in 5 minutes.
          </p>

          <Button variant="secondary" className="w-full" onClick={() => setShowQRModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Add Lecture Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Lecture"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Name</Label>
            <Input
              id="subject"
              placeholder="e.g., Data Structures"
              value={newLecture.subject}
              onChange={(e) => setNewLecture({ ...newLecture, subject: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time Slot</Label>
            <Input
              id="time"
              placeholder="e.g., 9:00 AM - 10:30 AM"
              value={newLecture.time}
              onChange={(e) => setNewLecture({ ...newLecture, time: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddLecture}>
              Add Lecture
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Attendance Modal */}
      <Modal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        title="Attendance Details"
      >
        <div className="space-y-4">
          <div className="text-center pb-4 border-b border-border">
            <h3 className="font-medium text-foreground">{selectedLecture?.subject}</h3>
            <p className="text-sm text-muted-foreground">{selectedLecture?.time}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-md bg-secondary">
              <div className="text-2xl font-semibold text-success">
                {selectedLecture?.attendanceCount}
              </div>
              <div className="text-xs text-muted-foreground">Present</div>
            </div>
            <div className="text-center p-4 rounded-md bg-secondary">
              <div className="text-2xl font-semibold text-destructive">
                {(selectedLecture?.totalStudents || 0) - (selectedLecture?.attendanceCount || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Absent</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {selectedLecture?.totalStudents && selectedLecture?.attendanceCount !== undefined
                ? Math.round((selectedLecture.attendanceCount / selectedLecture.totalStudents) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>

          <Button variant="secondary" className="w-full" onClick={() => setShowAttendanceModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
