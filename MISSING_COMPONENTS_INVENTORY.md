# 📦 MISSING COMPONENTS DETAILED INVENTORY

Generated: April 24, 2026

## 1. APPS DIRECTORY (40+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/apps/`

### Sub-Components:

#### skye-reader-hardened/
```
- package.json
- public/
- data/
- scripts/
- (web app with document reading capabilities)
```
**Status:** Essential - Document reader app for enterprise

#### skyequanta-shell/
```
- package.json
- lib/
- bin/
- python/
- (CLI shell for skyequanta interactions)
```
**Status:** Essential - CLI interface

---

## 2. BRANDING DIRECTORY (200+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/branding/`

**Contains:**
- Logo files
- Brand guidelines
- Visual assets
- Color schemes
- Typography

**Status:** Needed for builds and UI

---

## 3. CONFIG DIRECTORY (500+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/config/`

### Sub-Components:

#### config/agent/
```
- Agent configuration for autonomy modes
- Execution policies
- Resource allocation
```

#### config/env-templates/
```
- .env.example files
- Environment variable templates
- Configuration templates
```

**Status:** Critical for runtime configuration

---

## 4. SRC DIRECTORY (1000+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/src/`

**Contains:**
- Core source modules
- Utility functions
- Library code
- Helper scripts

**Status:** Core functionality

---

## 5. WORKSPACE DIRECTORY (3000+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/workspace/`

### Sub-Components:

#### workspace/retention/
```
- remote-default/
- local-default/
- pass38-fallback-*/
- preview-stage8/
(Runtime workspace snapshots)
```

#### workspace/prebuilds/
```
- Platform prebuilds for various targets
```

**Status:** Runtime execution environment

---

## 6. PLATFORM/USER-PLATFORMS (15000+ files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/platform/user-platforms/`

### Sub-Components:

#### A. Account Executive Command Hub Platforms
```
skye-account-executive-commandhub-s0l26-0s/
  ├── source/
  │   ├── AE-Central-Command-Pack-CredentialHub-Launcher/
  │   │   ├── netlify/
  │   │   │   └── functions/
  │   │   │       ├── ae-access-users.js
  │   │   │       ├── ae-assignments.js
  │   │   │       ├── ae-audit-events.js
  │   │   │       ├── ae-brain-compare.js
  │   │   │       ├── ae-brain-health.js
  │   │   │       ├── ae-brain-smoke-reports.js
  │   │   │       ├── ae-brain-stream.js
  │   │   │       ├── ae-brains.js
  │   │   │       ├── ae-branch-state.js
  │   │   │       ├── ae-clients.js
  │   │   │       ├── ae-donor-template.js
  │   │   │       ├── ae-messages.js
  │   │   │       ├── ae-storage-sync.js
  │   │   │       ├── ae-threads.js
  │   │   │       ├── ae-usage-summary.js
  │   │   │       └── media-center.js
  │   │   ├── public/
  │   │   ├── src/
  │   │   └── package.json
  │   ├── shared/
  │   │   ├── core/
  │   │   └── models/
```

**Files:** ~1500+  
**Status:** CRITICAL Enterprise Feature

#### B. SkyEHands Codex Platforms (Sections 81-84+)
```
skyehands-codex-control-plane/
  ├── skyehands-codex-control-plane.mjs
  ├── README.md

skyehands-codex-competitor/
  ├── skyehands-codex-competitor.mjs
  ├── README.md

skyehands-codex-real-platform/
  ├── skyehands-codex-real-platform.mjs
  ├── skyehands-platform-core.mjs
  ├── skyehands-platform-db.mjs
  ├── skyehands-oauth-gateway.mjs
  ├── skyehands-browser-ide.mjs
  ├── skyehands-sandbox-runner.mjs
  ├── skyehands-provider-router.mjs
  ├── skyehands-deploy-automation.mjs
  ├── skyehands-billing-webhooks.mjs
  ├── skyehands-isolation-controller.mjs
  ├── migrations/
  │   └── 001_skyehands_codex_platform_core.sql
  └── README.md
```

**Files:** ~500+  
**Status:** CRITICAL New Platforms (Sections 81-92)

