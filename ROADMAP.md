# Mona's Roadmap

Next steps for Mona's Bookmark Manager App: find links faster, organize your collection, and keep saved bookmarks safe.

| Area | Item | Type | Priority |
| --- | --- | --- | --- |
| Discovery | Search & filter bookmarks | 🚀 | High |
| Management | Edit a bookmark | 🚀 | Medium |
| Organization | Tags or folders | 🚀 | Medium |
| Portability | Import/export bookmarks | 🚀 | High |
| Slugs | Duplicate slug risk in stored data | 🐞 | Medium |
| Validation | Empty-URL validation regression risk | 🐞 | Medium |
| Persistence | Bookmark loss when localStorage is cleared | 🐞 | High |

## 🚀 Planned features

- 🔖 Search & filter bookmarks — priority: high
- ✏️ Edit a bookmark — priority: medium
- 🗂️ Tags or folders — priority: medium
- 📦 Import/export bookmarks — priority: high

## 🐞 Known bugs & risks

- 🐞 Duplicate slug risk in stored data — priority: medium; validate uniqueness on load, not just when adding
- 🛡️ Empty-URL validation regression risk — priority: medium; preserve empty-input rejection and extend whitespace-only coverage
- 💾 Bookmark loss when localStorage is cleared — priority: high; provide export backups and explain device-only storage
