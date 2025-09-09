# Weather-to-Stay-or-Not Backend

A scalable Node.js backend service for filtering properties based on real-time weather conditions with efficient cursor-based pagination. This system is designed to handle vast datasets while providing fast, filtered results based on third-party weather data.

## 🏗️ Architecture Overview

This backend implements a sophisticated approach to handle **large-scale property datasets** with real-time weather filtering. The system is built with the assumption that we're dealing with **millions of properties** where traditional approaches would be inefficient.

### Key Design Decisions

- **Cursor-based pagination** for consistent performance at scale and also this works with our solution for third party api filters.
- **Batch processing** with weather API integration
- **In-memory caching** for weather data (1-hour TTL)
- **Lazy weather data fetching** to minimize API calls
- **Fail-safe filtering** that gracefully handles API failures

## 🌦️ Third-Party Weather Filter Approach

### The Challenge

When dealing with vast property datasets, applying weather filters presents unique challenges:

1. **Weather data is external** - We can't store it in the database as it becomes stale
2. **API rate limits** - Weather API may have request limitations
3. **Performance** - Fetching weather for millions of properties is impractical
4. **Consistency** - Weather data changes frequently (hourly updates)

### Our Solution: Hybrid Batch Processing

```typescript
// Core algorithm in src/services/property/index.ts
while (allFilteredProperties.length < targetLimit) {
  // 1. Fetch batch of properties from database (100 at a time)
  const properties = await prisma.property.findMany({
    take: batchSize,
    where: { ...buildPropertyWhere(params), id: { gt: lastId } },
    orderBy: { id: 'asc' }
  });
  
  // 2. Enrich with weather data (parallel API calls)
  const propertiesWithWeather = await populatePropertiesWeatherData(properties);
  
  // 3. Apply weather filters in-memory
  const filteredBatch = applyWeatherFilters(propertiesWithWeather, params.weatherFilters);
  
  // 4. Accumulate results until we have enough
  allFilteredProperties = [...allFilteredProperties, ...filteredBatch];
}
```

### Why This Approach?

1. **Scalable**: Only fetches weather for properties that pass database filters
2. **Efficient**: Uses cursor pagination to maintain consistent performance
3. **Resilient**: Continues processing even if some weather API calls fail
4. **Cache-friendly**: 1-hour TTL reduces redundant API calls

## 📄 Cursor-Based Pagination

### Implementation Details

Our cursor-based pagination uses the property `id` as the cursor, ensuring:

- **Consistent ordering** regardless of new data insertion
- **No duplicate results** across pages
- **Stable performance** even with millions of records

```typescript
// Request with cursor
GET /get-properties?cursor=12345&limit=20&temperatureMin=20&temperatureMax=30

// Response includes next cursor
{
  "properties": [...],
  "hasMore": true,
  "nextCursor": 12365  // ID of last property in results
}
```

### Cursor Flow

1. **First request**: No cursor provided, starts from ID > 0
2. **Subsequent requests**: Use `nextCursor` from previous response
3. **End detection**: `hasMore: false` indicates no more data

### Benefits Over Offset Pagination

| Aspect | Offset Pagination | Cursor Pagination |
|--------|------------------|-------------------|
| Performance | Degrades with large offsets | Consistent O(log n) |
| Consistency | Can show duplicates | No duplicates |
| Real-time data | Affected by insertions | Unaffected |
| Memory usage | Can be high | Constant |

## 🚀 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### GET /get-properties

Retrieve properties with optional weather-based filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `searchText` | string | No | Search in property name, city, or state | `"Mumbai"` |
| `limit` | number | No | Number of results per page (default: 20, max: 100) | `20` |
| `cursor` | number | No | Cursor for pagination (property ID) | `12345` |
| `temperatureMin` | number | No | Minimum temperature filter (°C) | `20` |
| `temperatureMax` | number | No | Maximum temperature filter (°C) | `30` |
| `humidityMin` | number | No | Minimum humidity filter (%) | `40` |
| `humidityMax` | number | No | Maximum humidity filter (%) | `80` |
| `weatherCondition` | string | No | Comma-separated weather codes | `"0,1,2"` |

**Weather Condition Codes:**
- `0`: Clear sky
- `1,2,3`: Mainly clear, partly cloudy, overcast
- `45,48`: Fog and depositing rime fog
- `51,53,55`: Drizzle (light, moderate, dense)
- `61,63,65`: Rain (slight, moderate, heavy)
- `80,81,82`: Rain showers (slight, moderate, violent)

**Example Requests:**

```bash
# Basic property search
GET /get-properties?searchText=Mumbai&limit=10

# Weather-filtered search
GET /get-properties?temperatureMin=25&temperatureMax=35&humidityMax=70

# Paginated request
GET /get-properties?cursor=12345&limit=20&temperatureMin=20&temperatureMax=30

# Complex filter
GET /get-properties?searchText=Delhi&temperatureMin=15&temperatureMax=25&weatherCondition=0,1,2&limit=15
```

**Response Format:**

```json
{
  "properties": [
    {
      "id": 12346,
      "name": "Luxury Apartment",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "lat": 19.0760,
      "lng": 72.8777,
      "isActive": true,
      "weather": {
        "temperature": 28.5,
        "windSpeed": 12.3,
        "humidity": 65,
        "weatherCode": 1
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "hasMore": true,
  "nextCursor": 12346
}
```