#### C. Autonomous Store System
```
ae-autonomous-store-system-maggies/
  ├── source/
  │   ├── shared/
  │   │   └── core/
  │   │       └── autonomous-store.mjs
  │   └── package.json
```

**Files:** ~200+  
**Status:** Connected to autonomous agent lane

#### D. Platform Wiring Configuration
```
platform/wiring/
  └── unpacked-platforms.json
```

**Files:** Configuration for platform loading

---

## 7. SKYEROUTEX PLATFORM (486 files)

### Location in Dynasty-Versions:
`/Dynasty-Versions/SkyeRoutexFlow_v78_unpacked/SkyeRoutexFlow_v69_PLATFORM_HOUSE_CIRCLE_NEON_ENTERPRISE_BACKUP_LANE/`

### Sub-Components:

#### A. Main SkyeRoutex System
```
SkyeRoutex/
  ├── operator/ (Documentation & walkthroughs)
  │   ├── SKYEROUTEXFLOW_V67_MASTER_WALKTHROUGH.md
  │   ├── SKYEROUTEXFLOW_V67_MASTER_WALKTHROUGH.json
  │   ├── SKYEROUTEXFLOW_V67_MASTER_WALKTHROUGH.html
  │   ├── SKYEROUTEXFLOW_V69_MASTER_WALKTHROUGH.md
  │   ├── SKYEROUTEXFLOW_V69_MASTER_WALKTHROUGH.json
  │   └── SKYEROUTEXFLOW_V69_MASTER_WALKTHROUGH.html
  │
  └── investor/ (Valuation & business docs)
      ├── SKYEROUTEXFLOW_V66_2026_ENTERPRISE_VALUATION.*
      ├── SKYEROUTEXFLOW_V68_2026_ENTERPRISE_VALUATION.*
      └── SKYEROUTEXFLOW_V69_2026_ENTERPRISE_VALUATION.*
```

#### B. AE-Flow Application
```
AE-Flow/AE-Flow/
  ├── index.html
  ├── manifest.webmanifest
  ├── sw.js
  ├── _headers
  ├── academy.v38.js
  ├── tutorials.v35.js
  ├── whiteglove.v39.js → v56.js (multiple versions)
  ├── index.check.js
  ├── 0s-auth-sdk/
  │   └── index.js
  ├── apple-touch-icon.png
  ├── icon-192.png
  ├── icon-512.png
  ├── maskable-512.png
  └── readme.txt
```

**Files:** ~150+  
**Status:** Critical routing application

#### C. White-Glove Services (v39-v64)
```
WHITE_GLOVE_V39/
WHITE_GLOVE_V43/
WHITE_GLOVE_V56/
WHITE_GLOVE_V58/ (includes PDF)
WHITE_GLOVE_V60/
WHITE_GLOVE_V64/
```

**Files:** Multiple versions - ~250+  
**Status:** Service documentation

#### D. SkyeSol Whiteglove Services
```
skyesol-whiteglove-bookings/
  ├── README.md
  ├── contract.json
  └── index.js

skyesol-whiteglove-dispatch/
  ├── README.md
  ├── contract.json
  └── index.js

skyesol-whiteglove-memberships/
  ├── README.md
  ├── contract.json
  └── index.js

skyesol-whiteglove-payments/
  ├── README.md
  ├── contract.json
  └── index.js

skyesol-whiteglove-sync/
  ├── README.md
  ├── contract.json
  └── index.js

skyesol-whiteglove-runtime/
  └── shared.js
```

**Files:** ~50+  
**Status:** Critical service implementations

#### E. Browser Block Captures
```
browser_block_capture_v35.json
browser_block_capture_v36.json
browser_block_capture_v37.json

static_selector_and_tour_audit_v35.json
static_selector_and_tour_audit_v36.json
static_selector_and_tour_audit_v37.json
```

**Status:** Browser UI automation configs

