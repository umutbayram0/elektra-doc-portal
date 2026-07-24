# Elektra Doc Portal

Elektraweb için Angular ile geliştirilen bir teknik dokümantasyon portalı. Sidebar, arama, iç içe sayfalar ve JSON tabanlı içerik yönetimi içerir.

Projects, Modules, Components, API ve Libraries bölümleri şu an boş — her ekip kendi dokümantasyonunu buraya ekleyecek.

## Gereksinimler ve kurulum

Node.js `24.15.0` (bkz. `.nvmrc`).

```bash
npm install
npm start
```

`http://localhost:4200/` üzerinden açılır.

```bash
npm run build
```

Çıktı `dist/elektra-doc-portal` içine gelir.

## Kullanılan yapılar

- Angular ve Angular Material
- JSON tabanlı içerik yapısı (`*-content.json`)
- JSON Schema ile içerik doğrulama (ajv)
- İç içe sayfalar ve drill-down sidebar
- Arama (Ctrl/Cmd+K)
- Test, lint, format ve GitHub Actions üzerinde CI

## Dokümantasyon ekleme

Var olan bir bölüme sayfa eklemek için ilgili `*-content.json` dosyasına bir node ekle. Zorunlu alanlar: `id`, `title`, `description`. Ekledikten sonra `npm test` çalıştır — şema doğrulaması eksik ya da yanlış alanları yakalar.

Yeni bir üst düzey bölüm eklemek ya da `notes`/`properties`/`related` gibi içerik alanlarını nasıl kullanacağını görmek için uygulama içindeki **Getting Started** ve **Guides** bölümlerine bak.

## Kontrol komutları

```bash
npm run format:check
npm run lint
npm test -- --watch=false
npm run build
```

Teslim öncesi hepsinin temiz geçmesi beklenir.
