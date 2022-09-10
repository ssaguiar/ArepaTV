#!/bin/sh

echo 'creando servicio de arepatv'
cp ./arepatv.service /lib/systemd/system/arepatv.service
cp ./nginx.config /etc/nginx/sites-available/default

echo 'recargando servicios'
systemctl daemon-reload

echo 'iniciando nginx'
systemctl restart nginx
systemctl enable nginx

echo 'iniciando arepatv'
systemctl restart arepatv
systemctl enable arepatv
