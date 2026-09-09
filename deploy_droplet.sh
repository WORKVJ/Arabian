#!/bin/bash
# ==============================================================================
# Arabian Gratings - Complete Droplet Setup Script
# Ubuntu 24.04 (Frontend Next.js + Backend Django + Nginx)
# ==============================================================================

set -e

echo ">>> [1/6] Setting up 2GB Swap Memory for smooth builds..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "Swap created successfully."
else
    echo "Swap already exists."
fi

echo ">>> [2/6] Updating system packages & installing Node.js, Python, Nginx..."
apt-get update -y
apt-get install -y curl git nginx python3 python3-pip python3-venv build-essential libpq-dev

# Install Node.js 20 LTS
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install -g pm2

echo ">>> [3/6] Cloning Arabian Gratings repository..."
mkdir -p /var/www/arabian
cd /var/www/arabian

if [ -d "/var/www/arabian/Arabian_gratings" ]; then
    cd /var/www/arabian/Arabian_gratings
    git pull origin main
else
    git clone https://github.com/WORKVJ/Arabian.git /var/www/arabian/Arabian_gratings
    cd /var/www/arabian/Arabian_gratings
fi

echo ">>> [4/6] Setting up Django Backend..."
cd /var/www/arabian/Arabian_gratings/backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations and seed data
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python seed_products.py

# Create systemd service for Gunicorn
cat << 'EOF' > /etc/systemd/system/arabian-backend.service
[Unit]
Description=Gunicorn daemon for Arabian Gratings Backend
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/arabian/Arabian_gratings/backend
ExecStart=/var/www/arabian/Arabian_gratings/backend/venv/bin/gunicorn \
          --workers 2 \
          --bind 127.0.0.1:8000 \
          --timeout 120 \
          config.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable arabian-backend
systemctl restart arabian-backend

echo ">>> [5/6] Setting up Next.js Frontend..."
cd /var/www/arabian/Arabian_gratings/frontend

cat << 'EOF' > .env.production
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NODE_ENV=production
EOF

npm install --legacy-peer-deps
npm run build

pm2 delete arabian-frontend 2>/dev/null || true
pm2 start npm --name "arabian-frontend" -- start -- -p 3000
pm2 save
pm2 startup systemd -u root --hp /root || true

echo ">>> [6/6] Configuring Nginx Web Server..."
cat << 'EOF' > /etc/nginx/sites-available/arabian
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 50M;

    # Media uploads
    location /media/ {
        alias /var/www/arabian/Arabian_gratings/backend/media/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Django static files
    location /django_static/ {
        alias /var/www/arabian/Arabian_gratings/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Django API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Next.js Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/arabian /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

echo "=============================================================================="
echo ">>> SUCCESS! Arabian Gratings is now LIVE on your Droplet!"
echo ">>> Frontend: http://$(curl -s ifconfig.me)"
echo ">>> Backend API: http://$(curl -s ifconfig.me)/api/"
echo ">>> Django Admin: http://$(curl -s ifconfig.me)/admin/"
echo "=============================================================================="
