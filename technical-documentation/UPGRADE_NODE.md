# Node.js Upgrade Guide for Vision CRM

## Current Issue

You're using **Node.js 18.19.1**, but Vite 7.2.4 requires **Node.js 20.19+ or 22.12+**.

Error: `crypto.hash is not a function`

## Solution: Upgrade to Node.js 22

### Method 1: Using NVM (Recommended)

```bash
# Check if you have nvm installed
nvm --version

# If not installed, install nvm first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Close and reopen terminal, then:
nvm install 22
nvm use 22
nvm alias default 22

# Verify
node -v  # Should show v22.x.x
```

### Method 2: Ubuntu APT (Alternative)

```bash
# Add NodeSource repository for Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js 22
sudo apt-get install -y nodejs

# Verify
node -v  # Should show v22.x.x
npm -v
```

### Method 3: Direct Download

```bash
# Download Node.js 22 LTS
wget https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz

# Extract
tar -xf node-v22.12.0-linux-x64.tar.xz

# Move to /usr/local
sudo mv node-v22.12.0-linux-x64 /usr/local/node-22

# Update PATH in ~/.bashrc
echo 'export PATH=/usr/local/node-22/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
node -v
```

## After Upgrading

```bash
# Navigate to project
cd ~/vision

# Reinstall node_modules with new Node version
rm -rf node_modules package-lock.json
npm install

# Do the same for backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Try build again
npm run build
```

## Quick Test Commands

```bash
# Check current Node.js version
node -v

# Check npm version
npm -v

# Check if nvm is available
nvm --version

# List all Node.js versions (if using nvm)
nvm list
```

## Why This Error Occurs

- **Vite 7.x** uses modern Node.js crypto APIs
- **@vitejs/plugin-vue 6.x** calls `crypto.hash()` which was added in Node.js 20
- **Node.js 18** doesn't have this function, causing the build to fail

## Verification After Fix

After upgrading Node.js, run:

```bash
node -v  # Should be 20.19+ or 22.x
npm run build  # Should build successfully
```

Expected successful output:
```
vite v7.2.4 building for production...
✓ XX modules transformed.
dist/index.html                   X.XX kB │ gzip: X.XX kB
dist/assets/index-XXXXX.css      XX.XX kB │ gzip: XX.XX kB
dist/assets/index-XXXXX.js      XXX.XX kB │ gzip: XX.XX kB
✓ built in XXms
```
