import { useState, useRef } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function DataUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [message, setMessage] = useState('');
  const fileRef = useRef();
  const { user } = useAuth();

  async function handleUpload() {
    if (!file) return;
    setMessage('');
    try {
      const data = await api.upload('/upload', file);
      setResult(data);
      setMessage(`Uploaded ${data.filename} - ${data.sheets.length} sheet(s) detected`);
    } catch (err) {
      setMessage('Upload failed: ' + err.message);
    }
  }

  async function handleImport() {
    if (!result) return;
    setImporting(true);
    setMessage('');
    try {
      const data = await api.post('/upload/import', {
        filename: result.filename,
        period
      });
      setMessage(data.message);
    } catch (err) {
      setMessage('Import failed: ' + err.message);
    } finally {
      setImporting(false);
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div>
        <h2 className="page-title">Data Upload</h2>
        <div className="card">
          <p style={{ color: 'var(--gray-500)' }}>Admin access required to upload data.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Upload Data</h2>
      <p className="page-subtitle">Import staffing data from Excel or CSV files</p>

      <div className="card">
        <div className="upload-zone" onClick={() => fileRef.current?.click()}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p>{file ? file.name : 'Click to select file'}</p>
          <p className="hint">Supports .xlsx, .xls, .csv</p>
        </div>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
          onChange={e => { setFile(e.target.files[0]); setResult(null); }} />

        {file && !result && (
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={handleUpload}>
            Upload & Preview
          </button>
        )}
      </div>

      {result && (
        <div className="card">
          <div className="card-title">Preview: {result.filename}</div>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', margin: '8px 0' }}>
            Sheets found: {result.sheets.join(', ')}
          </p>

          {Object.entries(result.preview).map(([sheet, info]) => (
            <div key={sheet} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{sheet} ({info.rowCount} rows)</div>
              <div className="table-scroll">
                <table className="data-table" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>{info.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {info.sample.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Import Period (YYYY-MM)</label>
            <input className="form-input" type="month" value={period}
              onChange={e => setPeriod(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={handleImport} disabled={importing}>
            {importing ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      )}

      {message && (
        <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
          <p style={{ fontSize: 13 }}>{message}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="card">
        <div className="card-title">How to Import Data</div>
        <ol style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.8, paddingLeft: 20, marginTop: 8 }}>
          <li>Export your staffing data from SAP as Excel (.xlsx)</li>
          <li>Upload the file using the zone above</li>
          <li>Preview the detected sheets and data</li>
          <li>Select the reporting period and click Import</li>
          <li>Data will appear in the dashboard immediately</li>
        </ol>
        <div style={{ marginTop: 12, padding: 12, background: 'var(--gray-50)', borderRadius: 8, fontSize: 12, color: 'var(--gray-500)' }}>
          <strong>Supported formats:</strong> The system auto-detects columns matching Budget, Actual, Category, Department, KPI names, etc. For best results, use the standard HR Month-End Report template headers.
        </div>
      </div>
    </div>
  );
}
