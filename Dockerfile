# Gunakan Node.js versi LTS
FROM node:16

# Tetapkan direktori kerja di container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin semua kode aplikasi
COPY . .

# Ekspose port aplikasi
EXPOSE 8080

# Jalankan aplikasi
CMD ["npm", "start"]