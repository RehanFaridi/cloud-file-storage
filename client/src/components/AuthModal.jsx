import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(email, password);
        alert('Signup successful! Agar email confirmation on hai to inbox check karein.');
      } else {
        await login(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '380px', margin: '3rem auto', padding: '2rem', background: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 1.5rem', color: '#1e293b' }}>
        {isSignUp ? 'Create an Account' : 'Sign In to CloudVault'}
      </h2>

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Email</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', marginTop: '4px' }}>
            <Mail size={16} color="#94a3b8" style={{ marginRight: '8px' }} />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', marginTop: '4px' }}>
            <Lock size={16} color="#94a3b8" style={{ marginRight: '88px', display: 'none' }} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#2563eb', color: '#ffffff', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}
        >
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '1.2rem' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
          style={{ color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}
