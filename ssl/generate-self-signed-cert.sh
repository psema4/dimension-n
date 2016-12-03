#!/usr/bin/env bash
echo "generating self-signed certificate for non-production environments..."
openssl req -new -newkey rsa:2048 -sha256 -days 365 -nodes -x509 -keyout server.key -out server.crt
