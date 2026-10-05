/* ============================================================
   Caesar Cipher Security Lab — Client-side JavaScript
   Menangani navigasi sidebar, pemanggilan API, dan tampilan hasil.
   Backend (app.py) TIDAK diubah — endpoint tetap:
     /api/encrypt, /api/decrypt, /api/bruteforce
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  //  NAVIGASI ANTAR SECTION
  // ============================================================
  const navItems = document.querySelectorAll('.nav-item');
  const quickLinks = document.querySelectorAll('.quick-link');
  const sections = document.querySelectorAll('.section');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const topbarTitle = document.getElementById('topbarTitle');

  // Label judul topbar per section
  const sectionLabels = {
    dashboard: 'Dashboard',
    encrypt: 'Encryption',
    decrypt: 'Decryption',
    bruteforce: 'Brute Force',
    learn: 'Learn'
  };

  function switchTo(sectionId) {
    // Sembunyikan semua section
    sections.forEach(function (s) {
      s.classList.remove('active');
      s.classList.add('hidden');
    });

    // Tampilkan section target
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }

    // Update nav aktif (sidebar)
    navItems.forEach(function (n) { n.classList.remove('active'); });
    const activeNav = document.querySelector('.nav-item[data-section="' + sectionId + '"]');
    if (activeNav) activeNav.classList.add('active');

    // Update judul topbar
    if (topbarTitle) {
      topbarTitle.textContent = sectionLabels[sectionId] || 'Caesar Lab';
    }

    // Tutup sidebar mobile
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Klik item sidebar
  navItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      switchTo(this.dataset.section);
    });
  });

  // Klik quick-link di dashboard
  quickLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      switchTo(this.dataset.section);
    });
  });

  // ============================================================
  //  SIDEBAR MOBILE TOGGLE
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('show');
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }

  // ============================================================
  //  HELPER FUNCTIONS
  // ============================================================

  // Tampilkan error
  function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.hidden = false;
    container.innerHTML =
      '<div class="error-msg">' + escapeHtml(message) + '</div>';
  }

  // Escape HTML (XSS protection)
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  // Toggle loading state pada tombol
  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    if (loading) btn.classList.add('loading');
    else btn.classList.remove('loading');
  }

  // Sembunyikan placeholder, tampilkan result
  function showResult(resultId, placeholderId) {
    const result = document.getElementById(resultId);
    if (result) result.hidden = false;
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) placeholder.style.display = 'none';
  }

  // ============================================================
  //  ENCRYPTION
  // ============================================================
  document.getElementById('btn-encrypt').addEventListener('click', async function () {
    const text  = document.getElementById('enc-plaintext').value.trim();
    const shift = document.getElementById('enc-shift').value.trim();
    const resultArea = document.getElementById('enc-result');

    // Validasi sisi klien
    if (!text) {
      showResult('enc-result', 'enc-placeholder');
      showError('enc-result', 'Plaintext tidak boleh kosong.');
      return;
    }
    if (shift === '' || isNaN(Number(shift))) {
      showResult('enc-result', 'enc-placeholder');
      showError('enc-result', 'Shift harus berupa angka.');
      return;
    }

    // Tampilkan loading
    setLoading('btn-encrypt', true);
    showResult('enc-result', 'enc-placeholder');
    resultArea.innerHTML = '<h3>Memproses...</h3><div class="result-box">Menganalisis input...</div>';

    try {
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, shift: shift })
      });
      const data = await res.json();

      if (!res.ok) {
        showError('enc-result', data.error || 'Terjadi kesalahan.');
        return;
      }

      // Bangun HTML hasil
      let html = '';

      // Ciphertext
      html += '<h3>Hasil Ciphertext</h3>';
      html += '<div class="result-box">' + escapeHtml(data.ciphertext) + '</div>';

      // Proses perubahan huruf
      html += '<h3>Proses Perubahan Huruf</h3>';
      html += '<div class="process-box">';
      if (!data.process || data.process.length === 0) {
        html += '<span style="color:var(--slate-light);font-size:0.82rem">Tidak ada karakter.</span>';
      } else {
        data.process.forEach(function (p) {
          var cls = p.changed ? 'changed' : 'unchanged';
          var arrow = p.changed ? ' \u2192 ' : ' \u00b7 ';
          html +=
            '<span class="char-pair">' +
              '<span class="' + cls + '">' + escapeHtml(p.char) + '</span>' +
              '<span class="arrow">' + arrow + '</span>' +
              '<span class="' + cls + '">' + escapeHtml(p.shifted) + '</span>' +
            '</span>';
        });
      }
      html += '</div>';

      resultArea.innerHTML = html;
    } catch (err) {
      showError('enc-result', 'Gagal terhubung ke server: ' + err.message);
    } finally {
      setLoading('btn-encrypt', false);
    }
  });

  // ============================================================
  //  DECRYPTION
  // ============================================================
  document.getElementById('btn-decrypt').addEventListener('click', async function () {
    const text  = document.getElementById('dec-ciphertext').value.trim();
    const shift = document.getElementById('dec-shift').value.trim();
    const resultArea = document.getElementById('dec-result');

    if (!text) {
      showResult('dec-result', 'dec-placeholder');
      showError('dec-result', 'Ciphertext tidak boleh kosong.');
      return;
    }
    if (shift === '' || isNaN(Number(shift))) {
      showResult('dec-result', 'dec-placeholder');
      showError('dec-result', 'Shift harus berupa angka.');
      return;
    }

    setLoading('btn-decrypt', true);
    showResult('dec-result', 'dec-placeholder');
    resultArea.innerHTML = '<h3>Memproses...</h3><div class="result-box">Menganalisis input...</div>';

    try {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, shift: shift })
      });
      const data = await res.json();

      if (!res.ok) {
        showError('dec-result', data.error || 'Terjadi kesalahan.');
        return;
      }

      resultArea.innerHTML =
        '<h3>Hasil Plaintext</h3>' +
        '<div class="result-box">' + escapeHtml(data.plaintext) + '</div>';
    } catch (err) {
      showError('dec-result', 'Gagal terhubung ke server: ' + err.message);
    } finally {
      setLoading('btn-decrypt', false);
    }
  });

  // ============================================================
  //  BRUTE FORCE
  // ============================================================
  document.getElementById('btn-bruteforce').addEventListener('click', async function () {
    const text = document.getElementById('bf-ciphertext').value.trim();
    const resultArea = document.getElementById('bf-result');
    const resultCard = document.getElementById('bf-result-card');
    const countBadge = document.getElementById('bf-count-badge');

    if (!text) {
      resultCard.hidden = false;
      resultArea.innerHTML = '<div class="error-msg">Ciphertext tidak boleh kosong.</div>';
      return;
    }

    setLoading('btn-bruteforce', true);
    resultCard.hidden = false;
    resultArea.innerHTML = '<h3>Memproses...</h3><div class="result-box">Mencoba 25 kemungkinan shift...</div>';

    try {
      const res = await fetch('/api/bruteforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });
      const data = await res.json();

      if (!res.ok) {
        resultArea.innerHTML = '<div class="error-msg">' + escapeHtml(data.error || 'Terjadi kesalahan.') + '</div>';
        return;
      }

      // Update badge jumlah
      if (countBadge) {
        countBadge.textContent = data.results.length + ' kemungkinan';
      }

      // Bangun tabel
      let html = '<h3>Semua Kemungkinan Dekripsi (Shift 1\u201325)</h3>';
      html += '<div class="table-wrapper"><table class="bf-table">';
      html += '<thead><tr><th>Shift</th><th>Hasil Dekripsi</th></tr></thead><tbody>';

      data.results.forEach(function (r) {
        html +=
          '<tr>' +
            '<td>K=' + r.shift + '</td>' +
            '<td>' + escapeHtml(r.result) + '</td>' +
          '</tr>';
      });

      html += '</tbody></table></div>';

      // Penjelasan
      html += '<div class="info-box"><strong>Mengapa mudah diretas?</strong> ' +
              escapeHtml(data.explanation) + '</div>';

      resultArea.innerHTML = html;
    } catch (err) {
      resultArea.innerHTML = '<div class="error-msg">Gagal terhubung ke server: ' + escapeHtml(err.message) + '</div>';
    } finally {
      setLoading('btn-bruteforce', false);
    }
  });

  // ============================================================
  //  AKTIVASI SECTION AWAL (Dashboard)
  // ============================================================
  switchTo('dashboard');

});
