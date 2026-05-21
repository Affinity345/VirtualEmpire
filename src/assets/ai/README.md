# Images IA Virtual Empire

Place les images IA dans ces dossiers, puis ajoute leurs fichiers dans `src/data/aiImageRegistry.ts`.

Formats conseilles :
- cartes assets : `1024x768`, `.jpg` ou `.webp`
- hero : `1536x1024`, `.jpg` ou `.webp`

Structure :
- `businesses/`
- `cars/`
- `realEstate/`
- `luxury/`
- `collections/`
- `hero/`

L'app reste stable si une image manque : elle utilise l'URL existante ou le placeholder premium.
