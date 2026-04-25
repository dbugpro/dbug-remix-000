# dbug — BUGWORLD 2026

> Public Template Repository for BUGWORLD 2026 Session Development  
> **Spec:** `v260303.1` | **Sync Root:** `C:\dbug` | **Session:** `DBUG 260303 (1)`

## 🔐 Core Rules
- `dbug.` and `admin.` **must** include trailing periods (non-negotiable)
- `zero_china_dependencies` is mandatory for global distribution
- Admin Triad (`adminx`, `admin.`, `adminq`) required for `session_init`

## 🗂️ Structure
UPDATING DBUG PROJECT ON AI GOOGLE STUDIO

https://ai.studio/apps/e712dc26-20a3-4ad6-97c4-bf53afb81451

dbug/
├── .beta/
│   ├── .g/
│   │   ├── .gitkeep
│   │   └── singularity_manifest.json
│   └── .x/
│       ├── .gitkeep
│       └── singularity_manifest.json
├── services
│       └── geminiService.ts
├── .gitignore
├── .github
├── core/
├── LICENSE
├── README.md
└── metadata.json

UPDATING DBUG PROJECT ON BUGBASE-PC2

C:\dbug
├── core/ # Identity layer (v260303.1)
├── bugworld2026/ # Unity 6.3 LTS (bugapp000-999) + UE5.7 (-/q/)
├── bugbase2026/ # BugBase 2026 modules
├── 0/ - 9/ # DBUG PRODUCTIONS projects
├── tools/ # MCP, TGA, utilities
├── docs/ # Documentation
├── sessions/ # Local-only session data (EXCLUDED from sync)
├── .github/ # Template config + workflows
├── .gitignore # Unity/UE5 exclusions
├── .gitattributes # LFS configuration
├── LICENSE
├── README.md # This file
└── metadata.json

## 🚀 Quick Start
1. Click **"Use this template"** → **"Create a new repository"**
2. Clone your new repo: `git clone https://github.com/YOU/NEW-REPO.git`
3. Install Git LFS: `git lfs install`
4. Configure local paths in `core/session_protocol.json`
5. Initialize session with admin triad

## 🎮 Engine Support
- **Unity:** 6.3 LTS (6000.3.10f1) — Primary
- **Unreal Engine:** 5.7 — Secondary

## 🔄 Sync Configuration
- **Local Root:** `C:\dbug`
- **Remote:** `https://github.com/dbugpro/dbug`
- **Branches:** `main` (template), `session/<SESSION_ID>` (isolated work)

## 📜 License
DBUG LICENSE. See `LICENSE` for details.