import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import { fetchMySubmissions } from '../../api/submissions';

/* ── Dot colour per review status using existing CSS tokens ── */
const STATUS_META = {
  Approved: {
    dotColor:  '#10B981',
    badgeClass: 'status-badge-Approved',
    label: 'Approved',
  },
  Rejected: {
    dotColor:  '#EF4444',
    badgeClass: 'status-badge-Rejected',
    label: 'Rejected',
  },
  Pending: {
    dotColor:  'rgba(255,255,255,0.25)',
    badgeClass: 'status-badge-Submitted',
    label: 'Pending',
  },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const SubmissionHistoryPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    fetchMySubmissions()
      .then(({ data }) => setSubmissions(data))
      .catch(() => setError('Failed to load submission history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen" style={{ background: '#050505' }}>
      <TalentSidebar />

      <main className="ml-[220px] flex-1 px-8 py-8" style={{ maxWidth: 'calc(100vw - 220px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1
            className="text-[22px] font-semibold tracking-tight"
            style={{ color: '#F0F0F0', fontFamily: 'Poppins, sans-serif' }}
          >
            Submission History
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
            A timeline of all your past task submissions.
          </p>
        </div>

        {/* States */}
        {loading && (
          <p className="text-[13px]" style={{ color: '#6B7280' }}>Loading…</p>
        )}

        {error && (
          <p
            className="text-[13px] px-4 py-3 rounded-lg"
            style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </p>
        )}

        {!loading && !error && submissions.length === 0 && (
          <p className="text-[13px]" style={{ color: '#6B7280' }}>
            No submissions yet. Complete a task to see your history here.
          </p>
        )}

        {/* Timeline */}
        {!loading && !error && submissions.length > 0 && (
          <section className="page-section relative">
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: 0,
                bottom: 0,
                width: '2px',
                background: 'rgba(255,255,255,0.07)',
              }}
            />

            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {submissions.map((sub, idx) => {
                const meta   = STATUS_META[sub.reviewStatus] ?? STATUS_META.Pending;
                const isLast = idx === submissions.length - 1;

                return (
                  <li
                    key={sub._id}
                    className="table-row-animate"
                    style={{
                      position: 'relative',
                      paddingLeft: '36px',
                      paddingBottom: isLast ? 0 : '24px',
                      animationDelay: `${Math.min(idx * 0.06, 0.3)}s`,
                    }}
                  >
                    {/* Status dot */}
                    <span
                      style={{
                        position: 'absolute',
                        left: '6px',
                        top: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: meta.dotColor,
                        border: '2px solid #050505',
                        flexShrink: 0,
                      }}
                    />

                    {/* Card */}
                    <div className="task-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>

                      {/* Top row: task title + badge */}
                      <div className="flex items-center gap-3 w-full justify-between">
                        <p
                          className="text-[14px] font-medium truncate"
                          style={{ color: '#E5E2E1', fontFamily: 'Inter, sans-serif', maxWidth: '70%' }}
                        >
                          {sub.taskId?.title ?? 'Task removed'}
                        </p>

                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${meta.badgeClass}`}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {meta.label}
                        </span>
                      </div>

                      {/* Submission notes */}
                      {sub.notes && (
                        <p className="text-[12.5px]" style={{ color: '#6B7280', lineHeight: '1.5' }}>
                          {sub.notes}
                        </p>
                      )}

                      {/* Date + Time */}
                      <p className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Submitted on {formatDate(sub.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
};

export default SubmissionHistoryPage;
