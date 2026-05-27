FROM python:3.11-slim

# System deps for mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps before copying source (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Collect static files (whitenoise serves them)
RUN DJANGO_SETTINGS_MODULE=config.settings.production \
    SECRET_KEY=build-placeholder \
    DB_NAME=placeholder DB_USER=placeholder DB_PASSWORD=placeholder \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "2", \
     "--threads", "2", \
     "--worker-class", "gthread", \
     "--timeout", "60", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
