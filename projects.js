// Preferred build folders: portfolio1/demo1 ... demo4 and portfolio2/demo1 ... demo4.
// Existing root demo1 ... demo8 folders also work (1–4 in Portfolio 1; 5–8 in Portfolio 2).
function projectSlot(path) {
  let match = /^portfolio([12])\/demo([1-4])\/index\.html$/.exec(path);
  if (match) return { portfolio: Number(match[1]), project: Number(match[2]) };
  match = /^demo([1-8])\/index\.html$/.exec(path);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  return { portfolio: Math.floor(index / 4) + 1, project: index % 4 + 1 };
}

async function discoverProjects() {
  try {
    const response = await fetch('https://api.github.com/repos/watswat5/VRPortfolio1Website/git/trees/main?recursive=1',
      { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Project list unavailable');
    const result = await response.json();
    if (result.truncated || !Array.isArray(result.tree)) throw new Error('Incomplete project list');
    // Nested portfolio folders take priority over legacy flat demo folders.
    const projects = result.tree.filter(entry => entry.type === 'blob' && projectSlot(entry.path))
      .sort((a, b) => a.path.localeCompare(b.path));
    for (const entry of projects) {
      const slot = projectSlot(entry.path);
      const card = document.querySelector(`[data-portfolio="${slot.portfolio}"][data-project="${slot.project}"]`);
      const href = './' + entry.path.split('/').map(encodeURIComponent).join('/');
      // Only enable projects actually served here, avoiding links to an undeployed GitHub build.
      const published = await fetch(href, { method: 'HEAD', signal: AbortSignal.timeout(4000) });
      if (!published.ok) continue;
      card.classList.add('available');
      card.querySelector('.badge').textContent = 'Available';
      card.querySelector('.pending')?.remove();
      let link = card.querySelector('a');
      if (!link) {
        card.querySelector('p').textContent = 'An interactive project, ready to explore.';
        link = document.createElement('a');
        link.textContent = 'Explore project ↗';
        card.append(link);
      }
      link.href = href;
    }
    if (document.querySelector('[data-portfolio="2"].available')) {
      document.querySelector('#portfolio2').parentElement.querySelector('p').textContent = 'Four projects · Explore the collection';
    }
  } catch {
    document.getElementById('project-status').textContent = 'Showing the saved project list. New projects may appear when you refresh.';
  }
}
discoverProjects();
