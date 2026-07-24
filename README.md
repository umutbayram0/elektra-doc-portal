# Elektra Doc Portal

Elektraweb yazılımcıları için generic, yeniden kullanılabilir bir dokümantasyon portal altyapısı. Angular ile yapıldı.

**Projects, Modules, Components, API ve Libraries bölümleri bilinçli olarak boş** (`cards: []`). Bu bir eksiklik değil — bu portal içerik değil, içerik için bir altyapı sunuyor. Gerçek dokümantasyon, ilgili projeyi/modülü/API'yi bilen Elektraweb ekip üyeleri tarafından eklenmeli. Nasıl ekleneceği aşağıda ve **Getting Started**/**Guides** bölümlerinde anlatılıyor.

## Node.js sürümü

```
^22.22.3 || ^24.15.0 || >=26.0.0
```

`.nvmrc` içinde `24.15.0` sabitlendi (`nvm use`). `package.json`'daki `engines.node` alanı da aynı aralığı belirtir.

## Kurulum ve çalıştırma

```bash
npm install
npm start
```

`http://localhost:4200/` adresinden açılır. Kaynak dosyalarda yaptığın değişiklikler otomatik yansır.

## Build

```bash
npm run build
```

Çıktı `dist/elektra-doc-portal` içine gelir.

## Test, lint ve format

```bash
npm test              # Vitest ile birim testleri çalıştırır
npm run lint           # ESLint
npm run format:check   # Prettier — biçimlendirme kontrolü
npm run format          # Prettier — otomatik düzeltme
```

Teslim öncesi hepsinin (`npm ci` sonrası) temiz geçmesi beklenir.

## Özellikler

- Drill-down sidebar (bir bölüme girince yalnızca o bölümün sayfaları + geri linki gösterilir)
- İç içe (nested) doküman sayfaları, her biri gerçek bir URL'e sahip
- Komut paleti tarzı arama (Ctrl/Cmd+K) — hem sayfa içerikleri hem boş bölümlerin kendi kök sayfaları aranabilir
- Breadcrumb'lar
- Kod örnekleri için syntax highlighting + kopyala butonu
- Sayfa başına opsiyonel `properties` tablosu, `notes` (tip/warning/note) kutuları ve `related` çapraz bağlantılar
- "Bu sayfayı GitHub'da düzenle" linki

## İçerik yapısı

İçerik component koduna değil, JSON dosyalarına yazılır — **yeni bir doküman sayfası eklemek için component yazmana gerek yok.**

Her bölüm (`Getting Started`, `Guides`, `Projects`, `Modules`, `Components`, `API`, `Libraries`) `src/app/features/<bölüm>/` altında aynı yapıyı kullanır:

- `<bölüm>-content.json` — sayfa içeriği (`title`, `description`, `cards: DocNode[]`)
- `<bölüm>-content.schema.json` — içeriğin uyması gereken JSON Schema
- `<bölüm>.routes.ts` — index sayfası (`FeatureIndex`) ve nested node'lar için wildcard route (`NodeDetail`)

Kartlar (`DocNode`, bkz. `src/app/shared/doc-node.model.ts`) `children` ile iç içe geçebilir; her node kendi URL'ine sahip olur (örn. `/modules/authentication/route-guards`).

**Merkezi kayıt:** `src/app/core/documentation/section-registry.ts` içindeki `DOCUMENTATION_SECTIONS` dizisi her bölümün label/basePath/content/route-loader bilgisini tek bir yerde tutar. Route'lar (`app.routes.ts`), sidebar (`app.ts`), arama (`search.service.ts`) ve Overview sayfasının navigasyon kartları hepsi buradan besleniyor — yeni bir bölüm eklerken tek bu diziye kayıt yapman yeterli.

**Doğrulama:** her `content.json`/`schema.json` çifti `ajv` (JSON Schema validator) ile `src/app/core/content/content-validation.spec.ts` içinde test ediliyor: zorunlu alanlar, bilinmeyen alanlar, `id`'nin route-safe bir slug olması (küçük harf, rakam, tek tire), aynı üst düğüm altında tekrarlayan `id` olmaması ve `related` linklerin gerçekten var olan bir sayfaya işaret etmesi.

### Yeni bir doküman sayfası ekleme

1. İlgili `<bölüm>-content.json` dosyasına benzersiz bir `id`, `title` ve `description` içeren bir madde ekle (`example`/`notes`/`properties`/`related`/`children` opsiyonel).
2. `npm test` çalıştır — şema doğrulaması eksik/yanlış alanları yakalar.

### Yeni bir üst düzey bölüm ekleme

1. `src/app/features/<bölüm>/` klasörünü oluştur.
2. `<bölüm>-content.json` dosyasını ekle.
3. `<bölüm>-content.schema.json` dosyasını başka bir bölümden kopyalayıp uyarla.
4. `<bölüm>.routes.ts` dosyasını oluştur (`FeatureIndex` + `NodeDetail` route çifti, diğer bölümlerdeki gibi).
5. `src/app/core/documentation/section-registry.ts`'deki `DOCUMENTATION_SECTIONS` dizisine bölümü ekle.
6. `src/app/core/content/content-validation.spec.ts`'deki `pages` dizisine yeni content/schema çiftini ekle.
7. `npm test`, `npm run lint`, `npm run build` çalıştır.

Adım adım örnek için: **Guides → Yeni Bir Üst Düzey Bölüm Ekleme**.

## Proje yapısı

```
src/app/
  app.ts, app.html, app.css       Shell: sidebar, arama, mobil nav
  app.routes.ts                    Üst düzey route tanımı (registry'den üretilir)
  core/
    documentation/                 Section registry (tek kaynak)
    search/                        Arama index'i ve servisi
    content/                       JSON Schema doğrulama + semantik kurallar
  features/<bölüm>/                Her bölümün content.json/schema/routes dosyaları
  shared/                          FeatureIndex, NodeDetail, NodeTile, NavList, Breadcrumbs, SearchBox...
```
