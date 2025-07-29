#!/bin/bash

# Netlify DNS Setup Script for shiai.games domain
# This script automates the domain configuration using Netlify CLI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="shiai.games"
SUBDOMAIN="ltk-sbb.shiai.games"
NETLIFY_SITE_NAME="ltk-fansite"

echo -e "${GREEN}🌐 Setting up DNS for ${DOMAIN}${NC}"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

# Login to Netlify (if not already logged in)
echo -e "${YELLOW}🔐 Checking Netlify authentication...${NC}"
netlify status || netlify login

# Create DNS zone for the domain
echo -e "${YELLOW}📋 Creating DNS zone for ${DOMAIN}...${NC}"
netlify api createDnsZone --data '{"name": "'${DOMAIN}'"}' || echo "DNS zone may already exist"

# Add DNS records
echo -e "${YELLOW}📝 Adding DNS records...${NC}"

# A record for subdomain pointing to Netlify
netlify api createDnsRecord --data '{
  "zone_id": "'${DOMAIN}'",
  "type": "CNAME",
  "name": "ltk-sbb",
  "value": "'${NETLIFY_SITE_NAME}'.netlify.app",
  "ttl": 300
}' || echo "Record may already exist"

# Root domain A record
netlify api createDnsRecord --data '{
  "zone_id": "'${DOMAIN}'",
  "type": "A",
  "name": "",
  "value": "75.2.60.5",
  "ttl": 300
}' || echo "Record may already exist"

echo -e "${GREEN}✅ DNS setup complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "1. Update お名前.com nameservers to Netlify DNS"
echo -e "2. Add custom domain to Netlify site"
echo -e "3. Enable HTTPS certificate"

echo -e "${YELLOW}🔧 Netlify DNS Nameservers:${NC}"
echo -e "dns1.p03.nsone.net"
echo -e "dns2.p03.nsone.net" 
echo -e "dns3.p03.nsone.net"
echo -e "dns4.p03.nsone.net"