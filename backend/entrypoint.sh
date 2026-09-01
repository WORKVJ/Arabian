#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Collecting static files..."
# Collect static files (writes to S3 if configured, or local staticfiles directory)
python manage.py collectstatic --noinput

echo "Starting Gunicorn server on port 8000..."
# Start Gunicorn server (bind to port 8000, 3 worker processes)
exec gunicorn config.wsgi:application \
    --name arabiangratings_api \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --log-level=info \
    --access-logfile - \
    --error-logfile -
