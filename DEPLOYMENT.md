# CTF Challenge Deployment Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run setup

# 3. Start server
npm start
```

The challenge will be available at `http://localhost:3000`

## Production Deployment

### Environment Variables
```bash
export PORT=3000
export FLAG_REAL="flag{IN_FRONT_OF_FOUNTAIN}"
export NODE_ENV="production"
```

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "ctf-challenge"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run setup
EXPOSE 3000
CMD ["npm", "start"]
```

### Using systemd (Linux)
```ini
[Unit]
Description=CTF Challenge Server
After=network.target

[Service]
Type=simple
User=ctf
WorkingDirectory=/opt/ctf-challenge
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=FLAG_REAL=flag{IN_FRONT_OF_FOUNTAIN}

[Install]
WantedBy=multi-user.target
```

## Security Considerations

1. **Rate Limiting**: Already implemented (50 login attempts per 15 minutes)
2. **Logging**: All requests are logged with IP and User-Agent
3. **Input Validation**: Minimal validation to maintain vulnerability
4. **Database**: SQLite file should be backed up regularly
5. **File Permissions**: Ensure proper permissions on sensitive files

## Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Log Monitoring
```bash
# View logs
tail -f /var/log/ctf-challenge.log

# Monitor failed attempts
grep "FAILED" /var/log/ctf-challenge.log
```

### Database Backup
```bash
# Backup database
cp ctf.db ctf.db.backup.$(date +%Y%m%d_%H%M%S)

# Restore database
cp ctf.db.backup.YYYYMMDD_HHMMSS ctf.db
```

## Troubleshooting

### Server Won't Start
1. Check if port 3000 is available: `netstat -tulpn | grep :3000`
2. Check Node.js version: `node --version`
3. Check dependencies: `npm list`
4. Check database: `ls -la ctf.db`

### SQL Injection Not Working
1. Verify the vulnerability is present in server.js
2. Check database has the secrets table
3. Test with: `username=foo' UNION SELECT 1, note, 'admin' FROM secrets --`

### Stego Image Issues
1. Verify image exists: `ls -la public/assets/inspect.png`
2. Check payload: `strings public/assets/inspect.png | grep FINAL_FLAG`
3. Recreate if needed: `node embed-stego.js`

### Flag Submission Issues
1. Check environment variable: `echo $FLAG_REAL`
2. Verify flag format: `flag{IN_FRONT_OF_FOUNTAIN}`
3. Check server logs for submission attempts

## Performance Tuning

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_secrets_owner ON secrets(owner);
```

### Memory Management
- Monitor memory usage with `pm2 monit`
- Restart server if memory usage is high
- Consider using connection pooling for high traffic

## Backup Strategy

1. **Database**: Daily automated backup
2. **Code**: Version control with Git
3. **Logs**: Rotate logs weekly
4. **Images**: Backup stego image separately

## Scaling

For high-traffic scenarios:
1. Use a load balancer (nginx, HAProxy)
2. Deploy multiple instances
3. Use Redis for session storage
4. Implement database clustering

## Maintenance

### Regular Tasks
- Monitor server logs
- Check disk space
- Update dependencies monthly
- Backup database daily
- Review failed attempts

### Updates
1. Test changes in staging environment
2. Backup current version
3. Deploy during low-traffic periods
4. Monitor for issues post-deployment
