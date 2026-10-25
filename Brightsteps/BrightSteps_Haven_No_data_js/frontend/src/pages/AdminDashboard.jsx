
import { useEffect, useState } from 'react';
import './AdminDashboard.css';

const API = 'http://localhost:5000/api/admin';

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('brightstepsadmin');
  const [password, setPassword] = useState('');
  const [totals, setTotals] = useState({
    appointments: 0,
    enquiries: 0,
    pendingAppointments: 0,
    newEnquiries: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }

    return data;
  }

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const [summary, appointmentData, enquiryData] =
        await Promise.all([
          apiRequest('/dashboard'),
          apiRequest('/appointments'),
          apiRequest('/enquiries')
        ]);

      setTotals(summary.totals);
      setAppointments(appointmentData.appointments);
      setEnquiries(enquiryData.enquiries);
      setLoggedIn(true);
    } catch (err) {
      setError(err.message);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        await apiRequest('/me');
        if (active) await loadDashboard();
      } catch {
        if (active) setLoggedIn(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      setPassword('');
      await loadDashboard();
      setNotice('Welcome to BrightSteps Haven Admin.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    setError('');
    setNotice('');

    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });

      setAppointments(current =>
        current.map(item =>
          item._id === id ? { ...item, status } : item
        )
      );

      await loadDashboard();
      setNotice('Appointment status updated.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } finally {
      setLoggedIn(false);
      setAppointments([]);
      setEnquiries([]);
      setPassword('');
      setNotice('');
    }
  }

  if (!loggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-logo">BH</div>
          <p className="admin-eyebrow">BRIGHTSTEPS HAVEN</p>
          <h1>Admin Login</h1>
          <p className="admin-subtitle">
            Sign in to manage appointments and enquiries.
          </p>

          {error && <p className="admin-error">{error}</p>}

          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            value={username}
            onChange={event => setUsername(event.target.value)}
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />

          <button className="admin-primary-button" type="submit">
            Sign In
          </button>

          {error && (
            <button
              className="admin-secondary-button"
              type="button"
              onClick={() => setError('')}
            >
              Dismiss
            </button>
          )}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">BRIGHTSTEPS HAVEN</p>
          <h1>Admin Dashboard</h1>
        </div>

        <button className="admin-logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

      {error && <p className="admin-error">{error}</p>}
      {notice && <p className="admin-notice">{notice}</p>}

      <section className="admin-welcome">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h2>Welcome back!</h2>
          <p>Manage the care requests received by your centre.</p>
        </div>
        <span className="admin-welcome-icon">✦</span>
      </section>

      <section className="admin-stats">
        <article className="admin-stat-card">
          <span>Total Appointments</span>
          <strong>{totals.appointments}</strong>
          <small>All appointment records</small>
        </article>

        <article className="admin-stat-card">
          <span>Pending Appointments</span>
          <strong>{totals.pendingAppointments}</strong>
          <small>Awaiting action</small>
        </article>

        <article className="admin-stat-card">
          <span>Contact Enquiries</span>
          <strong>{totals.enquiries}</strong>
          <small>Messages received</small>
        </article>

        <article className="admin-stat-card">
          <span>New Enquiries</span>
          <strong>{totals.newEnquiries}</strong>
          <small>Not yet marked as contacted</small>
        </article>
      </section>

      <section className="admin-records">
        <div className="admin-records-heading">
          <div>
            <p className="admin-eyebrow">CENTRE MANAGEMENT</p>
            <h2>Manage Records</h2>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="admin-tabs">
          <button
            className={activeTab === 'appointments' ? 'active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            Appointments ({appointments.length})
          </button>

          <button
            className={activeTab === 'enquiries' ? 'active' : ''}
            onClick={() => setActiveTab('enquiries')}
          >
            Enquiries ({enquiries.length})
          </button>
        </div>

        {activeTab === 'appointments' ? (
          appointments.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Parent Name</th>
                    <th>Contact</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(item => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.parentName || '—'}</strong>
                        <small>{item.childAge || 'Age not provided'}</small>
                      </td>
                      <td>
                        {item.phone || '—'}
                        <small>{item.email || 'No email'}</small>
                      </td>
                      <td>{item.service || '—'}</td>
                      <td>{item.date || '—'}</td>
                      <td>
                        <select
                          aria-label={`Status for ${item.parentName || 'appointment'}`}
                          value={item.status || 'Pending'}
                          onChange={event =>
                            updateStatus(item._id, event.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">No appointments found.</p>
          )
        ) : enquiries.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(item => (
                  <tr key={item._id}>
                    <td>{item.name || '—'}</td>
                    <td>
                      {item.email || '—'}
                      <small>{item.phone || ''}</small>
                    </td>
                    <td>{item.subject || '—'}</td>
                    <td className="admin-message-cell">
                      {item.message || '—'}
                    </td>
                    <td>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">No contact enquiries found.</p>
        )}
      </section>

      <footer className="admin-footer">
        BrightSteps Haven · Care, support and development
      </footer>
    </main>
  );
}
