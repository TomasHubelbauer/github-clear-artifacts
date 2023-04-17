import child_process from 'child_process';
import owner from './owner.js';
import pat from './pat.js';
import repo from './repo.js';

const url = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts?per_page=100`;
const response = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });
const data = await response.json();

let counter = 0;
for (const artifact of data.artifacts) {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifact.id}`;
  const response = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${pat}` } });
  const rate = `${response.headers.get('X-RateLimit-Remaining')}/${response.headers.get('X-RateLimit-Limit')}`
  console.log(`${counter++}/${data.total_count}: ${artifact.id} - ${artifact.name}: ${response.status} ${response.statusText} (${rate})`);
}

// Beep to signal completion (macOS only)
child_process.exec('afplay /System/Library/Sounds/Glass.aiff');
