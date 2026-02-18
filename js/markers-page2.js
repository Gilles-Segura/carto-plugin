// markers-page2.js - création des marqueurs et clustering pour page2

function createCustomIconPage2(type) {
  if (!type) type = 'default';
  if (iconCachePage2[type]) return iconCachePage2[type];
  if (!typeColorsPage2[type]) {
    typeColorsPage2[type] = colorListPage2[colorIndexPage2 % colorListPage2.length];
    colorIndexPage2++;
  }
  // generate SVG for the given type using a shape chosen deterministically
  const color = typeColorsPage2[type];
  const svg = createShapeSVGForType(type, color);
  const url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  iconCachePage2[type] = L.icon({ iconUrl: url, iconSize: [28,28], iconAnchor: [14,14], popupAnchor: [0,-14] });
  return iconCachePage2[type];
}

// helper to deterministically pick a shape and return SVG markup
function createShapeSVGForType(type, fillColor) {
  const shapes = ['diamond','circle','square','triangle','pin','star','hexagon'];
  // simple hash of type
  let h = 0; for (let i=0;i<type.length;i++) h = (h<<5) - h + type.charCodeAt(i);
  const shape = shapes[Math.abs(h) % shapes.length];

  const stroke = 'white';
  const strokeWidth = 1.6;
  const size = 28;
  // center coordinates
  const cx = size/2, cy = size/2;

  switch(shape) {
    case 'circle':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cy}" r="10" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    case 'square':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect x="6" y="6" width="16" height="16" rx="3" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    case 'triangle':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><polygon points="${cx},4 ${size-6},${size-6} 6,${size-6}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    case 'diamond':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><polygon points="${cx},4 ${size-4},${cy} ${cx},${size-4} 4,${cy}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    case 'pin':
      // classic map pin
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`;
    case 'star':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><polygon points="${cx},4 ${cx+4},${cy-2} ${size-4},${cy-2} ${cx+6},${cy+4} ${cx+10},${size-4} ${cx},${cy+6} ${cx-10},${size-4} ${cx-6},${cy+4} 4,${cy-2} ${cx-4},${cy-2}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    case 'hexagon':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><polygon points="${cx},4 ${size-6},${cy-6} ${size-6},${cy+6} ${cx},${size-4} 6,${cy+6} 6,${cy-6}" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cy}" r="10" fill="${fillColor}" stroke="${stroke}" stroke-width="${strokeWidth}"/></svg>`;
  }
}

function createClusterIconPage2(cluster) {
  const cnt = cluster.getChildCount();
  return L.divIcon({ html: `<div class="marker-cluster"><span>${cnt}</span></div>`, className: 'marker-cluster', iconSize: L.point(40,40) });
}

