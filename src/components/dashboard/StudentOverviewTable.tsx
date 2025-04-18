
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ActivityDropdown from "./ActivityDropdown";

interface StudentData {
  id: string;
  name: string;
  weeklyAverageMood: string;
  completedActivities: string[];
  sharedResponses: number;
}

interface StudentOverviewTableProps {
  students: StudentData[];
  activities: string[];
}

const StudentOverviewTable = ({ students, activities }: StudentOverviewTableProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">Student Overview</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Student Name</TableHead>
              <TableHead className="w-[200px]">Weekly Average Mood</TableHead>
              <TableHead className="w-[200px]">Activities</TableHead>
              <TableHead className="w-[200px] text-center">Shared Responses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{getMoodEmoji(student.weeklyAverageMood)}</span>
                    <span>{student.weeklyAverageMood}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ActivityDropdown 
                    activities={activities}
                    completedActivities={student.completedActivities}
                  />
                </TableCell>
                <TableCell className="text-center">{student.sharedResponses}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const getMoodEmoji = (mood: string) => {
  switch(mood.toLowerCase()) {
    case 'happy': return '😊';
    case 'excited': return '😄';
    case 'calm': return '😌';
    case 'sad': return '😔';
    case 'angry': return '😡';
    case 'anxious': return '😰';
    case 'overwhelmed': return '😫';
    default: return '😐';
  }
};

export default StudentOverviewTable;
