// filters-page2.js - UI simple pour filtrer les points sur page2

function populateTypeFiltersPage2(types) {
  // crée un contrôle Leaflet simple avec cases à cocher
  const controlHtml = document.createElement('div');
  controlHtml.className = 'page2-filter-box';
  controlHtml.style.background = 'white'; controlHtml.style.padding = '8px'; controlHtml.style.borderRadius = '6px'; controlHtml.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  controlHtml.innerHTML = '<strong>Types</strong><div id="page2-type-list" style="max-height:200px;overflow:auto;margin-top:6px;"></div><div style="margin-top:8px;"><button id="page2-apply">Apply</button> <button id="page2-reset">Reset</button></div>';

  const customControl = L.control({position: 'topright'});
  customControl.onAdd = function(){ return controlHtml; };
  customControl.addTo(mapPage2);

  // assign colors for each type (ensure same mapping used by markers)
  types.forEach(t => {
    if (!typeColorsPage2[t]) typeColorsPage2[t] = colorListPage2[colorIndexPage2 % colorListPage2.length];
    colorIndexPage2++;
  });

  const list = document.getElementById('page2-type-list');
  list.innerHTML = '';
  types.forEach(t => {
    const id = `page2-type-${t}`;
    const swatch = `<span style="display:inline-block;width:12px;height:12px;background:${typeColorsPage2[t]};margin-right:6px;border-radius:3px;vertical-align:middle;"></span>`;
    const div = document.createElement('div');
    div.innerHTML = `<label>${swatch}<input type="checkbox" id="${id}" value="${t}" style="margin-right:6px;"> ${t}</label>`;
    list.appendChild(div);
  });

  document.getElementById('page2-apply').addEventListener('click', function(){
    const checked = Array.from(document.querySelectorAll('#page2-type-list input:checked')).map(n=>n.value);
    activeFiltersPage2.types = checked;
    displayFilteredPointsPage2();
  });

  document.getElementById('page2-reset').addEventListener('click', function(){
    document.querySelectorAll('#page2-type-list input').forEach(i=>i.checked=false);
    activeFiltersPage2 = { types: [], source: '', density: 0, user: '' };
    displayFilteredPointsPage2();
  });

  createLegendPage2();
}

function populateSourceFiltersPage2(sources) {
  // Not yet rendered in UI, but keep available
  console.log('Sources for page2:', sources);
}

function populateUserFiltersPage2(users) {
  console.log('Users for page2:', users.length);
}
