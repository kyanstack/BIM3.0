# 🔐 Security Setup Guide

## Environment Variables Protection

### 1. Create Your Environment File

Create a `.env` file in your project root (this file is already in `.gitignore`):

```bash
# Copy the template
cp .env.template .env
```

Then edit `.env` with your actual values:

```env
# Supabase Configuration
SUPABASE_ACCESS_TOKEN=your_actual_supabase_token_here
SUPABASE_PROJECT_REF=your_project_reference_here

# App Configuration
NODE_ENV=development
VITE_APP_NAME="BIM 3.0 Viewer"
VITE_APP_VERSION="1.0.0"
```

### 2. Get Your Supabase Credentials

1. **Access Token**: 
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Settings → API
   - Copy your "anon" or "service_role" key

2. **Project Reference**:
   - In the same API settings page
   - Copy your "Project Reference" (looks like: `abcdefghijklmnop`)

### 3. Update MCP Configuration

The `.cursor/mcp.json` file now uses environment variables:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=${SUPABASE_PROJECT_REF}"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}",
        "SUPABASE_PROJECT_REF": "${SUPABASE_PROJECT_REF}"
      }
    }
  }
}
```

### 4. Security Best Practices

#### ✅ **DO:**
- Use environment variables for all sensitive data
- Keep `.env` files in `.gitignore`
- Use different tokens for development/production
- Rotate tokens regularly
- Use read-only tokens when possible

#### ❌ **DON'T:**
- Commit `.env` files to version control
- Hardcode tokens in source code
- Share tokens in public repositories
- Use production tokens in development

### 5. Cursor IDE Integration

Cursor can read environment variables from:
- `.env` files in your project
- System environment variables
- Cursor's built-in secrets management

### 6. Production Deployment

For production, set environment variables in your hosting platform:

**Vercel:**
```bash
vercel env add SUPABASE_ACCESS_TOKEN
vercel env add SUPABASE_PROJECT_REF
```

**Netlify:**
- Go to Site Settings → Environment Variables
- Add your variables there

**Docker:**
```dockerfile
ENV SUPABASE_ACCESS_TOKEN=your_token
ENV SUPABASE_PROJECT_REF=your_ref
```

### 7. Verification

To verify your setup is working:

1. Check that `.env` is in `.gitignore`
2. Verify no tokens are in your git history
3. Test that Cursor can access your Supabase data
4. Ensure the MCP server connects successfully

### 8. Emergency Token Rotation

If a token is compromised:

1. **Immediately** revoke the token in Supabase Dashboard
2. Generate a new token
3. Update your `.env` file
4. Update any deployed environments
5. Check git history for any accidental commits

---

## 🔒 Additional Security Measures

### Environment Variable Validation

Add this to your app startup to validate required environment variables:

```typescript
// src/utils/env-validation.ts
export function validateEnvironment() {
  const required = [
    'SUPABASE_ACCESS_TOKEN',
    'SUPABASE_PROJECT_REF'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### Token Scoping

Use the most restrictive token permissions:
- **Read-only** for viewing data
- **Service role** only when write access is needed
- **Row Level Security (RLS)** policies in Supabase

### Monitoring

- Enable Supabase audit logs
- Monitor API usage and unusual patterns
- Set up alerts for failed authentication attempts

---

**Remember**: Security is an ongoing process. Regularly review and update your security practices! 