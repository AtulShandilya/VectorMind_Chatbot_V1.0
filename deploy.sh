#!/bin/bash

# Build script for deploying Next.js static export with nginx

echo "Building Next.js static export..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Static files are in the 'out' directory"
    echo ""
    echo "To deploy with nginx:"
    echo "1. Copy the 'out' directory to your server"
    echo "2. Update nginx.conf with the correct path"
    echo "3. Copy nginx.conf to /etc/nginx/sites-available/chat"
    echo "4. Create symlink: sudo ln -s /etc/nginx/sites-available/chat /etc/nginx/sites-enabled/"
    echo "5. Test nginx: sudo nginx -t"
    echo "6. Reload nginx: sudo systemctl reload nginx"
else
    echo "Build failed!"
    exit 1
fi

