# State API Specification - Corrected Format

## GET /api/states/current

### Request
```http
GET /api/states/current
Authorization: Bearer <token>
Content-Type: application/json
```

### ✅ Success Response (200)
```json
{
  "success": true,
  "data": {
    "stateCode": "KA",
    "stateName": "Karnataka",
    "mapUrl": "https://cdn.chipv2.com/assets/maps/karnataka.svg",
    "leftLogoUrl": "https://cdn.chipv2.com/assets/logos/karnataka-seal.svg",
    "rightLogoUrl": "https://cdn.chipv2.com/assets/logos/nhm-logo.svg",
    "nodalOfficer": "Dr. Khanna, IAS (AMD-NHM)",
    "helplineNumber": "+91-9999999999",
    "email": "HealthOfficials@karnataka.gov.in"
  },
  "message": "State configuration retrieved successfully"
}
```

### ❌ Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired authentication token",
  "errorCode": "UNAUTHORIZED",
  "data": null
}
```

#### 404 Not Found
```json
{
  "success": false,
  "message": "State configuration not found for current user location",
  "errorCode": "STATE_NOT_FOUND", 
  "data": null
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error while fetching state configuration",
  "errorCode": "INTERNAL_ERROR",
  "data": null
}
```

## Requirements for Backend Team

### 1. Asset Management
- **Upload assets to CDN**: All images (logos, maps) must be hosted on CDN
- **Use HTTPS URLs**: All asset URLs must be fully qualified HTTPS URLs
- **No local paths**: Never return `src/assets/...` paths

### 2. File Naming Convention
- **No spaces**: Use kebab-case or underscores
- **Consistent naming**: Follow pattern like `{state-code}-{asset-type}.{ext}`

Examples:
```
✅ ka-state-seal.svg
✅ mh-state-seal.svg  
✅ karnataka-map.svg
❌ Seal_of_Karnataka 1.svg
```

### 3. State-Specific Endpoints
Each state deployment should have its own base URL:
- Karnataka: `https://ka-api.chipv2.com/api/v1/api/states/current`
- Maharashtra: `https://mh-api.chipv2.com/api/v1/api/states/current`
- Rajasthan: `https://rj-api.chipv2.com/api/v1/api/states/current`

### 4. Response Consistency
- Always include `success`, `message`, and `data` fields
- Use consistent error codes
- Include meaningful error messages

## Testing Checklist for Backend Team

- [ ] All asset URLs return valid images
- [ ] URLs are HTTPS and publicly accessible
- [ ] No local file paths in response
- [ ] Error responses include proper error codes
- [ ] Authentication works correctly
- [ ] Response matches TypeScript interface