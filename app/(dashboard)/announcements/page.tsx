'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  audience: string;
  author: string;
  createdAt: string;
  hasAcknowledged: boolean;
  ackCount: number;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}/acknowledge`, {
        method: 'POST',
      });
      
      setAnnouncements(announcements.map(a =>
        a.id === id ? { ...a, hasAcknowledged: true, ackCount: a.ackCount + 1 } : a
      ));
    } catch (error) {
      console.error('Failed to acknowledge:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-mulligan-warm-gray mb-2">
          Announcements
        </h1>
        <p className="text-gray-600">Stay informed with house updates</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <div className="text-center py-8 text-gray-600">
            No announcements at this time.
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {announcement.pinned && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-mulligan-orange text-white">
                        📌 Pinned
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {announcement.audience}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-mulligan-warm-gray">
                    {announcement.title}
                  </h2>
                </div>
                {announcement.hasAcknowledged && (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ Acknowledged
                  </span>
                )}
              </div>

              <p className="text-gray-700 whitespace-pre-wrap mb-4">
                {announcement.body}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  <p>Posted by {announcement.author}</p>
                  <p>{new Date(announcement.createdAt).toLocaleDateString()}</p>
                </div>

                {!announcement.hasAcknowledged && (
                  <Button
                    size="sm"
                    onClick={() => handleAcknowledge(announcement.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>

              <div className="mt-2 text-xs text-gray-500">
                {announcement.ackCount} {announcement.ackCount === 1 ? 'person has' : 'people have'} acknowledged
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
