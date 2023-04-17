import child_process from 'child_process';
import owner from './owner.js';
import pat from './pat.js';
import repo from './repo.js';

let total;
while (total === undefined || total > 0) {
  const url = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts?per_page=100`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });
  if (response.status !== 200) {
    child_process.exec('afplay /System/Library/Sounds/Sosumi.aiff');
    process.exit(1);
  }

  const data = await response.json();
  total = data.total_count;

  let counter = 0;
  for (const artifact of data.artifacts) {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifact.id}`;
    const response = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${pat}` } });
    if (response.status !== 204) {
      child_process.exec('afplay /System/Library/Sounds/Sosumi.aiff');
    }

    const rate = `${response.headers.get('X-RateLimit-Remaining')}/${response.headers.get('X-RateLimit-Limit')}`
    console.log(`${counter++}/${total}: ${artifact.id} - ${artifact.name}: ${response.status} ${response.statusText} (${rate})`);
  }

  // Beep to signal batch completion (macOS only)
  child_process.exec('afplay /System/Library/Sounds/Glass.aiff');
  child_process.exec(`say "${total - counter} left"`);
}
