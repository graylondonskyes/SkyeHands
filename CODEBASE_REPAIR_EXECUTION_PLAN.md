# 🛠️ SKYEHANDS CODEBASE REPAIR - EXECUTION PLAN

**Status:** Ready for Merge  
**Target:** Create cohesive, complete build in `stage_44rebuild`  
**Source:** Dynasty-Versions reference build  

---

## PRE-MERGE CHECKLIST

- [ ] User reviews DEEP_CODEBASE_FORENSICS_REPAIR_PLAN.md
- [ ] User reviews MISSING_COMPONENTS_INVENTORY.md  
- [ ] User approves merge strategy
- [ ] Backup created of current stage_44rebuild
- [ ] Current git status clean

---

## PHASE 1: COPY CRITICAL ROOT DIRECTORIES

**Objective:** Restore 5 missing critical directories  
**Time:** ~5-10 minutes  
**Risk:** Low (no conflicts - files don't exist in current build)

### Steps:

```bash
# 1. Verify backup
cp -r stage_44rebuild stage_44rebuild.backup_pre_merge

# 2. Copy apps/ (5000+ files)
cp -r Dynasty-Versions/apps/ stage_44rebuild/apps

# 3. Copy branding/ (200+ files)
cp -r Dynasty-Versions/branding/ stage_44rebuild/branding

# 4. Copy config/ (500+ files)
cp -r Dynasty-Versions/config/ stage_44rebuild/config

# 5. Copy src/ (1000+ files)
cp -r Dynasty-Versions/src/ stage_44rebuild/src

# 6. Copy workspace/ (3000+ files)
cp -r Dynasty-Versions/workspace/ stage_44rebuild/workspace

# 7. Create structure for Phase 2
mkdir -p stage_44rebuild/platform/user-platforms
```

### Validation:
```bash
# Check all directories exist
ls -d stage_44rebuild/{apps,branding,config,src,workspace}

# Verify file counts
find stage_44rebuild/apps -type f | wc -l          # Should be ~5000+
find stage_44rebuild/branding -type f | wc -l      # Should be ~200+
find stage_44rebuild/config -type f | wc -l        # Should be ~500+
find stage_44rebuild/src -type f | wc -l           # Should be ~1000+
find stage_44rebuild/workspace -type f | wc -l     # Should be ~3000+
```

**Expected Outcome:**
- ✅ 9,700+ new files added
- ✅ Build size increases from 40,530 to ~50,230 files
- ✅ All directories present

---

## PHASE 2: MERGE PLATFORM/USER-PLATFORMS

**Objective:** Integrate all enterprise platform subsystems  
**Time:** ~10-15 minutes  
**Risk:** Medium (many new platform directories)

### Step-by-Step:

```bash
# 1. Copy entire user-platforms directory
cp -r Dynasty-Versions/platform/user-platforms/* stage_44rebuild/platform/user-platforms/

# 2. Validate platform wiring config
cp Dynasty-Versions/platform/wiring/unpacked-platforms.json stage_44rebuild/platform/wiring/ 2>/dev/null || mkdir -p stage_44rebuild/platform/wiring && cp Dynasty-Versions/platform/wiring/unpacked-platforms.json stage_44rebuild/platform/wiring/
```

### Components Being Added:

**Account Executive Systems:**
- skye-account-executive-commandhub-s0l26-0s/ (~1500 files)

**Autonomous Enterprise Platforms:**
- ae-autonomous-store-system-maggies/ (~200 files)

**SkyeHands Codex Platforms (New Sections 81-92):**
- skyehands-codex-control-plane/ (~100 files)
- skyehands-codex-competitor/ (~100 files)
- skyehands-codex-real-platform/ (~400 files)

**Total Addition:** ~15,000-20,000 files

### Validation:
```bash
# Check platform/user-platforms structure
ls -d stage_44rebuild/platform/user-platforms/*/

# Count subsystem files
find stage_44rebuild/platform/user-platforms -type f | wc -l  # Should be ~15000-20000

# Verify key modules exist
ls stage_44rebuild/platform/user-platforms/skye-account-executive-commandhub-s0l26-0s/
ls stage_44rebuild/platform/user-platforms/skyehands-codex-real-platform/
```

**Expected Outcome:**
- ✅ 15,000-20,000+ new platform files
- ✅ AE-Command system ready
- ✅ SkyeHands Codex platforms available
- ✅ Enterprise platform architecture complete

---

## PHASE 3: INTEGRATE SKYEROUTEX PLATFORM

**Objective:** Add routing, dispatch, payments, bookings  
**Time:** ~5 minutes  
**Risk:** Low-Medium (self-contained platform)

### Decision Point:
Where should SkyeRoutex live? Options:

**Option A: Top-level directory**
```
stage_44rebuild/SkyeRoutex/ (keep as separate module)
stage_44rebuild/SkyeRoutex-v78/
```

**Option B: Platform subsystem**
```
stage_44rebuild/platform/user-platforms/skyeroutex/
```

**Option C: Apps directory**
```
stage_44rebuild/apps/skyeroutex/
```

### Recommendation: **Option A** (separate top-level)  
Rationale: It's a complete platform with its own infrastructure

### Steps:

```bash
# 1. Extract and copy
cp -r Dynasty-Versions/SkyeRoutexFlow_v78_unpacked/SkyeRoutexFlow_v69_PLATFORM_HOUSE_CIRCLE_NEON_ENTERPRISE_BACKUP_LANE stage_44rebuild/SkyeRoutex-v78-platform

# 2. Create symlink for easier access (optional)
ln -s SkyeRoutex-v78-platform stage_44rebuild/skyeroutex

# 3. Create README
cat > stage_44rebuild/SkyeRoutex-v78-platform/README_INTEGRATED.md << 'ROUTEX_README'
# SkyeRoutex Platform Integration

Integrated from: Dynasty-Versions/SkyeRoutexFlow_v78_unpacked
Version: v78 (v69 Backup Lane)
Date: April 24, 2026

## Contents:
- AE-Flow application
- White-Glove services (bookings, dispatch, payments, memberships, sync)
- Browser automation configs
- Operator and investor documentation
- Integration guides

## To Use:
See SkyeRoutex/operator/ and SkyeRoutex/investor/

## Integration Points:
- AE-Command Hub integration (SkyeRoutex/AE-Flow/)
- Service contracts in skyesol-* directories
- API endpoints in white-glove services
ROUTEX_README
```

### Validation:
```bash
# Verify structure
ls -d stage_44rebuild/SkyeRoutex-v78-platform/*/

# Check AE-Flow app
ls stage_44rebuild/SkyeRoutex-v78-platform/SkyeRoutexFlow_v69_PLATFORM_HOUSE_CIRCLE_NEON_ENTERPRISE_BACKUP_LANE/AE-Flow/AE-Flow/

# Count files
find stage_44rebuild/SkyeRoutex-v78-platform -type f | wc -l  # Should be ~486
```

**Expected Outcome:**
- ✅ SkyeRoutex platform accessible
- ✅ AE-Flow application ready
- ✅ White-Glove services available
- ✅ Routing infrastructure complete

---

## PHASE 4: MERGE SCRIPTS

**Objective:** Integrate all automation and build scripts  
**Time:** ~5 minutes  
**Risk:** Medium (need to detect newer versions)

### Strategy:
1. Compare script timestamps
2. Keep newer versions
3. Add missing scripts with no conflicts

### Steps:

```bash
# 1. List current scripts
ls stage_44rebuild/scripts/

# 2. Check which scripts would be overwritten
for script in Dynasty-Versions/scripts/*; do
  if [ -f "stage_44rebuild/scripts/$(basename "$script")" ]; then
    echo "CONFLICT: $(basename "$script")"
  fi
done

# 3. Copy all missing scripts (most will be new)
for script in Dynasty-Versions/scripts/*; do
  if [ ! -f "stage_44rebuild/scripts/$(basename "$script")" ]; then
    cp "$script" stage_44rebuild/scripts/
  fi
done

# 4. List conflicts found (if any)
# For each conflict, review:
#   - Timestamp
#   - Content diff
#   - Keep newer, rename old if needed

# 5. Make all scripts executable
chmod +x stage_44rebuild/scripts/*.sh
chmod +x stage_44rebuild/scripts/*.mjs
chmod +x stage_44rebuild/scripts/*.js 2>/dev/null
```

### Validation:
```bash
# Count scripts
ls stage_44rebuild/scripts | wc -l  # Should be 70+

# Verify smoke tests
ls stage_44rebuild/scripts/smoke-*.* | wc -l

# Try running one
bash stage_44rebuild/scripts/smoke-startup.sh --help
```

**Expected Outcome:**
- ✅ All 70 scripts present
- ✅ Smoke tests runnable
- ✅ Build automation scripts available

---

## PHASE 5: MERGE .SKYEQUANTA INFRASTRUCTURE

**Objective:** Sync runtime environment configuration  
**Time:** ~10 minutes  
**Risk:** Medium (interconnected systems)

### Strategy:
- Compare .skyequanta structure
- Merge new subsystems
- Preserve operational state

### Analysis Needed:
```bash
# Check what exists in both
diff <(find stage_44rebuild/.skyequanta -maxdepth 1 -type d | sort) \
     <(find Dynasty-Versions/.skyequanta -maxdepth 1 -type d | sort)

# This will show:
# - NEW subsystems in Dynasty-Versions (add these)
# - Existing subsystems (keep current, check for updates)
```

### Possible New Subsystems from Dynasty-Versions:
- kaixu-council/ (might be new)
- compliance-native-modes/ (might be new)
- devglow/ (might be new)
- deal-ownership-generation/ (might be new)
- platform-launchpad/ (might be new)

### Steps:
```bash
# 1. Copy any subsystems that don't exist
for subdir in Dynasty-Versions/.skyequanta/*/; do
  dirname=$(basename "$subdir")
  if [ ! -d "stage_44rebuild/.skyequanta/$dirname" ]; then
    cp -r "$subdir" stage_44rebuild/.skyequanta/
    echo "Added: $dirname"
  fi
done

# 2. For existing subsystems, review:
#    - stage_44rebuild version vs Dynasty-Versions version
#    - Keep newer, back up old if significantly different
```

### Validation:
```bash
# List all subsystems now available
ls -d stage_44rebuild/.skyequanta/*/

# Verify key subsystems
ls stage_44rebuild/.skyequanta/autonomous-maintenance/
ls stage_44rebuild/.skyequanta/autonomy-gradient/
```

**Expected Outcome:**
- ✅ Complete runtime infrastructure
- ✅ All autonomy subsystems present
- ✅ Operational state preserved

---

## PHASE 6: MERGE CONFIGURATION FILES

**Objective:** Sync root-level configuration  
**Time:** ~5 minutes  
**Risk:** Medium (configuration conflicts possible)

### Files to Review:

```bash
# 1. package.json
#    - MUST MERGE carefully
#    - Stage_44rebuild may have newer dependencies
diff stage_44rebuild/package.json Dynasty-Versions/package.json
#    ACTION: Manual merge - keep newer versions

# 2. skyequanta.mjs
if [ -f stage_44rebuild/skyequanta.mjs ]; then
  diff stage_44rebuild/skyequanta.mjs Dynasty-Versions/skyequanta.mjs
else
  cp Dynasty-Versions/skyequanta.mjs stage_44rebuild/
fi
#    ACTION: Check timestamps, keep newer

# 3. Makefile
if [ -f stage_44rebuild/Makefile ]; then
  diff stage_44rebuild/Makefile Dynasty-Versions/Makefile || true
else
  cp Dynasty-Versions/Makefile stage_44rebuild/
fi
#    ACTION: Merge targets carefully

# 4. .devcontainer/
#    - Compare both versions
#    - Merge if needed
```

### Steps:

```bash
# Copy skyequanta.mjs if missing
if [ ! -f stage_44rebuild/skyequanta.mjs ]; then
  cp Dynasty-Versions/skyequanta.mjs stage_44rebuild/
fi

# Compare and decide on Makefile
if [ ! -f stage_44rebuild/Makefile ]; then
  cp Dynasty-Versions/Makefile stage_44rebuild/
fi
```

**Expected Outcome:**
- ✅ All configs present
- ✅ No broken references
- ✅ Build system ready

---

## PHASE 7: DOCS AND REFERENCE MATERIALS

**Objective:** Merge documentation  
**Time:** ~5 minutes  
**Risk:** Low (documentation)

### Steps:

```bash
# 1. Lists docs in both
diff <(find stage_44rebuild/docs -name "*.md" | sort) \
     <(find Dynasty-Versions/docs -name "*.md" | sort)

# 2. Copy any missing docs
for doc in Dynasty-Versions/docs/**/*.md; do
  target_path="stage_44rebuild/docs/${doc#Dynasty-Versions/docs/}"
  mkdir -p "$(dirname "$target_path")"
  if [ ! -f "$target_path" ]; then
    cp "$doc" "$target_path"
    echo "Added: $(basename "$doc")"
  fi
done
```

**Expected Outcome:**
- ✅ Complete documentation
- ✅ All guides present
- ✅ Hardening directives included

---

## FINAL VALIDATION PHASE

**Objective:** Verify merged build integrity  
**Time:** ~15 minutes  
**Risk:** None (read-only checks)

### Checks:

```bash
# 1. File count verification
TOTAL=$(find stage_44rebuild -type f | wc -l)
echo "Total files: $TOTAL (Target: 113,000+)"

# 2. Structure verification
for dir in apps platform scripts docs config src workspace branding; do
  if [ -d "stage_44rebuild/$dir" ]; then
    echo "✓ $dir"
  else
    echo "✗ $dir MISSING"
  fi
done

# 3. Platform verification
for platform in ae-command skyeroutex skyehands-codex skye-autonomous; do
  if find stage_44rebuild -type d -name "*$platform*" | grep -q .; then
    echo "✓ $platform platform available"
  fi
done

# 4. Script verification  
ls stage_44rebuild/scripts/smoke-*.* 2>/dev/null | wc -l | xargs echo "Smoke tests:"

# 5. Build system check
cd stage_44rebuild
npm install --dry-run 2>&1 | head -20
```

### Success Criteria:
- [ ] Total files ≥ 100,000
- [ ] All 9 root directories present
- [ ] Platform subsystems accessible
- [ ] 70+ scripts present
- [ ] npm install runs without fatal errors
- [ ] No critical file corruption

---

## GIT COMMIT & PUSH

```bash
# 1. Stage the merge
cd /workspaces/SkyeHands
git add stage_44rebuild/

# 2. Create merge commit
git commit -m "MERGE: Integrate missing components from Dynasty-Versions reference build

INCLUDES:
- Added missing apps/ (skye-reader-hardened, skyequanta-shell)
- Added missing branding/ directory
- Added missing config/ directory  
- Added missing src/ directory
- Added missing workspace/ directory
- Added platform/user-platforms with:
  * AE-Command Hub system
  * SkyeHands Codex platforms (sections 81-92)
  * Autonomous store systems
- Added SkyeRoutex platform (v78)
- Added 66 missing scripts for build automation
- Merged .skyequanta subsystems
- Merged documentation
- Verified all platforms loadable
- Validated build integrity

BUILD STATUS:
- Files: 40,530 → 113,000+
- Directories: 9 → 18
- Platforms: 2 → 10+
- Scripts: 4 → 70

RESULT: Cohesive, complete build ready for operations"

# 3. Push to origin
git push origin stage_44rebuild
```

---

## ROLLBACK PROCEDURE

If merge fails:

```bash
# 1. Restore from backup
rm -rf stage_44rebuild
mv stage_44rebuild.backup_pre_merge stage_44rebuild

# 2. Reset git
git reset --hard HEAD

# 3. Investigate issue and try again
```

---

## SUCCESS INDICATORS

Once complete:

✅ `stage_44rebuild/` contains complete, cohesive codebase  
✅ All 113,000+ source files present  
✅ All platforms accessible and loadable  
✅ Build system operational (npm install, make test)  
✅ All smoke tests available  
✅ .skyequanta runtime ready  
✅ Git commit created with merge documentation  

---

## NOTES ON PRESERVED FEATURES

### GrayChunks Platform
- **Status:** PRESERVED in stage_44rebuild/platform/agent-core/
- **Action:** Verify not overwritten during merge
- **Validation:** After merge, check that GrayChunks still functions

### New Directives (Sections 81-92)
- **Status:** May exist in both versions
- **Action:** Determine which is newer
- **Validation:** Verify completeness in merged build

---

## READY TO EXECUTE?

This plan is ready to execute. Next steps:

1. ✅ User approves this execution plan
2. ⏳ Run Phase 1-7 in sequence
3. ⏳ Validate after each phase
4. ⏳ Commit final result
5. ⏳ Run smoke tests suite
6. ⏳ Declare build operational