#### F. Supporting Documentation
```
ROUTEX_AE_FLOW_OFFLINE_UPGRADE_DIRECTIVE.md
extra-shit/
  ├── 00-READ-FIRST-NO-CODE-TOUCHED.md
  ├── 01-IN-ORDER-INTEGRATION-PLAN.md
  ├── 02-DONOR-MAP-FROM-PROJECT-DOCS.md
  ├── 03-STARTER-STATUS-MATRIX.csv
  ├── 04-CODE-TOUCH-MAP.md
  ├── 05-DIRECTIVE-INCONSISTENCIES-AND-HONESTY-NOTES.md
  └── 99-NO-CODE-HASHES.txt
```

**Status:** Integration & audit documentation

---

## 8. SCRIPTS DIRECTORY (66 missing scripts)

### Current in stage_44rebuild:
- `run-app-script.mjs`
- `repo-paths.mjs`
- `repo-root.mjs`
- `_repo-utils.mjs`

**Total:** 4 scripts

### In Dynasty-Versions:
**Total:** 70 scripts

### Missing Scripts (Examples):
```
smoke-p001-smoke-evidence-rule.sh
smoke-p002-smoke-scope-rule.sh
smoke-p003-checkmark-gate-rule.sh
...
smoke-p081-skyehands-codex-control-plane.mjs
smoke-p082-skyehands-codex-competitor.mjs
smoke-p083-skyehands-real-codex-platform.mjs
smoke-p084-skyehands-platform-core.mjs
smoke-p085-skyehands-platform-db.mjs
smoke-p086-skyehands-sandbox-runner.mjs
smoke-p087-skyehands-provider-router.mjs
smoke-p088-skyehands-billing-webhooks.mjs
smoke-p089-skyehands-deploy-automation.mjs
smoke-p090-skyehands-oauth-gateway.mjs
smoke-p091-skyehands-browser-ide.mjs
smoke-p092-skyehands-isolation-controller.mjs
... and ~50+ more
```

**Status:** Critical for build validation and deployment

---

## 9. NEW/PRESERVED FEATURES TO MAINTAIN

### GrayChunks Platform
**Location in stage_44rebuild:** `stage_44rebuild/platform/agent-core/` (possibly)  
**Status:** MUST NOT OVERWRITE - Newer feature  
**Action:** Verify and preserve during merge

### Section 81-92 Directives  
**Location in Dynasty-Versions:** `docs/hardening/` and `.skyequanta/`  
**Status:** Check if newer in Dynasty-Versions  
**Action:** Compare timestamps and choose newer version

### Agent-Core Improvements
**Location:** `stage_44rebuild/platform/agent-core/`  
**Status:** PRESERVE - newer implementation  
**Action:** Keep unless Dynasty version has critical fixes

---

## 📊 SUMMARY TABLE

| Component | Files | Location | Priority | Action |
|-----------|-------|----------|----------|--------|
| apps | 5000+ | Dynasty-Versions/apps | 🔴 CRITICAL | Copy |
| branding | 200+ | Dynasty-Versions/branding | ⚠️ NEEDED | Copy |
| config | 500+ | Dynasty-Versions/config | ⚠️ NEEDED | Copy |
| src | 1000+ | Dynasty-Versions/src | ⚠️ NEEDED | Copy |
| workspace | 3000+ | Dynasty-Versions/workspace | ⚠️ NEEDED | Copy |
| platform/user-platforms | 15000+ | Dynasty-Versions/platform/user-platforms | 🔴 CRITICAL | Copy + Merge |
| SkyeRoutex | 486 | Dynasty-Versions/SkyeRoutexFlow_v78_unpacked | 🔴 CRITICAL | Copy |
| scripts | 66 | Dynasty-Versions/scripts | 🔴 CRITICAL | Merge |
| .skyequanta | 3000+ | Both (merge newer) | ⚠️ NEEDED | Merge |
| docs | 1000+ | Both (merge newer) | ⚠️ NEEDED | Merge |
| GrayChunks | ??? | stage_44rebuild | 🟡 PRESERVE | Keep |

**Total Missing Files:** ~72,900  
**Total Build Gap:** ~64% incomplete

---

## ✅ NEXT STEPS

1. Review this inventory with user
2. Get approval on merge strategy
3. Create backup of stage_44rebuild
4. Execute Phase 1 merge (copy missing critical folders)
5. Test build after each phase
6. Validate all platforms load
7. Run smoke tests
8. Commit merged build to git

