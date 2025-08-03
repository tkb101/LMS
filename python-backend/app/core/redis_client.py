"""
Redis client configuration
"""

import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    """Async Redis client wrapper"""
    
    def __init__(self):
        self.redis = None
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            await self.redis.ping()
            logger.info("Redis connection established")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {str(e)}")
            raise
    
    async def ping(self):
        """Ping Redis server"""
        if not self.redis:
            await self.connect()
        return await self.redis.ping()
    
    async def get(self, key: str):
        """Get value by key"""
        if not self.redis:
            await self.connect()
        return await self.redis.get(key)
    
    async def set(self, key: str, value: str, ex: int = None):
        """Set key-value pair with optional expiration"""
        if not self.redis:
            await self.connect()
        return await self.redis.set(key, value, ex=ex)
    
    async def setex(self, key: str, time: int, value: str):
        """Set key-value pair with expiration time"""
        if not self.redis:
            await self.connect()
        return await self.redis.setex(key, time, value)
    
    async def delete(self, key: str):
        """Delete key"""
        if not self.redis:
            await self.connect()
        return await self.redis.delete(key)
    
    async def exists(self, key: str):
        """Check if key exists"""
        if not self.redis:
            await self.connect()
        return await self.redis.exists(key)
    
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()

# Create global Redis client instance
redis_client = RedisClient()