FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for caching
COPY composer.json composer.lock* ./

# Install dependencies (if composer.lock exists)
RUN if [ -f composer.lock ]; then composer install --no-scripts --no-autoloader; fi

# Copy application code
COPY . .

# Generate autoloader
RUN if [ -f composer.json ]; then composer dump-autoload --optimize; fi

# Expose port
EXPOSE 8000

# Start Symfony dev server
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]
