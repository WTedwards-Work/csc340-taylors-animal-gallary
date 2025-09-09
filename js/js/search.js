// js/search.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('search.js loaded'); // debug

  const input   = document.getElementById('searchInput');
  const button  = document.getElementById('searchBtn');
  const grid    = document.getElementById('animalGrid');
  const empty   = document.getElementById('noResults');
  const cards   = grid ? Array.from(grid.getElementsByClassName('animal-card')) : [];

  const norm = (s) => (s || '').toLowerCase().trim();

  function cardMatches(card, q) {
    if (!q) return true;
    const haystack = [
      card.dataset.name,
      card.dataset.type,
      card.dataset.species,
      card.dataset.summary,
      card.querySelector('.card-title')?.textContent,
      card.querySelector('.card-text')?.textContent
    ].map(norm).join(' ');
    return haystack.includes(norm(q));
  }

  function applyFilter(query) {
    let shown = 0;
    cards.forEach(card => {
      const match = cardMatches(card, query);
      card.style.display = match ? '' : 'none';
      if (match) shown++;
    });
    if (empty) empty.style.display = shown === 0 ? '' : 'none';
  }

  // keep search in URL (?q=...)
  function setUrlQuery(query) {
    const url = new URL(window.location.href);
    if (norm(query)) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState({}, '', url);
  }
  function getUrlQuery() {
    return new URL(window.location.href).searchParams.get('q') || '';
  }

  // Initialize from URL
  const initial = getUrlQuery();
  if (initial) input.value = initial;
  applyFilter(initial);

  // Live filter while typing
  input.addEventListener('input', () => {
    const q = input.value;
    setUrlQuery(q);
    applyFilter(q);
  });

  // Button click
  button.addEventListener('click', () => {
    const q = input.value;
    setUrlQuery(q);
    applyFilter(q);
  });

  // Enter key inside input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value;
      setUrlQuery(q);
      applyFilter(q);
    }
  });
});
