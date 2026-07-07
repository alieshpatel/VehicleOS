"use client";

import { useState, useEffect } from "react";
import { getReminders, addReminder, updateReminder } from "@/actions/reminders";
import { getVehicles } from "@/actions/vehicles";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

export default function RemindersPage() {
  const [remindersList, setRemindersList] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [vehicleId, setVehicleId] = useState("");

  async function load() {
    const list = await getReminders();
    setRemindersList(list);
  }

  useEffect(() => {
    load();
    getVehicles().then(setVehicles);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      await addReminder({
        vehicleId,
        title: formData.get("title") as string,
        dueDate: formData.get("dueDate") as string,
      });
      toast.success("Reminder added!");
      setIsOpen(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to add reminder");
    } finally {
      setIsPending(false);
    }
  }

  async function handleMarkDone(id: string) {
    try {
      await updateReminder(id, { completed: true });
      toast.success("Marked as completed!");
      load();
    } catch (err: any) {
      toast.error("Failed to update reminder");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            Stay on top of insurance renewals, PUC expiry, and scheduled services.
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reminder</DialogTitle>
              <DialogDescription>Set a reminder for services, PUC, or insurance renewals.</DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select value={vehicleId} onValueChange={setVehicleId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.brand} {v.model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required placeholder="e.g. Insurance Renewal" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input name="dueDate" type="date" required />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Reminder
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
            <Button className="mt-4" onClick={() => setIsOpen(true)}>
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
                      <Button variant="outline" size="sm" onClick={() => handleMarkDone(reminder.id)}>
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
