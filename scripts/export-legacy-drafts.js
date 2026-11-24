// Run in the OLD site's browser console, once per browser/profile used for editing.
(() => {
  const drafts = Object.keys(localStorage)
    .filter((k) => k.startsWith('draft-'))
    .map((key) => ({ key, value: JSON.parse(localStorage.getItem(key)) }));
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(drafts, null, 2)], { type: 'application/json' }),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'legacy-browser-drafts.json';
  a.click();
  URL.revokeObjectURL(url);
  console.log(`Exported ${drafts.length} drafts; originals retained.`);
})();