**Error Responses:**

```json
// 500 Internal Server Error
{
  "error": "Internal Server Error"
}

// Invalid parameters are handled gracefully
// Missing weather data returns property without weather field
```

### Health Check

#### GET /

Simple health check endpoint.

**Response:**
```
"Warden Weather Test: OK"
```

## 🗄️ Database Schema

```sql
-- Property table with optimized indexes
CREATE TABLE Property (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255) DEFAULT 'India',
  lat FLOAT,
  lng FLOAT,
  geohash5 VARCHAR(10),
  isActive BOOLEAN DEFAULT true,
  tags JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_active_city (isActive, city),
  INDEX idx_coordinates (lat, lng),
  INDEX idx_geohash (geohash5)
);
```

## 📊 Scalability Considerations

### Large Dataset Assumptions

This system is designed for **massive property datasets** with the following assumptions:

- **10M+ properties** in the database
- **High read traffic** with frequent weather filtering
- **Real-time weather requirements** (data freshness within 1 hour)
- **Geographic distribution** across multiple regions
- **Concurrent user requests** requiring fast response times

### Performance Optimizations

1. **Batch Processing**: Fetches properties in batches of 100 to balance memory usage and API calls
2. **Parallel Weather Fetching**: Uses `Promise.allSettled()` for concurrent API calls
3. **Smart Caching**: 1-hour TTL for weather data with automatic cleanup
4. **Database Indexes**: Optimized for common query patterns
5. **Cursor Pagination**: Maintains O(log n) performance regardless of dataset size

### Alternative Approach for Small Datasets

If we were dealing with a **smaller dataset** (< 100K properties), a simpler approach would be more appropriate:

```typescript
// Alternative: Cron job approach for small datasets
// This would run every hour to update weather data in the database

async function updateAllPropertiesWeather() {
  const properties = await prisma.property.findMany({
    where: { isActive: true, lat: { not: null }, lng: { not: null } }
  });
  
  for (const property of properties) {
    const weather = await fetchWeatherData(property.lat, property.lng);
    await prisma.property.update({
      where: { id: property.id },
      data: { 
        temperature: weather.temperature,
        humidity: weather.humidity,
        weatherCode: weather.weatherCode,
        weatherUpdatedAt: new Date()
      }
    });
  }
}

// Run every hour
cron.schedule('0 * * * *', updateAllPropertiesWeather);
```

**Why we didn't use this approach:**
- **API rate limits**: Would require 10M+ API calls per hour
- **Database bloat**: Weather data would significantly increase storage
- **Stale data**: Risk of serving outdated weather information
- **Update complexity**: Managing failed updates and partial states

## 🗄️ Cache Implementation

### Mock Cache Service

Instead of Redis, we've implemented a **lightweight in-memory cache** suitable for development and moderate production loads:

```typescript
// src/services/cache/index.ts
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

// Features:
// - TTL-based expiration
// - Automatic cleanup
// - Type-safe operations
// - Memory efficient
```

### Cache Strategy

- **Key Pattern**: `weather-{propertyId}-{lat}-{lng}`
- **TTL**: 1 hour (3,600,000ms)
- **Cleanup**: Automatic every hour
- **Fallback**: Graceful degradation on cache miss

### Production Considerations

For production with high traffic, consider upgrading to **Redis**:

```typescript
// Production Redis implementation
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const CacheService = {
  async get(key: string) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : undefined;
  },
  
  async set(key: string, value: any, ttlSeconds: number) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  }
};
```

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MySQL with Prisma ORM
- **Weather API**: OpenMeteo (free tier)
- **Cache**: In-memory Map (Redis alternative)
- **Validation**: Runtime type checking

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

## 🔧 Environment Variables

```env
DATABASE_URL="mysql://user:password@localhost:3306/weather_properties"
PORT=5000
```

## 🚦 Performance Metrics

### Expected Performance (with optimizations)

- **Response Time**: < 200ms for 20 properties with weather filters
- **Throughput**: 100+ concurrent requests
- **Memory Usage**: < 100MB for cache with 10K entries
- **API Calls**: Reduced by 80% due to caching

### Monitoring Recommendations

1. **Weather API Usage**: Track daily/hourly API call limits
2. **Cache Hit Rate**: Monitor cache effectiveness
3. **Database Query Performance**: Watch for slow queries
4. **Memory Usage**: Monitor cache size and cleanup efficiency

## 🔮 Future Enhancements

1. **Redis Integration**: For distributed caching
2. **Weather Data Persistence**: Store frequently accessed weather data
3. **Geospatial Indexing**: Use PostGIS for advanced location queries
4. **Rate Limiting**: Implement API rate limiting for fair usage
5. **Metrics Dashboard**: Real-time performance monitoring
6. **Weather Forecasting**: Extend to include forecast-based filtering
7. **Batch Weather Updates**: Optimize API usage with bulk requests

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain test coverage above 80%
3. Use conventional commit messages
4. Update documentation for API changes

## 📄 License

MIT License - see LICENSE file for details.
