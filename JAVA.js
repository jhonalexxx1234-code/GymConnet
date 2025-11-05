// JAVAS.js - interactividad para la plantilla GymConnect
// Requisitos: permite preview en tiempo real, manejo de imágenes (dataURLs),
// activa/oculta links sociales, descarga HTML standalone y llamadas al backend.

document.addEventListener('DOMContentLoaded', () => {
  // Inputs
  const gymName = document.getElementById('gymName');
  const gymSlogan = document.getElementById('gymSlogan');
  const gymDescription = document.getElementById('gymDescription');
  const instagramUrl = document.getElementById('instagramUrl');
  const facebookUrl = document.getElementById('facebookUrl');
  const primaryColor = document.getElementById('primaryColor');
  const secondaryColor = document.getElementById('secondaryColor');
  const backgroundColor = document.getElementById('backgroundColor');
  const fontFamily = document.getElementById('fontFamily');

  // Image inputs
  const logoUpload = document.getElementById('logoUpload');
  const headerImageUpload = document.getElementById('headerImageUpload');
  const galleryUpload = document.getElementById('galleryUpload');

  // Preview elements
  const previewGymName = document.getElementById('previewGymName');
  const previewGymSlogan = document.getElementById('previewGymSlogan');
  const previewGymDescription = document.getElementById('previewGymDescription');
  const navLogo = document.getElementById('navLogo');
  const gymLogoImg = document.getElementById('gymLogoImg');
  const headerBackgroundImg = document.getElementById('headerBackgroundImg');
  const galleryGrid = document.getElementById('galleryGrid');
  const gallerySection = document.getElementById('gallerySection');
  const socialSection = document.getElementById('redes');
  const instagramLink = document.getElementById('instagramLink');
  const facebookLink = document.getElementById('facebookLink');
  const instagramNav = document.getElementById('instagramNav');
  const facebookNav = document.getElementById('facebookNav');
  const footerGymName = document.getElementById('footerGymName');
  const footerInstagram = document.getElementById('footerInstagram');
  const footerFacebook = document.getElementById('footerFacebook');

  // Export
  const downloadBtn = document.getElementById('downloadBtn');

  // State
  let galleryDataURLs = []; // store data urls of uploaded gallery images
  let logoDataURL = null;
  let headerDataURL = null;

  // UTIL: read file as dataURL (Promise)
  function fileToDataURL(file) {
    return new Promise((resolve,reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Update preview functions
  function updateTexts() {
    previewGymName.textContent = gymName.value.trim() || 'GymConnect';
    previewGymSlogan.textContent = gymSlogan.value.trim() || 'Transforma tu cuerpo, transforma tu vida';
    previewGymDescription.textContent = gymDescription.value.trim() || 'Nuestro gimnasio está equipado ...';
    navLogo.textContent = previewGymName.textContent;
    footerGymName.textContent = previewGymName.textContent;
  }

  function updateStyles() {
    document.documentElement.style.setProperty('--primary', primaryColor.value || '#ff6b35');
    document.documentElement.style.setProperty('--secondary', secondaryColor.value || '#180d4f');
    document.body.style.background = backgroundColor.value ? backgroundColor.value : '';
    document.body.style.fontFamily = fontFamily.value || '';
  }

  function updateSocialLinks() {
    const ig = instagramUrl.value.trim();
    const fb = facebookUrl.value.trim();

    if (ig) {
      instagramLink.href = ig;
      instagramLink.style.display = 'inline-flex';
      instagramNav.style.display = 'inline-block';
      footerInstagram.style.display = 'inline-block';
      instagramNav.href = ig;
      footerInstagram.href = ig;
      socialSection.style.display = '';
    } else {
      instagramLink.href = '#';
      instagramLink.style.display = 'none';
      instagramNav.style.display = 'none';
      footerInstagram.style.display = 'none';
    }

    if (fb) {
      facebookLink.href = fb;
      facebookLink.style.display = 'inline-flex';
      facebookNav.style.display = 'inline-block';
      footerFacebook.style.display = 'inline-block';
      facebookNav.href = fb;
      footerFacebook.href = fb;
      socialSection.style.display = '';
    } else {
      facebookLink.href = '#';
      facebookLink.style.display = 'none';
      facebookNav.style.display = 'none';
      footerFacebook.style.display = 'none';
    }

    // If neither social present, hide whole section
    if (!ig && !fb) socialSection.style.display = 'none';
  }

  // images handling: logo
  logoUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    logoDataURL = await fileToDataURL(file);
    gymLogoImg.src = logoDataURL;
    gymLogoImg.style.display = 'block';
    document.getElementById('logoPreview').innerHTML = `<img src="${logoDataURL}" alt="logo preview">`;
  });

  headerImageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    headerDataURL = await fileToDataURL(file);
    headerBackgroundImg.src = headerDataURL;
    headerBackgroundImg.style.display = 'block';
    document.getElementById('headerImagePreview').innerHTML = `<img src="${headerDataURL}" alt="header preview">`;
  });

  galleryUpload.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    galleryDataURLs = await Promise.all(files.map(f => fileToDataURL(f)));
    galleryGrid.innerHTML = '';
    galleryDataURLs.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      galleryGrid.appendChild(img);
    });
    gallerySection.style.display = 'block';
    document.getElementById('galleryPreview').innerHTML = galleryDataURLs.map(u => `<img src="${u}" style="max-width:80px;max-height:80px;border-radius:6px;">`).join('');
  });

  // inputs event listeners
  [gymName,gymSlogan,gymDescription].forEach(el => el.addEventListener('input', updateTexts));
  [primaryColor,secondaryColor,backgroundColor,fontFamily].forEach(el => el.addEventListener('input', updateStyles));
  [instagramUrl,facebookUrl].forEach(el => el.addEventListener('input', updateSocialLinks));

  // initial update
  updateTexts();
  updateStyles();
  updateSocialLinks();

  // EXPORT: build standalone HTML (inline CSS + images as data URLs)
  async function buildStandaloneHTML() {
    // grab current styles from colooo.css (fetch file and inline it)
    let cssText = '';
    try {
      const res = await fetch('colooo.css');
      cssText = await res.text();
    } catch (err) {
      console.warn('No se pudo cargar colooo.css para inline CSS. Usando estilos mínimos.');
    }

    // clone preview area markup
    const previewHtml = document.querySelector('.website-preview').outerHTML;

    // minimal HTML wrapper
    const full = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(previewGymName.textContent)} - GymConnect</title>
