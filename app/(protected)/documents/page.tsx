"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { getDocuments, addDocument, deleteDocument } from "@/actions/documents";
import { getVehicles } from "@/actions/vehicles";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [pendingFile, setPendingFile] = useState<{ url: string; name: string } | null>(null);
  const [vehicleId, setVehicleId] = useState("");
  const [documentType, setDocumentType] = useState<"RC" | "Insurance" | "PUC" | "ServiceBill">("RC");
  const [isSaving, setIsSaving] = useState(false);

  // In a real implementation, this would be a Server Component that passes data down,
  // but to use the UploadThing client component easily alongside dynamic data updates,
  // we'll fetch on mount.
  async function load() {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
      const v = await getVehicles();
      setVehicles(v);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSaveDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingFile || !vehicleId || !documentType) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSaving(true);
    try {
      await addDocument({
        vehicleId,
        fileUrl: pendingFile.url,
        fileName: pendingFile.name,
        documentType
      });
      toast.success("Document saved successfully!");
      setPendingFile(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save document");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      toast.success("Document deleted");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete document");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Store and manage your vehicle documents securely.
          </p>
        </div>
        <div className="bg-primary/5 rounded-md p-1 border">
          <UploadButton
            endpoint="documentUploader"
            onClientUploadComplete={(res) => {
              if (res && res.length > 0) {
                setPendingFile({ url: res[0].url, name: res[0].name });
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
            className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
          />
        </div>
      </div>

      <Dialog open={!!pendingFile} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorize Document</DialogTitle>
            <DialogDescription>
              File uploaded! Please select which vehicle and document type this belongs to.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveDocument} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Selected File</Label>
              <div className="p-2 border rounded bg-muted text-sm truncate">
                {pendingFile?.name}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.vehicleNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={documentType} onValueChange={(v: any) => setDocumentType(v)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RC">RC Book</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="PUC">PUC</SelectItem>
                  <SelectItem value="ServiceBill">Service Bill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Document
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground animate-pulse">Loading documents...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold">No documents uploaded</h2>
          <p className="text-sm text-muted-foreground max-w-sm mt-2">
            Upload registration certificates, insurance policies, PUC, or service bills.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate" title={doc.fileName}>
                    {doc.fileName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] px-1 py-0 font-normal">
                      {doc.documentType}
                    </Badge>
                    <span>{format(new Date(doc.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
