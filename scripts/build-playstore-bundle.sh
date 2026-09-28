#!/usr/bin/env bash
# ==============================================================================
# NEXORA AI — Google Play Store & Android APK Builder Script
# Using Google's Official Bubblewrap CLI (Trusted Web Activity)
# ==============================================================================

set -e

echo "=========================================================="
echo "  NEXORA AI — Google Play Store & Android APK Bundler     "
echo "  Author: Alakh Shukla                                    "
echo "=========================================================="

MANIFEST_URL="https://ais-dev-bgl2gyeaiqntktnyu37xr7-417602105349.asia-east1.run.app/manifest.webmanifest"
PACKAGE_ID="com.alakh.nexora"

# Check Node.js and Java JDK
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install Node.js."
    exit 1
fi

echo "📦 Step 1: Installing Google Bubblewrap CLI..."
npm install -g @bubblewrap/cli

echo "🚀 Step 2: Validating TWA Manifest..."
if [ -f "twa-manifest.json" ]; then
    echo "✓ Found twa-manifest.json configuration."
else
    echo "Initializing new TWA manifest from: $MANIFEST_URL"
    bubblewrap init --manifest="$MANIFEST_URL"
fi

echo "🔨 Step 3: Building Google Play Store Android App Bundle (.aab) & APK..."
bubblewrap build

echo "=========================================================="
echo "🎉 Build Complete!"
echo "Outputs generated:"
echo "  1. app-release-bundle.aab (Upload this to Google Play Console)"
echo "  2. app-release-signed.apk (Direct installation on Android devices)"
echo "=========================================================="
