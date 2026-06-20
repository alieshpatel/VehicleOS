"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { getDocuments } from "@/actions/documents";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real implementation, this would be a Server Component that passes data down,
  // but to use the UploadThing client component easily alongside dynamic data updates,
  // we'll fetch on mount.
  useEffect(() => {
    async function load() {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
              // This is a simplified version. In a full implementation, you'd 
              // open a dialog here to ask which vehicle and what document type it is,
              // then call the addDocument action.
              toast.success("Upload complete!");
              // Refresh page or update state
              window.location.reload();
            }}
            onUploadError={(error: Error) => {
              toast.error(`ERROR! ${error.message}`);
            }}
            className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
          />
        </div>
      </div>

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
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
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
