'use client';

import { useState } from 'react';

export default function RegisterAdminButton() {
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Rayhan',
        email: 'mdrayhan0474@gmail.com',
        password: 'Rayhan@777',
        role: 'admin',
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    setLoading(false);

    if (res.ok) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }

  return (
    <button onClick={handleRegister} disabled={loading}>
      {loading ? 'Registering...' : 'Register Admin'}
    </button>
  );
}
