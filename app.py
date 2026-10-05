"""
Caesar Cipher Security Lab
Aplikasi pembelajaran algoritma Caesar Cipher untuk mata kuliah Keamanan Siber.

Dijalankan dengan: python app.py
"""

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# ============================================================
#  IMPLEMENTASI CAESAR CIPHER
# ============================================================

def _shift_char(char, shift):
    """
    Geser satu karakter alfabet (A-Z / a-z) sesuai nilai shift.
    - Huruf besar tetap huruf besar
    - Huruf kecil tetap huruf kecil
    - Spasi, angka, dan tanda baca TIDAK berubah
    """
    if 'A' <= char <= 'Z':
        # Rumus enkripsi: C = (P + K) mod 26
        base = ord('A')
        return chr((ord(char) - base + shift) % 26 + base)
    if 'a' <= char <= 'z':
        base = ord('a')
        return chr((ord(char) - base + shift) % 26 + base)
    # Bukan huruf -> kembalikan apa adanya
    return char


def encrypt_caesar(text, shift):
    """
    Enkripsi plaintext menggunakan Caesar Cipher.
    Rumus: C = (P + K) mod 26
    """
    # Modulo 26 agar shift > 26 tetap valid
    shift = shift % 26
    result = ''.join(_shift_char(ch, shift) for ch in text)
    return result


def decrypt_caesar(text, shift):
    """
    Dekripsi ciphertext menggunakan Caesar Cipher.
    Rumus: P = (C - K) mod 26
    """
    # Dekripsi = geser ke arah berlawanan (negatif)
    return encrypt_caesar(text, -shift)


def brute_force(text):
    """
    Brute force attack: coba seluruh kemungkinan shift (1-25).
    Mengembalikan list of dict: [{'shift': 1, 'result': '...'}, ...]
    """
    results = []
    for s in range(1, 26):
        results.append({
            'shift': s,
            'result': decrypt_caesar(text, s)
        })
    return results


# ============================================================
#  ROUTES
# ============================================================

@app.route('/')
def index():
    """Halaman utama (single-page application dengan navigasi)."""
    return render_template('index.html')


@app.route('/api/encrypt', methods=['POST'])
def api_encrypt():
    """Endpoint API untuk enkripsi."""
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get('text') or '').strip()
    shift_raw = data.get('shift')

    # --- Validasi input ---
    if not text:
        return jsonify({'error': 'Plaintext tidak boleh kosong.'}), 400
    try:
        shift = int(shift_raw)
    except (TypeError, ValueError):
        return jsonify({'error': 'Shift harus berupa angka.'}), 400

    ciphertext = encrypt_caesar(text, shift)

    # Proses perubahan huruf per huruf (untuk ditampilkan di UI)
    process = []
    for ch in text:
        shifted = _shift_char(ch, shift)
        process.append({
            'char': ch,
            'shifted': shifted,
            'changed': ch != shifted
        })

    return jsonify({
        'ciphertext': ciphertext,
        'process': process
    })


@app.route('/api/decrypt', methods=['POST'])
def api_decrypt():
    """Endpoint API untuk dekripsi."""
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get('text') or '').strip()
    shift_raw = data.get('shift')

    if not text:
        return jsonify({'error': 'Ciphertext tidak boleh kosong.'}), 400
    try:
        shift = int(shift_raw)
    except (TypeError, ValueError):
        return jsonify({'error': 'Shift harus berupa angka.'}), 400

    plaintext = decrypt_caesar(text, shift)

    return jsonify({'plaintext': plaintext})


@app.route('/api/bruteforce', methods=['POST'])
def api_bruteforce():
    """Endpoint API untuk brute force attack (shift 1-25)."""
    data = request.get_json(force=True, silent=True) or {}
    text = (data.get('text') or '').strip()

    if not text:
        return jsonify({'error': 'Ciphertext tidak boleh kosong.'}), 400

    results = brute_force(text)

    return jsonify({
        'results': results,
        'explanation': (
            'Caesar Cipher sangat mudah diserang dengan brute force karena '
            'hanya memiliki 25 kemungkinan shift (1-25). Penyerang dapat '
            'mencoba seluruh kemungkinan dalam hitungan detik dan langsung '
            'mengenali plaintext yang bermakna.'
        )
    })


# ============================================================
#  MAIN
# ============================================================

if __name__ == '__main__':
    # debug=True agar reload otomatis saat kode diubah
    app.run(debug=True, host='0.0.0.0', port=5000)
