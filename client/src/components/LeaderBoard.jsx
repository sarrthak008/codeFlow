import React, { useEffect, useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const DBURL = import.meta.env.VITE_BACKEND_URL;

const FILLS = ['#378ADD', '#639922', '#993C1D', '#0F6E56', '#534AB7', '#BA7517', '#993556'];
const MEDALS = ['#d4a017', '#9e9e9e', '#bf7f3e'];

function ini(n) { return n.split(/[-_\s]/).map(w => w[0]?.toUpperCase()).join('').slice(0, 2); }
function cap(n) { return n.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }


function Avatar({ name, size = 36, index = 0 }) {
  return (
    <div className='rounded-full flex items-center justify-center text-white font-medium flex-shrink-0'
      style={{ width: size, height: size, background: FILLS[index % FILLS.length], fontSize: size * 0.3 }}>
      {ini(name)}
    </div>
  );
}

function PodiumBlock({ user, rank }) {
  const heights = { 1: 110, 2: 85, 3: 70 };
  const sizes   = { 1: 56,  2: 48,  3: 44 };
  const color   = MEDALS[rank - 1];
  return (
    <div className='flex flex-col items-center gap-2 flex-1 max-w-[140px]'>
      <div className='relative'>
        {rank === 1 && <span className='absolute -top-5 left-1/2 -translate-x-1/2 text-base'>👑</span>}
        <Avatar name={user.name} size={sizes[rank]} index={rank - 1} />
      </div>
      <p className='text-xs font-medium text-center truncate w-full' style={{ color: '#111' }}>{cap(user.name)}</p>
      <p className='text-[11px]' style={{ color: '#888' }}>{user.totalMarks} pts</p>
      <p className='text-[10px]' style={{ color: '#888' }}>{user.totalSolved} solved</p>
      <div className='w-full rounded-t-lg flex items-center justify-center'
        style={{ height: heights[rank], background: color + '22', border: `0.5px solid ${color}44` }}>
        <span className='text-xl font-medium' style={{ color }}>{rank}</span>
      </div>
    </div>
  );
}

function ListRow({ user, rank, maxMarks }) {
  const pct = Math.round((user.totalMarks / maxMarks) * 100);
  return (
    <div className='grid items-center gap-3 px-3 py-2.5 rounded-lg'
      style={{ gridTemplateColumns: '28px 32px 1fr auto auto' }}>
      <span className='text-xs text-center font-medium' style={{ color: '#888' }}>{rank}</span>
      <Avatar name={user.name} size={32} index={rank % FILLS.length} />
      <div className='overflow-hidden'>
        <p className='text-sm font-medium truncate' style={{ color: '#111' }}>{cap(user.name)}</p>
        <p className='text-[11px]' style={{ color: '#888' }}>{user.totalSolved} solved</p>
      </div>
      <div className='w-20 h-1.5 rounded-full overflow-hidden' style={{ background: 'rgba(0,0,0,0.08)' }}>
        <div className='h-full rounded-full' style={{ width: `${pct}%`, background: '#378ADD' }} />
      </div>
      <span className='text-xs font-medium w-12 text-right' style={{ color: '#111' }}>{user.totalMarks}</span>
    </div>
  );
}

// ── Standalone snapshot-only component (no buttons, no scroll, full height) ──
function SnapshotBoard({ users }) {
  const maxMarks  = users[0]?.totalMarks || 1;
  const podOrder  = [users[1], users[0], users[2]].filter(Boolean);
  const podRanks  = users.length >= 2 ? [2, 1, 3] : [1];

  return (
    <div style={{ background: '#fff', width: 760, fontFamily: 'sans-serif', borderRadius: 16, overflow: 'hidden', border: '0.5px solid #e5e5e5' }}>
      {/* Header — no buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderBottom: '0.5px solid #e5e5e5' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏆</div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#111', margin: 0 }}>Leaderboard</p>
          <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{users.length} participants · ranked by score</p>
        </div>
      </div>

      {/* Podium */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, padding: '24px 24px 0', background: '#f9f9f9' }}>
        {podOrder.map((u, i) => u && <PodiumBlock key={u.userId} user={u} rank={podRanks[i]} />)}
      </div>

      {/* List — ALL rows, no scroll */}
      <div style={{ padding: '4px 24px 16px', background: '#fff' }}>
        {users.slice(3).map((u, i) => (
          <React.Fragment key={u.userId}>
            <ListRow user={u} rank={i + 4} maxMarks={maxMarks} />
            {i < users.slice(3).length - 1 && <div style={{ height: 0.5, background: '#e5e5e5', margin: '0 12px' }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const LeaderBoard = ({ setIsRankBoard }) => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [dlLoading, setDlLoading] = useState(false);

  useEffect(() => {
    fetch(`${DBURL}/code/rank`)
      .then(r => r.json())
      .then(j => { if (j.success) setUsers(j.data); else setError('Failed to load'); })
      .catch(() => setError('Could not connect'))
      .finally(() => setLoading(false));
  }, []);

  const downloadImage = async () => {
    setDlLoading(true);
    try {
      // 1. Create an off-screen container
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1';
      document.body.appendChild(container);

      // 2. Render the snapshot board into it via ReactDOM
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(container);
      root.render(<SnapshotBoard users={users} />);

      // 3. Wait a tick for paint
      await new Promise(r => setTimeout(r, 200));

      // 4. Capture
      const dataUrl = await htmlToImage.toPng(container.firstChild, {
        backgroundColor: '#ffffff',
        cacheBust: true,
        pixelRatio: 2,
      });

      // 5. Download
      const link = document.createElement('a');
      link.download = `leaderboard-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();

      // 6. Clean up
      root.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDlLoading(false);
    }
  };

  const maxMarks = users[0]?.totalMarks || 1;
  const podOrder = [users[1], users[0], users[2]].filter(Boolean);
  const podRanks = users.length >= 2 ? [2, 1, 3] : [1];

  return (
    <div className='fixed inset-0 z-[99] flex items-center justify-center bg-black/55 backdrop-blur-sm'>
      <div className='w-full max-w-[760px] mx-4 h-[85vh] flex flex-col rounded-2xl overflow-hidden bg-white'
        style={{ border: '0.5px solid #e5e5e5' }}>

        {/* Header */}
        <div className='flex-shrink-0 flex items-center justify-between px-6 py-4'
          style={{ borderBottom: '0.5px solid #e5e5e5' }}>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center'
              style={{ background: '#fef3c7', color: '#92400e' }}>🏆</div>
            <div>
              <p className='text-sm font-medium' style={{ color: '#111' }}>Leaderboard</p>
              <p className='text-xs' style={{ color: '#888' }}>
                {loading ? 'Loading…' : `${users.length} participants`}
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            {!loading && !error && (
              <button
                onClick={downloadImage}
                disabled={dlLoading}
                className='text-xs px-3 py-1.5 rounded-md border border-[#e5e5e5] text-[#555] hover:bg-gray-100 disabled:opacity-50'
              >
                {dlLoading ? '⏳ Capturing…' : '⬇ Download Image'}
              </button>
            )}
            <button
              onClick={() => setIsRankBoard(false)}
              className='text-xs px-3 py-1.5 rounded-md border border-[#e5e5e5] text-[#555] hover:bg-gray-100'
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className='flex-grow overflow-y-auto'>
          {loading && <div className='py-16 text-center text-sm text-gray-400'>Loading…</div>}
          {error   && <div className='py-8 text-center text-sm text-[#E24B4A]'>{error}</div>}

          {!loading && !error && users.length > 0 && (
            <>
              <div className='flex items-end justify-center gap-2 px-6 pt-6 pb-8' style={{ background: '#f9f9f9' }}>
                {podOrder.map((u, i) => u && <PodiumBlock key={u.userId} user={u} rank={podRanks[i]} />)}
              </div>
              <div className='px-6 py-3'>
                {users.slice(3).map((u, i) => (
                  <React.Fragment key={u.userId}>
                    <ListRow user={u} rank={i + 4} maxMarks={maxMarks} />
                    {i < users.slice(3).length - 1 && <div className='h-[0.5px] bg-[#e5e5e5] mx-3' />}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;