function escapeHtmlPage2(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Download-by-email modal and client POST ---
function showDownloadRequestModal(fileUrl, fileName) {
  // remove existing modal
  const existing = document.getElementById('page2-download-modal'); if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'page2-download-modal';
  modal.style.position = 'fixed'; modal.style.left = '0'; modal.style.top = '0';
  modal.style.width = '100%'; modal.style.height = '100%'; modal.style.zIndex = 100001;
  modal.style.display = 'flex'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
  modal.style.background = 'rgba(0,0,0,0.5)';

  const box = document.createElement('div');
  box.style.width = '420px'; box.style.maxWidth = '92%'; box.style.background = '#fff'; box.style.borderRadius = '8px'; box.style.padding = '16px'; box.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';

  box.innerHTML = `<h3 style="margin:0 0 8px 0">Send download link</h3>
    <p style="margin:0 0 12px 0;font-size:13px;color:#333">Enter your name and email. We will send a download link to your inbox.</p>
    <form id="page2-download-form">
      <div style="margin-bottom:8px;"><label style="display:block;font-size:13px;margin-bottom:4px">Name</label><input name="name" type="text" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px"/></div>
      <div style="margin-bottom:8px;"><label style="display:block;font-size:13px;margin-bottom:4px">Email</label><input name="email" type="email" required style="width:100%;padding:8px;border:1px solid #ccc;border-radius:4px"/></div>
      <input name="hp" type="text" style="display:none;" tabindex="-1" autocomplete="off" />
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;"><button type="button" id="page2-download-cancel" style="padding:8px 12px">Cancel</button><button type="submit" style="padding:8px 12px;background:#1976d2;color:#fff;border:none;border-radius:4px">Send link</button></div>
    </form>`;

  modal.appendChild(box);
  document.body.appendChild(modal);

  document.getElementById('page2-download-cancel').addEventListener('click', () => modal.remove());
  document.getElementById('page2-download-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const hp = e.target.hp && e.target.hp.value;
    if (hp) return alert('Bot detected');
    if (!email) return alert('Please enter an email');

    // helper to POST to server
    async function doPost(token) {
      try {
        const payload = { name, email, fileUrl, fileName, recaptchaToken: token };
        const resp = await fetch('/api/send-download', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await resp.json().catch(()=>null);
        if (resp.ok && data && data.ok) {
          alert('Request sent — we will process it and contact you if needed');
          modal.remove();
          return;
        }
        // If running from static host (github pages) or file://, fallback to mailto if ADMIN_EMAIL provided
        const isStatic = location.protocol === 'file:' || (location.hostname && location.hostname.endsWith('github.io'));
        const msg = data && data.error ? data.error : (resp.statusText || 'unknown error');
        if (isStatic) {
          // try Formspree if configured (works on static hosting)
          if (window.FORMSPREE_ENDPOINT) {
            try {
              const fResp = await fetch(window.FORMSPREE_ENDPOINT, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, fileUrl, fileName, _subject: 'Download request' })
              });
              if (fResp.ok) {
                alert('Request sent via Formspree — you should receive a confirmation by email');
                modal.remove();
                return;
              }
            } catch (fe) { console.warn('Formspree submit failed', fe); }
          }

          // fallback to mailto if ADMIN_EMAIL defined
          if (window.ADMIN_EMAIL) {
            const subject = encodeURIComponent('Download request: ' + (fileName || 'file'));
            const bodyLines = [
              'Name: ' + (name || ''),
              'Email: ' + (email || ''),
              'File: ' + (fileName || ''),
              'URL: ' + (fileUrl || ''),
              'Note: sent from static page fallback',
              'Time: ' + new Date().toISOString()
            ];
            const body = encodeURIComponent(bodyLines.join('\n'));
            const mailto = `mailto:${encodeURIComponent(window.ADMIN_EMAIL)}?subject=${subject}&body=${body}`;
            try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bodyLines.join('\n')); } catch(e){}
            window.location.href = mailto;
            modal.remove();
            return;
          }

          alert('No server endpoint available (static host). Configure window.FORMSPREE_ENDPOINT or window.ADMIN_EMAIL, or deploy the /api/send-download endpoint. Details: ' + msg);
        } else {
          alert('Error sending request: ' + msg);
        }
      } catch (err) {
        console.error('send-download error', err);
        const isStatic = location.protocol === 'file:' || (location.hostname && location.hostname.endsWith('github.io'));
        if (isStatic) {
          // try Formspree if configured
          if (window.FORMSPREE_ENDPOINT) {
            try {
              const fResp = await fetch(window.FORMSPREE_ENDPOINT, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, fileUrl, fileName, _subject: 'Download request (fallback)' })
              });
              if (fResp.ok) {
                alert('Request sent via Formspree — you should receive a confirmation by email');
                modal.remove();
                return;
              }
            } catch (fe) { console.warn('Formspree submit failed', fe); }
          }

          if (window.ADMIN_EMAIL) {
            const subject = encodeURIComponent('Download request: ' + (fileName || 'file'));
            const bodyLines = [
              'Name: ' + (name || ''),
              'Email: ' + (email || ''),
              'File: ' + (fileName || ''),
              'URL: ' + (fileUrl || ''),
              'Note: sent from static page fallback (error during fetch)',
              'Time: ' + new Date().toISOString()
            ];
            const body = encodeURIComponent(bodyLines.join('\n'));
            const mailto = `mailto:${encodeURIComponent(window.ADMIN_EMAIL)}?subject=${subject}&body=${body}`;
            try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bodyLines.join('\n')); } catch(e){}
            window.location.href = mailto;
            modal.remove();
            return;
          }

          alert('Impossible d\'envoyer la requête depuis file:// ou depuis GitHub Pages — configurez window.FORMSPREE_ENDPOINT or window.ADMIN_EMAIL or deploy the endpoint.');
        } else {
          alert('Error sending request');
        }
      }
    }

    // If a reCAPTCHA site key is provided in the page scope, execute it first
    if (window.RECAPTCHA_SITE_KEY) {
      // ensure script loaded
      if (!document.querySelector('#recapt-script')) {
        const s = document.createElement('script');
        s.src = `https://www.google.com/recaptcha/api.js?render=${window.RECAPTCHA_SITE_KEY}`;
        s.id = 'recapt-script';
        document.head.appendChild(s);
      }
      try {
        // wait for grecaptcha
        const waitForGre = () => new Promise((resolve, reject) => {
          let waited = 0;
          const iv = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.execute) { clearInterval(iv); return resolve(); }
            waited += 100;
            if (waited > 4000) { clearInterval(iv); return resolve(); }
          }, 100);
        });
        await waitForGre();
        if (window.grecaptcha && window.grecaptcha.execute) {
          const token = await window.grecaptcha.execute(window.RECAPTCHA_SITE_KEY, { action: 'send_download' });
          await doPost(token);
        } else {
          // fallback if grecaptcha not available
          await doPost(null);
        }
      } catch (e) {
        console.warn('reCAPTCHA execution failed, sending without token', e);
        await doPost(null);
      }
    } else {
      // no reCAPTCHA configured — send directly (not recommended for production)
      await doPost(null);
    }
  });
}

