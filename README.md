# Elektra Doc Portal

Elektraweb yazılımcıları için dokümantasyon portalı. Angular ile yapıldı.


## Kurulum ve çalıştırma

```bash
npm install
npm start
```

`http://localhost:4200/` adresinden açılır.

## Build

```bash
npm run build
```

Çıktı `dist/elektra-doc-portal` içine gelir.

## Test ve lint

```bash
npm test
npm run lint
```

## İçerik yapısı

Her doküman bölümü (`Getting Started`, `Guides`, `Projects`, `Modules`, `Components`, `API`, `Libraries`) `src/app/features/<bölüm>/` altında aynı yapıyı kullanır:

- `<bölüm>-content.json` — sayfa içeriği (kart dizisi)
- `<bölüm>-content.schema.json` — içeriğin uyması gereken JSON Schema
- `<bölüm>.routes.ts` — index sayfası ve nested node'lar için wildcard route

Kartlar (`DocNode`, bkz. `src/app/shared/doc-node.model.ts`) `children` ile iç içe geçebilir, her node kendi URL'sine sahip olur (örn. `/modules/authentication/route-guards`).

Yeni bir sayfa eklemek için ilgili `-content.json` dosyasına bir node ekleyip `npm test` çalıştırmak yeterli — schema validasyonu eksik alanları yakalar.

## Arama

Sidebar'daki arama kutusu (`shared/search-box.ts`), uygulama açılışında oluşturulan bir index üzerinden (`core/search/`) tüm node başlık ve açıklamalarında arama yapar.
