# API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`

## Authentication
All endpoints use JWT token authentication (except `/health` and `/docs`).

### Get Authentication Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "detail": "Error message",
  "statusCode": 400,
  "errors": {
    "field": ["Error 1", "Error 2"]
  }
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

---

## Risk Assessment Endpoints

### POST /api/risks/assess
Assess climate risks for a location.

**Request:**
```json
{
  "location": "Miami, Florida",
  "latitude": 25.7617,
  "longitude": -80.1918
}
```

**Response (200 OK):**
```json
{
  "id": "assessment_123",
  "location": "Miami, Florida",
  "overallRisk": 78,
  "riskLevel": "High",
  "confidence": 0.92,
  "risks": [
    {
      "type": "flood",
      "score": 95,
      "level": "Critical",
      "description": "High flood risk due to proximity to coast"
    }
  ],
  "timestamp": "2024-01-16T10:30:00Z"
}
```

### GET /api/risks
List all risk assessments.

**Query Parameters:**
- `limit` (integer, optional): Number of results (default: 10)
- `offset` (integer, optional): Skip results (default: 0)
- `sort` (string, optional): Sort field (default: `-timestamp`)

**Response (200 OK):**
```json
{
  "total": 25,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "id": "assessment_123",
      "location": "Miami, Florida",
      "overallRisk": 78,
      "riskLevel": "High",
      "timestamp": "2024-01-16T10:30:00Z"
    }
  ]
}
```

### GET /api/risks/{id}
Get a specific risk assessment.

**Response (200 OK):**
```json
{
  "id": "assessment_123",
  "location": "Miami, Florida",
  "overallRisk": 78,
  "riskLevel": "High",
  "confidence": 0.92,
  "risks": [...]
}
```

---

## Action Plan Endpoints

### POST /api/actions/generate
Generate an action plan for a risk assessment.

**Request:**
```json
{
  "assessmentId": "assessment_123",
  "budget": 50000,
  "timeline": "12_months"
}
```

**Response (201 Created):**
```json
{
  "id": "action_plan_123",
  "assessmentId": "assessment_123",
  "estimatedCost": 45000,
  "actions": [
    {
      "id": "action_1",
      "title": "Install Hurricane-Resistant Roof",
      "priority": "Critical",
      "estimatedCost": 25000,
      "estimatedTime": "2-3 weeks",
      "status": "not_started"
    }
  ],
  "createdAt": "2024-01-16T10:35:00Z"
}
```

### GET /api/actions
List all action plans.

**Response (200 OK):**
```json
{
  "total": 5,
  "data": [...]
}
```

### GET /api/actions/{id}
Get a specific action plan.

**Response (200 OK):**
```json
{
  "id": "action_plan_123",
  "assessmentId": "assessment_123",
  "estimatedCost": 45000,
  "actions": [...]
}
```

### PATCH /api/actions/{id}/actions/{actionId}
Update action status.

**Request:**
```json
{
  "status": "in_progress"
}
```

**Response (200 OK):**
```json
{
  "id": "action_1",
  "title": "Install Hurricane-Resistant Roof",
  "status": "in_progress"
}
```

---

## Carbon Footprint Endpoints

### POST /api/footprint/calculate
Calculate carbon footprint.

**Request:**
```json
{
  "transportation": {
    "car": 500,
    "public_transit": 100,
    "flights": 2
  },
  "energy": {
    "electricity": 1200,
    "gas": 50
  },
  "food": {
    "beef": 4,
    "chicken": 8,
    "dairy": 20
  },
  "goods": {
    "clothing": 5,
    "electronics": 1
  }
}
```

**Response (201 Created):**
```json
{
  "id": "footprint_123",
  "userId": "user_123",
  "totalEmissions": 4.5,
  "unit": "tons_co2e",
  "breakdown": {
    "transportation": 1.8,
    "energy": 1.2,
    "food": 1.0,
    "goods": 0.5
  },
  "recommendations": [
    "Consider switching to electric vehicle"
  ],
  "timestamp": "2024-01-16T10:40:00Z"
}
```

### GET /api/footprint/{id}
Get carbon footprint data.

**Response (200 OK):**
```json
{
  "id": "footprint_123",
  "totalEmissions": 4.5,
  "unit": "tons_co2e",
  "breakdown": {...},
  "history": [...]
}
```

---

## Climate Prediction Endpoints

### POST /api/predictions/forecast
Generate climate predictions.

**Request:**
```json
{
  "location": "Miami, Florida",
  "years": 20,
  "scenarios": ["optimistic", "moderate", "pessimistic"]
}
```

**Response (201 Created):**
```json
{
  "id": "prediction_123",
  "location": "Miami, Florida",
  "years": 20,
  "scenarios": [
    {
      "name": "moderate",
      "temperatureChange": 2.3,
      "precipitationChange": 8.5,
      "seaLevelRise": 0.45
    }
  ],
  "trends": [
    {
      "metric": "temperature",
      "changePercentage": 2.3,
      "projection": [...]
    }
  ],
  "createdAt": "2024-01-16T10:45:00Z"
}
```

### GET /api/predictions/{id}
Get specific prediction.

**Response (200 OK):**
```json
{
  "id": "prediction_123",
  "location": "Miami, Florida",
  "years": 20,
  "scenarios": [...],
  "trends": [...]
}
```

---

## User Endpoints

### POST /api/users/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-16T10:50:00Z"
}
```

### GET /api/users/profile
Get user profile.

**Response (200 OK):**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "theme": "light",
    "notifications": true
  }
}
```

### PATCH /api/users/profile
Update user profile.

**Request:**
```json
{
  "name": "Jane Doe",
  "preferences": {
    "theme": "dark"
  }
}
```

**Response (200 OK):**
```json
{
  "id": "user_123",
  "name": "Jane Doe",
  "preferences": {
    "theme": "dark"
  }
}
```

---

## Health & Status Endpoints

### GET /health
Check API health status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-16T11:00:00Z",
  "version": "1.0.0"
}
```

### GET /api/stats
Get API statistics.

**Response (200 OK):**
```json
{
  "totalUsers": 1250,
  "totalAssessments": 3450,
  "averageRiskScore": 62.5,
  "requestsToday": 15230
}
```

---

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Pro Tier**: 1000 requests/hour
- **Enterprise**: Unlimited

Headers returned:
- `X-RateLimit-Limit`: Total requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Pagination

Paginated responses include:
- `total`: Total number of items
- `limit`: Items per page
- `offset`: Number of items skipped
- `data`: Array of items

Example:
```json
{
  "total": 100,
  "limit": 10,
  "offset": 0,
  "data": [...]
}
```

---

## Filtering & Sorting

### Filtering
```
GET /api/risks?riskLevel=High&location=Miami
```

### Sorting
```
GET /api/risks?sort=-overallRisk&sort=timestamp
```

Prefix with `-` for descending order.

---

## Webhooks (Coming Soon)

Subscribe to events:
- `assessment.completed`
- `action_plan.generated`
- `prediction.ready`

---

## API Documentation UI

Interactive API documentation available at:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

---

**Last Updated**: January 16, 2026  
**API Version**: 1.0.0
