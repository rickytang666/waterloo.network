'use client';

import React, { useState, useEffect } from 'react';

interface EmbedcheckFailure {
  id: string;
  name: string;
  reason: string;
  url: string;
}

export default function EmbedcheckTable() {
  const [failures, setFailures] = useState<EmbedcheckFailure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/embedcheck')
      .then((res) => res.json())
      .then((data) => {
        setFailures(data.failures || []);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="embedcheck-section">
        <p className="embedcheck-description">checking member sites...</p>
      </div>
    );
  }

  if (failures.length === 0) {
    return (
      <div className="embedcheck-section">
        <p className="embedcheck-description">
          all members have the webring embedded on their sites.
        </p>
      </div>
    );
  }

  return (
    <div className="embedcheck-section">
      <p className="embedcheck-description">
        the following users do not have an embed or link to the webring on
        their website. they will not appear on other members&apos; webring
        widgets or the random button.
      </p>
      <div className="embedcheck-table-container">
        <table className="embedcheck-table">
          <thead>
            <tr>
              <th>name</th>
              <th>failure reason</th>
              <th>url</th>
            </tr>
          </thead>
          <tbody>
            {failures.map((failure) => (
              <tr key={failure.id}>
                <td>
                  <a
                    href={failure.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="embedcheck-link"
                  >
                    {failure.name}
                  </a>
                </td>
                <td>{failure.reason}</td>
                <td>
                  <a
                    href={failure.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="embedcheck-link"
                  >
                    {failure.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
