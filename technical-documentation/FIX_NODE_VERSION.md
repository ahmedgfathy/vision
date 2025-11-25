# 🚀 URGENT: Fix Node.js Version for Vision CRM Build

## Current Problem
- **Your Node.js**: v18.19.1 ❌
- **Required**: v20.19+ or v22.12+ ✅
- **Status**: Build WILL FAIL until you upgrade

## ⚡ Quick Fix Steps

Run these commands in your WSL Ubuntu terminal:

### Step 1: Check if NVM is installed

```bash
nvm --version
```

**If NVM is installed** (shows a version number), go to **Option A**.  
**If command not found**, go to **Option B**.

---

## Option A: Using NVM (If you have it)

```bash
# Install Node.js 22
nvm install 22

# Use Node.js 22
nvm use 22

# Set as default
nvm alias default 22

# Verify (should show v22.x.x)
node -v

# Now rebuild
cd ~/vision
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Option B: Install NVM First (Recommended)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Close and reopen your terminal, OR run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verify NVM installed
nvm --version

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node -v  # Should show v22.x.x

# Rebuild project
cd ~/vision
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Option C: Using Ubuntu APT (Alternative)

```bash
# Remove old Node.js
sudo apt-get remove nodejs npm

# Add NodeSource repository for Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js 22
sudo apt-get install -y nodejs

# Verify
node -v  # Should show v22.x.x
npm -v

# Rebuild project
cd ~/vision
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Option D: Manual Download (Last Resort)

```bash
# Download Node.js 22 LTS
cd /tmp
wget https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz

# Extract
tar -xf node-v22.12.0-linux-x64.tar.xz

# Install to /usr/local
sudo mkdir -p /usr/local/lib/nodejs
sudo mv node-v22.12.0-linux-x64 /usr/local/lib/nodejs/node-22

# Update PATH
echo 'export PATH=/usr/local/lib/nodejs/node-22/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
node -v  # Should show v22.12.0

# Rebuild project
cd ~/vision
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## ✅ Verification After Upgrade

After upgrading, run:

```bash
# Check Node.js version
node -v
# Expected: v22.x.x or v20.19+

# Check npm version
npm -v
# Expected: v10.x.x or higher

# Try build again
cd ~/vision
npm run build
```

**Expected SUCCESS output:**
```
vite v7.2.4 building for production...
✓ XX modules transformed.
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.css      XX.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB
✓ built in XXms
```

---

## 🎯 My Recommendation

**Use Option B (NVM)** - it's the best way to manage Node.js versions and switch between them easily.

---

## Common Issues

### "nvm: command not found" after installation
```bash
# Add NVM to your shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Or restart your terminal
```

### Still showing old Node version after NVM install
```bash
# Make sure you ran:
nvm use 22
nvm alias default 22

# Check which Node is being used:
which node
# Should show: /home/xinreal/.nvm/versions/node/vXX.X.X/bin/node
```

### Permission errors with NPM
```bash
# If using NVM, you shouldn't need sudo
# If you do, reinstall with NVM (Option B)
```

---

## Why This Is Required

- **Vite 7.x** uses `crypto.hash()` API added in Node.js 20
- **@vitejs/plugin-vue 6.x** requires Node.js 20.19+
- **Node.js 18** is missing these APIs
- **No workaround** - you MUST upgrade Node.js

---

## After Successful Upgrade

Once Node.js is upgraded:

1. ✅ Build will succeed: `npm run build`
2. ✅ Dev server will work: `npm run dev`
3. ✅ All Vite features available
4. ✅ Backend unaffected (uses its own dependencies)

Backend still runs separately:
```bash
cd ~/vision/backend
npm install
npm run dev
```

---

**Choose ONE option above and follow it completely. After upgrading Node.js, your build will work!**
