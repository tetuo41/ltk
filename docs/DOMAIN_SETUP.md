# Domain Setup Guide: ltk-sbb.shiai.games

This guide explains how to set up the custom domain `ltk-sbb.shiai.games` using Netlify DNS delegation.

## 🌐 Overview

- **Primary Domain**: shiai.games (managed at お名前.com)
- **Subdomain**: ltk-sbb.shiai.games
- **DNS Provider**: Netlify DNS
- **Hosting**: Netlify
- **SSL**: Automatic HTTPS via Netlify

## 📋 Step-by-Step Setup

### 1. お名前.com DNS Delegation

1. Login to **お名前.com Navi**
2. Go to **ドメイン設定** → **DNS関連機能の設定**
3. Select **shiai.games**
4. **ネームサーバーの変更** → **他のネームサーバーを利用**
5. Set Netlify DNS servers:
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```

### 2. Automated Setup with CLI

Run the automated setup script:

```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Run automated domain setup
pnpm run domain:setup
```

### 3. Manual Netlify Configuration

If you prefer manual setup:

1. **Netlify Dashboard** → **Domains**
2. **Add or register domain** → **I already own this domain**
3. Enter `shiai.games`
4. **Verify domain ownership**
5. **Add subdomain**: `ltk-sbb.shiai.games`
6. **Site settings** → **Domain management** → **Custom domains**

### 4. DNS Records Setup

The following DNS records will be created automatically:

```toml
# A record for root domain
Type: A
Name: @
Value: 75.2.60.5
TTL: 300

# CNAME for subdomain
Type: CNAME
Name: ltk-sbb
Value: ltk-fansite.netlify.app
TTL: 300
```

## 🔧 Infrastructure as Code

### Netlify CLI Commands

```bash
# Check DNS status
pnpm run domain:status

# List all DNS records
netlify api listDnsRecords --zone=shiai.games

# Add new DNS record
netlify api createDnsRecord --data '{
  "zone_id": "shiai.games",
  "type": "CNAME",
  "name": "subdomain",
  "value": "target.netlify.app",
  "ttl": 300
}'
```

### Configuration Files

- **netlify.toml**: Netlify build and domain configuration
- **netlify-dns.toml**: DNS zone documentation
- **scripts/setup-domain.sh**: Automated setup script

## 🔍 Verification Steps

### 1. DNS Propagation Check

```bash
# Check nameservers
dig NS shiai.games

# Check subdomain resolution
dig ltk-sbb.shiai.games

# Check from different locations
nslookup ltk-sbb.shiai.games 8.8.8.8
```

### 2. SSL Certificate

- Netlify automatically provisions SSL certificates
- HTTPS will be available within 24 hours
- HTTP automatically redirects to HTTPS

### 3. Site Access

Test the following URLs:
- https://ltk-sbb.shiai.games ✅
- http://ltk-sbb.shiai.games → redirects to HTTPS
- https://ltk-fansite.netlify.app (backup URL)

## 🚨 Troubleshooting

### Common Issues

**DNS Not Resolving**:
- Wait 24-48 hours for full propagation
- Clear DNS cache: `sudo systemctl flush-dns`
- Check with multiple DNS servers

**SSL Certificate Issues**:
- Ensure DNS is properly configured
- Wait for automatic certificate provisioning
- Check Netlify site settings

**Subdomain Not Working**:
- Verify CNAME record points to correct Netlify site
- Check domain spelling and configuration

### Debug Commands

```bash
# Check current DNS status
pnpm run domain:status

# Test domain resolution
curl -I https://ltk-sbb.shiai.games

# Check SSL certificate
openssl s_client -connect ltk-sbb.shiai.games:443 -servername ltk-sbb.shiai.games
```

## 📚 Additional Resources

- [Netlify DNS Documentation](https://docs.netlify.com/domains-https/netlify-dns/)
- [お名前.com DNS Settings](https://help.onamae.com/answer/7883)
- [DNS Propagation Checker](https://www.whatsmydns.net/)

## 🔄 Future Automation

For full Infrastructure as Code:

1. **Terraform Provider**: Use Netlify Terraform provider
2. **GitHub Actions**: Automate DNS updates on deployment
3. **Environment Variables**: Store API keys securely
4. **Monitoring**: Set up DNS monitoring and alerts