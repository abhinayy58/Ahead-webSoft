import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminForm, fetchSubmissions } from "../api/forms";
import { AppShell } from "../components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function SubmissionsPage() {
  const { id } = useParams();
  const [page, setPage] = useState(1);

  const { data: form } = useQuery({
    queryKey: ["admin", "forms", id],
    queryFn: () => fetchAdminForm(id),
    enabled: Boolean(id),
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin", "forms", id, "submissions", page],
    queryFn: () => fetchSubmissions(id, page, 10),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <AppShell>
        <p className="text-sm text-slate-500">No form selected.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Submissions for {form?.title ?? "…"}</CardTitle>
          <p className="text-sm text-slate-500">
            Showing the most recent responses with pagination.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-slate-500">Loading submissions…</p>}
          {!isLoading && submissions && submissions.items.length === 0 && (
            <p className="text-sm text-slate-500">No submissions yet.</p>
          )}
          {!isLoading && submissions && submissions.items.length > 0 && (
            <div className="space-y-3">
              {submissions.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      Submission #{item.id.slice(-6)}
                    </p>
                    <p className="text-slate-500">
                      {new Date(item.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950/90 p-3 text-xs text-slate-100">
                    {JSON.stringify(item.answers, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {submissions && submissions.total > submissions.pageSize && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <p className="text-sm text-slate-500">
                Page {page} of {Math.ceil(submissions.total / submissions.pageSize)}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((current) =>
                    current >= Math.ceil(submissions.total / submissions.pageSize)
                      ? current
                      : current + 1
                  )
                }
                disabled={
                  page >= Math.ceil(submissions.total / submissions.pageSize)
                }
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}

