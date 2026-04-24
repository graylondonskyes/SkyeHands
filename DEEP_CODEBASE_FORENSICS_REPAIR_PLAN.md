# 🔴 SKYEHANDS CODEBASE: CRITICAL FRAGMENTATION FORENSICS & REPAIR PLAN

**Date:** April 24, 2026  
**Status:** URGENT - INCOMPLETE/BROKEN BUILD IDENTIFIED  
**Severity:** CRITICAL - Multiple subsystems missing from current build  

---

## EXECUTIVE SUMMARY

The current `stage_44rebuild` codebase is **INCOMPLETE**. It's missing approximately **72,900 files** and **7 critical root-level directories** that exist in the reference build (`Dynasty-Versions`).

### Quick Stats:
| Metric | Stage_44rebuild | Dynasty-Versions | Status |
|--------|-----------------|------------------|--------|
| Total Files | 40,530 | 113,430 | ❌ **72,900 MISSING** |
| Scripts | 4 | 70 | ❌ **66 MISSING** |
| Root Directories | 9 | 18+ | ❌ **9 MISSING** |
| Apps Folder | ❌ MISSING | ✅ EXISTS | ❌ CRITICAL |
| Platform/user-platforms | ❌ MISSING | ✅ EXISTS | ❌ CRITICAL |
| Branding | ❌ MISSING | ✅ EXISTS | ⚠️ NEEDED |
| Config | ❌ MISSING | ✅ EXISTS | ⚠️ NEEDED |
| Src | ❌ MISSING | ✅ EXISTS | ⚠️ NEEDED |
| Workspace | ❌ MISSING | ✅ EXISTS | ⚠️ NEEDED |

---

## 🚨 IDENTIFIED MISSING COMPONENTS

### TIER 1: CRITICAL PLATFORMS & FEATURES (MUST HAVE)

#### 1. **AE-COMMAND HUB** (Account Executive Command Hub)
- **Status:** Exists in `Dynasty-Versions/SkyeHands_recovered_merged/platform/user-platforms/skye-account-executive-commandhub-*`
- **What it does:** Enterprise command center for account executives
- **Contains:** Netlify functions, credential hub, messaging, analytics
- **Scope:** ~1500+ files
- **Priority:** 🔴 CRITICAL - Enterprise feature

#### 2. **SKYEROUTEX** (Routing & Workflow Execution)
- **Status:** Exists in `Dynasty-Versions/SkyeRoutexFlow_v78_unpacked/`
- **What it does:** White-glove routing, dispatch, bookings, payments, memberships
- **Contains:** AE-Flow app, dispatch system, payment processor, membership mgmt
- **Scope:** ~486 files
- **Priority:** 🔴 CRITICAL - Core routing platform

#### 3. **AUTONOMOUS AGENT LANE** (Agent Systems)
- **Status:** Partially exists in dist/ but NOT as primary platform module
- **What it does:** Autonomous maintenance, autonomy gradient, agent execution
- **Contains:** Agent orchestration, maintenance policies, execution modes
- **Scope:** ~2000+ files in .skyequanta/
- **Priority:** 🔴 CRITICAL - Agent infrastructure

#### 4. **APPS DIRECTORY** (Application Suite)
- **Status:** ❌ COMPLETELY MISSING from stage_44rebuild
- **Components:**
  - `skye-reader-hardened` - Document reader with hardening
  - `skyequanta-shell` - Shell/CLI interface for skyequanta
- **Scope:** ~5000+ files
- **Priority:** 🔴 CRITICAL - Core application infrastructure

#### 5. **PLATFORM/USER-PLATFORMS** (Enterprise Subsystems)
- **Status:** ❌ MISSING from stage_44rebuild/platform/
- **Should contain:** All user-facing platform implementations
- **Priority:** 🔴 CRITICAL - Multi-tenant architecture

### TIER 2: INFRASTRUCTURE & CONFIGURATION (IMPORTANT)

#### 6. **BRANDING** Directory
- **Status:** ❌ MISSING
- **Contains:** Visual assets, logos, brand guidelines
- **Scope:** ~200 files
- **Priority:** ⚠️ NEEDED for builds

#### 7. **CONFIG** Directory
- **Status:** ❌ MISSING
- **Contains:** Agent configs, environment templates, deployment configs
- **Scope:** ~500 files
- **Priority:** ⚠️ NEEDED for runtime

#### 8. **SRC** Directory
- **Status:** ❌ MISSING
- **Contains:** Core source modules and utilities
- **Scope:** ~1000 files
- **Priority:** ⚠️ NEEDED for builds

