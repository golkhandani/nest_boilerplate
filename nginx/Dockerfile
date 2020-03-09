
FROM nginx:latest
COPY fullchain.pem /etc/nginx/ssl/
COPY privkey.pem /etc/nginx/ssl/
COPY default.conf /etc/nginx/conf.d/
COPY gzip.conf /etc/nginx/conf.d/