// Open image full-screen in an overlay
window.openImagePage2 = function(url) {
  if (!url) return;
  // remove existing overlay if any
  let overlay = document.getElementById('page2-image-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'page2-image-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.85)';
  overlay.style.zIndex = '100000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.cursor = 'zoom-out';

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'photo';
  img.style.maxWidth = '95%';
  img.style.maxHeight = '95%';
  img.style.borderRadius = '6px';
  img.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6)';
  img.style.objectFit = 'contain';

  overlay.appendChild(img);

  // close on click or Esc
  overlay.addEventListener('click', () => overlay.remove());
  document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); } });

  document.body.appendChild(overlay);
};

// Open a Formspree-styled modal prefilled with file info (suitable for GitHub Pages)
function openFormspreeModal(fileUrl, fileName) {
  // remove existing modal
  const existing = document.getElementById('page2-formspree-modal'); if (existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'page2-formspree-modal';
  modal.style.position = 'fixed'; modal.style.left = '0'; modal.style.top = '0'; modal.style.width = '100%'; modal.style.height = '100%';
  modal.style.zIndex = 110000; modal.style.display = 'flex'; modal.style.alignItems = 'center'; modal.style.justifyContent = 'center';
  modal.style.background = 'rgba(0,0,0,0.45)';

  const box = document.createElement('div');
  box.style.width = '520px'; box.style.maxWidth = '94%'; box.style.maxHeight = '90%'; box.style.overflow = 'auto';
  box.style.background = '#fff'; box.style.borderRadius = '8px'; box.style.padding = '18px'; box.style.boxShadow = '0 12px 40px rgba(0,0,0,0.25)';

  // compact Formspree Simple Contact Form markup + styles (user provided)
  const formHtml = `
  <style>
  /* minimal subset of provided Formspree CSS adapted for modal */
  .fs-form{display:grid;row-gap:1rem;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial}
  .fs-field{display:flex;flex-direction:column;row-gap:.375rem;margin-bottom:.5rem}
  .fs-label{font-weight:600;font-size:13px;color:#0f172a}
  .fs-input,.fs-textarea{padding:.5rem .75rem;border-radius:6px;border:1px solid #e2e8f0;font-size:14px}
  .fs-textarea{min-height:120px}
  .fs-button{background:#1976d2;color:#fff;padding:.75rem 1.25rem;border-radius:6px;border:none;cursor:pointer}
  .fs-button-group{display:flex;justify-content:flex-end;margin-top:8px}
  .fs-cancel{background:#eee;color:#111;padding:.6rem 1rem;border-radius:6px;border:none;cursor:pointer;margin-right:8px}
  </style>

  <h3 style="margin:0 0 10px 0">Request download</h3>
  <p style="margin:0 0 12px 0;color:#334155;font-size:13px">Please provide your email and a short message. The file name and link are prefilled — submit to send the request.</p>
  <form action="${window.FORMSPREE_ENDPOINT || ''}" class="fs-form" target="_blank" method="POST">
    <div class="fs-field">
      <label class="fs-label" for="fs-email">Email</label>
      <input class="fs-input" id="fs-email" name="email" type="email" required />
    </div>
    <div class="fs-field">
      <label class="fs-label" for="fs-message">Message</label>
      <textarea class="fs-textarea" id="fs-message" name="message"></textarea>
    </div>
    <input type="hidden" name="fileName" value="${escapeHtmlPage2(fileName)}" />
    <input type="hidden" name="fileUrl" value="${escapeHtmlPage2(fileUrl)}" />
    <div style="display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:10px">
      <button type="button" class="fs-cancel">Cancel</button>
      <button class="fs-button" type="submit">Submit request</button>
    </div>
  </form>`;

  box.innerHTML = formHtml;
  modal.appendChild(box);
  document.body.appendChild(modal);

  // Prefill message textarea with file info
  const msgEl = document.getElementById('fs-message');
  if (msgEl) {
    msgEl.value = `Requesting file: ${fileName}\nURL: ${fileUrl}\n\nPlease send access or download link.`;
  }

  // Wire cancel
  const cancelBtn = box.querySelector('.fs-cancel');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.remove());

  // Close on click outside
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function displayFilteredPointsPage2() {
  if (!mapPage2) return;
  if (mainClusterGroupPage2) mapPage2.removeLayer(mainClusterGroupPage2);

  // create a single-level cluster: clusters active below a zoom threshold, disabled above
  const disableZoom = (window.PAGE2_CLUSTER_DISABLE_AT_ZOOM !== undefined) ? window.PAGE2_CLUSTER_DISABLE_AT_ZOOM : 12;
  mainClusterGroupPage2 = L.markerClusterGroup({
    iconCreateFunction: createClusterIconPage2,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: disableZoom,
    maxClusterRadius: 40
  });

  const filtered = allPointsPage2.filter(p => {
    if (activeFiltersPage2.types.length && !activeFiltersPage2.types.includes(p.type)) return false;
    if (activeFiltersPage2.source && p.source !== activeFiltersPage2.source) return false;
    if (activeFiltersPage2.user && p.owner !== activeFiltersPage2.user) return false;
    if (activeFiltersPage2.density > 0) {
      if (Math.random()*10 < activeFiltersPage2.density) return false;
    }
    return true;
  });

  filtered.forEach(p => {
    if (typeof p.latitude !== 'number' || typeof p.longitude !== 'number') return;
    const icon = createCustomIconPage2(p.type);
    // Build popup HTML: image (if any) + table of all properties
    let popupHtml = `<div style="max-width:320px;"><strong>${escapeHtmlPage2(p.id || 'Barrier')}</strong>`;

    // unique id for popup buttons
    const uid = 'uid' + Math.random().toString(36).slice(2,9);

    // prepare buttons HTML (used either under image or under details when no image)
    let buttonsHtml = `<div style="display:flex;flex-direction:column;gap:6px;">`;
    buttonsHtml += `<button id="zoom-${uid}" style="display:block;width:100%;font-size:12px;">Zoom</button>`;
    buttonsHtml += `<button id="download-barrier-${uid}" style="display:block;width:100%;font-size:12px;">Download barrier</button>`;
    if (p.source_file_url) buttonsHtml += `<button id="download-file-${uid}" style="display:block;width:100%;font-size:12px;">Download file</button>`;
    buttonsHtml += `</div>`;

    // detect image field in properties and build a left-side thumbnail
    let imgHtml = '';
    const ignoreKeys = new Set([
      'id','latitude','longitude','lat','lng','geom','geomgeojson','geom_geojson','photourl','photo','photo_url','image','image_url','coords','coordinates','coordinate','geometry','user_username'
    ]);

    function titleCaseKey(key) {
      // convert snake_case or camelCase to Title Case
      if (!key) return '';
      // replace underscores and hyphens with spaces
      let s = key.replace(/[_-]+/g, ' ');
      // split camelCase boundaries
      s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
      // capitalize words
      return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    function normalizeVal(v) {
      if (v === null || v === undefined) return '';
      let s = String(v).trim();
      if (!s) return '';
      if (s === 'NA' || s === 'na' || s === 'N/A') return 'N/A';
      return s;
    }

    if (p.properties) {
      const propKeys = Object.keys(p.properties);
      for (const k of propKeys) {
        const v = p.properties[k];
        if (!v) continue;
        const sval = String(v).trim();
        // heuristics: if value is a full URL to an image
        if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(sval)) {
          const safeUrl = escapeHtmlPage2(sval);
          imgHtml = `<div style="flex:0 0 140px;margin-right:12px;text-align:center;">` +
                    `<img src="${safeUrl}" style="width:140px;height:auto;max-height:220px;border-radius:6px;object-fit:cover;cursor:pointer;" alt="photo" onclick="openImagePage2('${safeUrl}')"/>` +
                    `<div style="margin-top:6px;">${buttonsHtml}</div>` +
                    `</div>`;
          break;
        }
        // or if looks like an image filename, try to build raw.githubusercontent URL
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(sval) && !/^https?:\/\//i.test(sval)) {
          const rawUrl = `https://raw.githubusercontent.com/${window.CDN_REPO}/${window.CDN_BRANCH}/type/${encodeURIComponent(sval)}`;
          const safeRaw = escapeHtmlPage2(rawUrl);
          imgHtml = `<div style="flex:0 0 140px;margin-right:12px;text-align:center;">` +
                    `<img src="${safeRaw}" style="width:140px;height:auto;max-height:220px;border-radius:6px;object-fit:cover;cursor:pointer;" alt="photo" onclick="openImagePage2('${safeRaw}')"/>` +
                    `<div style="margin-top:6px;">${buttonsHtml}</div>` +
                    `</div>`;
          break;
        }
      }
    }

    // Build two-column layout: image at left, details at right
    popupHtml += `<div style="display:flex;gap:12px;align-items:flex-start;max-width:520px;">`;
    if (imgHtml) popupHtml += imgHtml;
    popupHtml += `<div style="flex:1;">`;
    // inject compact CSS for popup table
    popupHtml += `<style>.popup-table{width:100%;border-collapse:collapse;font-size:13px}.popup-table td{padding:6px 4px;vertical-align:top}.popup-label{font-weight:600;width:35%;padding-right:8px;color:#333}.popup-value{color:#222}</style>`;
    popupHtml += `<table class="popup-table">`;

    // show Type first
    popupHtml += `<tr><td class="popup-label">Type</td><td class="popup-value">${escapeHtmlPage2(p.type||'N/A')}</td></tr>`;

    // include coordinates row (formatted)
    popupHtml += `<tr><td class="popup-label">Coordinates</td><td class="popup-value">${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}</td></tr>`;

    // list all properties, skipping ignored/redundant keys and empty values
    if (p.properties) {
      const keys = Object.keys(p.properties).sort();
      for (const key of keys) {
        const lk = key.toLowerCase();
        if (ignoreKeys.has(lk)) continue;
        const rawVal = p.properties[key];
        const val = normalizeVal(rawVal);
        if (!val) continue;
        popupHtml += `<tr><td class="popup-label">${escapeHtmlPage2(titleCaseKey(key))}</td><td class="popup-value">${escapeHtmlPage2(val)}</td></tr>`;
      }
    }

    popupHtml += `</table>`;

    // if no image placed, add buttons under the details table to keep them accessible
    if (!imgHtml) {
      popupHtml += `<div style="margin-top:8px;text-align:center;">${buttonsHtml}</div>`;
    }

    popupHtml += `</div></div>`;

    const popup = popupHtml;
    const marker = L.marker([p.latitude, p.longitude], { icon }).bindPopup(popup);
    // attach popupopen handlers to wire buttons
    marker.on('popupopen', function() {
      // zoom button
      const zb = document.getElementById(`zoom-${uid}`);
      if (zb) zb.addEventListener('click', () => mapPage2.setView([p.latitude, p.longitude], 18));

      // download barrier: create a GeoJSON Feature and trigger download
      const db = document.getElementById(`download-barrier-${uid}`);
      if (db) db.addEventListener('click', () => {
        try {
          const feature = {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.longitude, p.latitude] },
            properties: p.properties || {}
          };
          const blob = new Blob([JSON.stringify(feature, null, 2)], { type: 'application/geo+json' });
          const fn = `${(p.id||p.type)}_feature.geojson`;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = fn; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(()=>URL.revokeObjectURL(url), 1000);
        } catch(e) { console.error('Download barrier failed', e); }
      });

      // download file: open email request modal instead of direct download
      const df = document.getElementById(`download-file-${uid}`);
      if (df && p.source_file_url) df.addEventListener('click', () => {
        openFormspreeModal(p.source_file_url, p.source_file_name || 'data.geojson.gz');
      });
    });

    mainClusterGroupPage2.addLayer(marker);
  });

  mapPage2.addLayer(mainClusterGroupPage2);
}

function createLegendPage2() {
  const existing = document.querySelector('.legend-page2');
  if (existing) existing.remove();
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function(){
    const div = L.DomUtil.create('div', 'legend legend-page2');
    div.innerHTML = '<h4>Barrier types</h4>';
    Object.entries(typeColorsPage2).forEach(([t,c]) => {
      // use same shape generator but reduced size for legend
      const smallSvg = createShapeSVGForType(t, c).replace(/width="28"/g, 'width="16"').replace(/height="28"/g, 'height="16"').replace(/stroke-width="1.6"/g, 'stroke-width="1"');
      div.innerHTML += `<div style="margin-bottom:6px;display:flex;align-items:center;gap:6px;">${smallSvg}<span style="font-size:13px;color:#222">${t}</span></div>`;
    });
    return div;
  };
  legend.addTo(mapPage2);
}