<style>${cssText}</style>
</head>
<body>
${previewHtml}
</body>
</html>`;

    return full;
  }

  // helper escape
  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generando archivo...';
    try {
      const html = await buildStandaloneHTML();
      const blob = new Blob([html], {type:'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(previewGymName.textContent||'gymconnect').toLowerCase().replace(/\s+/g,'-')}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch(err){
      console.error(err);
      alert('Error al generar el archivo: ' + err.message);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = '📥 Descargar HTML Completo';
    }
  });

  // --- BACKEND INTEGRATION: Save gym config to backend ---
  // API endpoints assumed:
  // POST /api/gyms           -> crear o actualizar (requires admin token)
  // GET  /public/:slug       -> descarga pública del HTML guardado (render)

  async function saveGymToBackend(adminToken) {
    // build payload
    const payload = {
      name: previewGymName.textContent,
      slogan: previewGymSlogan.textContent,
      description: previewGymDescription.textContent,
      instagram: instagramUrl.value.trim() || null,
      facebook: facebookUrl.value.trim() || null,
      style: {
        primary: primaryColor.value,
        secondary: secondaryColor.value,
        background: backgroundColor.value,
        font: fontFamily.value
      },
      images: {
        logo: logoDataURL,    // dataURLs
        header: headerDataURL,
        gallery: galleryDataURLs
      }
    };

    const res = await fetch('/api/gyms', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': adminToken ? `Bearer ${adminToken}` : ''
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Error guardando gym: ${res.status} ${txt}`);
    }
    const data = await res.json();
    return data; // should include slug or publicUrl
  }

  // Expose save function to global for debugging / hooking into a "Guardar" button
  window.saveGymToBackend = saveGymToBackend;
});
