import { getReminders } from "@/actions/reminders";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "done":
      return <Badge variant="secondary">Completed</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "upcoming":
      return <Badge className="bg-amber-500 hover:bg-amber-600">Upcoming</Badge>;
    default:
      return <Badge variant="outline">Scheduled</Badge>;
  }
}

export default async function RemindersPage() {
  const remindersList = await getReminders();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            Stay on top of insurance renewals, PUC expiry, and scheduled services.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        {remindersList.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">No reminders set</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Set reminders for important dates so you never miss a renewal or service.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remindersList.map((reminder) => (
                <TableRow key={reminder.id}>
                  <TableCell className="font-medium">{reminder.title}</TableCell>
                  <TableCell>
                    {format(new Date(reminder.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={reminder.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {!reminder.completed && (
                      <Button variant="outline" size="sm">
                        Mark Done
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
