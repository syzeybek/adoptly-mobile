# 1. Aşama: Uygulamayı Web formatında derlemek (Build)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Expo projesini statik bir web sitesi olarak (dist klasörüne) çıkar
RUN npx expo export -p web

# 🚨 SİHİRLİ DOKUNUŞ: Tailwind Sözlüğünü (CDN) ve Tam Ekran Yamasını HTML'in içine zorla gömüyoruz
RUN sed -i 's|<head>|<head><script src="https://cdn.tailwindcss.com"></script><style>html, body, #root { height: 100vh; width: 100%; display: flex; flex-direction: column; overflow-x: hidden; }</style>|g' dist/index.html

# 2. Aşama: Üretilen web sitesini Nginx ile yayınlamak
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]