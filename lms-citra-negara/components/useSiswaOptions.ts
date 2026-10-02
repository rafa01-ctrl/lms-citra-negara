"use client";
import { useEffect, useState } from 'react';
import type { Option } from './useOptions';

/**
 * Daftar siswa sebagai opsi select (label: "Nama (NIS)").
 * Endpoint /api/users sudah dibatasi role guru+ di sisi server.
 */
export function useSiswaOptions() {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    let batal = false;
    fetch('/api/users')
      .then(r => (r.ok ? r.json() : []))
      .then(list => {
        if (batal) return;
        const arr = (Array.isArray(list) ? list : []).filter((u: any) => u.role === 'siswa');
        setOptions(
          arr.map((u: any) => ({
            value: String(u._id),
            label: u.nis ? `${u.name} (${u.nis})` : u.name,
          }))
        );
      })
      .catch(() => { if (!batal) setOptions([]); });
    return () => { batal = true; };
  }, []);

  return options;
}