#### 9. **WORKSPACE** Directory
- **Status:** ❌ MISSING
- **Contains:** Runtime workspace templates, prebuilds, retention policies
- **Scope:** ~3000+ files
- **Priority:** ⚠️ NEEDED for runtime execution

### TIER 3: NEW/UPDATED FEATURES (Must Preserve from stage_44rebuild)

#### ✅ GRAYCHUNKS Platform
- **Status:** EXISTS in stage_44rebuild
- **Location:** `stage_44rebuild/platform/agent-core/` (partial)
- **Notes:** New platform - ensure NOT overwritten during merge
- **Priority:** 🟡 PRESERVE

#### ✅ SECTION 81-92 Directives
- **Status:** EXISTS in Dynasty-Versions (newer versions)
- **Location:** `Dynasty-Versions/.skyequanta/` and docs
- **Contains:** Advanced system directives, platform hardening, OAuth, IDE
- **Priority:** 🟡 INTEGRATE - potentially newer

---

## 📋 MERGE STRATEGY

### Root Cause Analysis
The problem occurred when reorganizing into `stage_44rebuild`:
1. ✅ We correctly moved some directories (platform, scripts, docs)
2. ❌ We forgot to move critical folders: **apps/, branding/, config/, src/, workspace/**
3. ❌ We didn't extract platform/user-platforms
4. ❌ We didn't sync the complete skyequanta infrastructure

### Repair Approach

**Strategy: SELECTIVE MERGE FROM REFERENCE**

NOT a simple "restore from backup" but rather:

1. **Source Analysis**
   - Dynasty-Versions = Reference build (complete but slightly older)
   - stage_44rebuild = Current build (incomplete but has some new features)
   - SkyeHands_recovered_merged = Master version to extract from

2. **Merge Phases**

#### Phase 1: Copy Missing Critical Folders
```
Source: Dynasty-Versions/
Destinations to stage_44rebuild/:
  ✓ apps/                  (new - copy completely)
  ✓ branding/              (new - copy completely)
  ✓ config/                (new - copy completely)
  ✓ src/                   (new - copy completely)
  ✓ workspace/             (new - copy completely)
```

#### Phase 2: Merge Platform/User-Platforms
```
Source: Dynasty-Versions/platform/user-platforms/
Destination: stage_44rebuild/platform/user-platforms/

Components to integrate:
  ✗ skye-account-executive-commandhub-*
  ✗ skyehands-billing-webhooks
  ✗ skyehands-browser-ide
  ✗ skyehands-codex-competitor
  ✗ skyehands-codex-control-plane
  ✗ skyehands-codex-real-platform
  ✗ skyehands-deploy-automation
  ✗ skyehands-isolation-controller
  ✗ skyehands-oauth-gateway
  ✗ skyehands-platform-core
  ✗ skyehands-platform-db
  ✗ skyehands-provider-router
  ✗ skyehands-sandbox-runner
```

#### Phase 3: Merge SkyeRoutex
```
Source: Dynasty-Versions/SkyeRoutexFlow_v78_unpacked/
        SkyeRoutexFlow_v69_PLATFORM_HOUSE_CIRCLE_NEON_ENTERPRISE_BACKUP_LANE/

Destination: stage_44rebuild/ (top-level or platform/?)

Components:
  ✗ SkyeRoutex (operator, investor docs, walkthroughs)
  ✗ AE-Flow (application code)
  ✗ White-Glove services (v39-v64)
  ✗ skyesol-* (bookings, dispatch, memberships, payments, sync)
  ✗ Support libraries and contracts
```

#### Phase 4: Merge .skyequanta Infrastructure
```
Source: Dynasty-Versions/.skyequanta/
Determine which subsystems should merge:

Already exists in stage_44rebuild:
  ✓ .skyequanta/ (keep and enhance)
  
From Dynasty-Versions (decide per-subsystem):
  ? autonomous-maintenance/      (HAVE - check if newer)
  ? autonomy-gradient/           (HAVE - check if newer)
  ? deep-scan-mode/             (HAVE - check if newer)
  ? environment-mirror/          (HAVE - check if newer)
  ? memory-fabric/               (HAVE - check if newer)
  ? skye-foundry/                (CHECK - might be NEW)
  ? kaixu-council/               (CHECK - might be NEW)
  ? compliance-native-modes/     (CHECK - might be NEW)
  ? devglow/                     (CHECK - might be NEW)
  ? deal-ownership-generation/   (CHECK - might be NEW)
  ? platform-launchpad/          (CHECK - might be NEW)
```

#### Phase 5: Merge Scripts
```
Source: Dynasty-Versions/scripts/ (70 scripts)
Destination: stage_44rebuild/scripts/

Strategy:
  ! CAREFUL - check if stage_44rebuild scripts are NEWER
  ? If stage_44rebuild scripts are newer, KEEP them
  ? If dynasty versions have new scripts, ADD them with version suffix
  
Likely needed:
  ✗ smoke-* tests (many missing)
  ✗ deploy-automation scripts
  ✗ build scripts
```

#### Phase 6: Merge Dependencies & Configuration
```
Files to check/merge:
  ✗ package.json      (merge dependencies carefully)
  ✗ skyequanta.mjs    (merge with any new version)
  ✗ Makefile          (compare and merge targets)
  ✗ .devcontainer/    (compare and merge)
```

---

## 🔍 DETAILED FILE INVENTORY NEEDED

Before proceeding, we need to:

### Scan Dynasty-Versions structure:
```
✓ Dynasty-Versions/apps/ - complete
✓ Dynasty-Versions/branding/ - complete
✓ Dynasty-Versions/config/ - complete
✓ Dynasty-Versions/src/ - complete
✓ Dynasty-Versions/workspace/ - complete
✓ Dynasty-Versions/platform/user-platforms/ - complete
✓ Dynasty-Versions/SkyeRoutexFlow_v78_unpacked/ - complete
✓ Dynasty-Versions/.skyequanta/ - check freshness
✓ Dynasty-Versions/scripts/ - compare versions
```

### Check for conflicts:
```
? stage_44rebuild vs Dynasty-Versions on:
  - package.json versions
  - Script functionality
  - Platform module versions
  - .skyequanta infrastructure
```

### Identify NEW features in stage_44rebuild:
```
✓ GrayChunks platform (if it exists)
✓ Section 81-92 directives (if newer)
✓ Any agent-core improvements
? Any ide-core improvements
```

---

## ✅ NEXT STEPS

### Immediate Actions:
1. ✅ Create directory listings of ALL components in Dynasty-Versions (DONE)
2. ⏳ Analyze each major component's structure and dependencies
3. ⏳ Create detailed file-by-file merge conflict detection
4. ⏳ Create backup of current stage_44rebuild before merge
5. ⏳ Execute Phase 1-2 merge (critical components)
6. ⏳ Test build integrity after each phase
7. ⏳ Execute Phase 3-6 merge (remaining components)
8. ⏳ Final validation and testing

### Success Criteria:
- [ ] All 9 missing root directories restored
- [ ] 113,430 total files (or equivalent)
- [ ] All 70 scripts present
- [ ] Build system operational (npm install, make test work)
- [ ] All platforms loadable (ae-command, routex, autonomous agents, graychunks)
- [ ] Runtime operational (.skyequanta functional)
- [ ] Git commit with merge documentation

---

## 📊 COMPONENT DEPENDENCY MAP

```
stage_44rebuild/
├── platform/
│   ├── ide-core/              ✅ PRESENT
│   ├── agent-core/            ✅ PRESENT (GrayChunks?)
│   └── user-platforms/        ❌ MISSING - CRITICAL
│       ├── ae-command-*       ← FROM Dynasty-Versions
│       ├── skyhandcode-*      ← FROM Dynasty-Versions
│       ├── skyehands-*        ← FROM Dynasty-Versions (sections 81-92)
│       └── skyesol-*          ← FROM Dynasty-Versions (routing)
├── apps/                      ❌ MISSING - CRITICAL
│   ├── skye-reader-hard ened
│   └── skyequanta-shell
├── scripts/                   ✅ PARTIAL (4/70) - NEEDS MERGE
├── docs/                      ✅ PRESENT (maybe merge newer?)
├── .skyequanta/               ✅ PARTIAL (needs newer subsystems?)
├── branding/                  ❌ MISSING - NEEDED
├── config/                    ❌ MISSING - NEEDED
├── src/                       ❌ MISSING - NEEDED
├── workspace/                 ❌ MISSING - NEEDED
└── [ Integration packages like SkyeRoutex]
    ❌ MISSING - CRITICAL
```

---

## ⚠️ RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Overwriting newer code with old | Build regression | ✓ Check timestamps, git history first |
| Mass file merge confusion | Broken dependencies | ✓ Merge in phases, test each |
| Configuration conflicts | Runtime failures | ✓ Analyze config before merging |
| Script conflicts | Build fails | ✓ Compare script functionality |
| Node modules conflicts | npm install fails | ✓ Fresh npm install after merge |

---

## 📝 FILE CREATED

This document: `/workspaces/SkyeHands/DEEP_CODEBASE_FORENSICS_REPAIR_PLAN.md`

**Next Step:** Start Phase 1 merge with user approval
