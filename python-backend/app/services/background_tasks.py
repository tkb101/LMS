"""
Background tasks for analytics processing
"""

import asyncio
import logging
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.analytics import AnalyticsSnapshot, SystemMetrics

logger = logging.getLogger(__name__)

async def start_background_tasks():
    """Start all background tasks"""
    logger.info("Starting background tasks...")
    
    # Start periodic tasks
    asyncio.create_task(create_analytics_snapshots())
    asyncio.create_task(cleanup_old_data())
    asyncio.create_task(system_health_check())

async def create_analytics_snapshots():
    """Create periodic analytics snapshots"""
    while True:
        try:
            await asyncio.sleep(3600)  # Run every hour
            
            db = SessionLocal()
            try:
                # Create hourly snapshot
                snapshot = AnalyticsSnapshot(
                    snapshot_type="hourly",
                    snapshot_date=datetime.utcnow(),
                    metrics={
                        "timestamp": datetime.utcnow().isoformat(),
                        "active_users": 0,  # Would calculate from actual data
                        "page_views": 0,
                        "interactions": 0
                    }
                )
                
                db.add(snapshot)
                db.commit()
                logger.info("Created analytics snapshot")
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error creating analytics snapshot: {str(e)}")
            await asyncio.sleep(300)  # Wait 5 minutes before retry

async def cleanup_old_data():
    """Clean up old analytics data"""
    while True:
        try:
            await asyncio.sleep(86400)  # Run daily
            
            db = SessionLocal()
            try:
                # Delete snapshots older than 90 days
                cutoff_date = datetime.utcnow() - timedelta(days=90)
                
                deleted_count = db.query(AnalyticsSnapshot).filter(
                    AnalyticsSnapshot.snapshot_date < cutoff_date
                ).delete()
                
                db.commit()
                logger.info(f"Cleaned up {deleted_count} old analytics snapshots")
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error cleaning up old data: {str(e)}")
            await asyncio.sleep(3600)  # Wait 1 hour before retry

async def system_health_check():
    """Periodic system health check"""
    while True:
        try:
            await asyncio.sleep(300)  # Run every 5 minutes
            
            db = SessionLocal()
            try:
                # Store system health metrics
                health_metric = SystemMetrics(
                    metric_name="system_health",
                    metric_value=1.0,  # 1.0 = healthy, 0.0 = unhealthy
                    metric_unit="status",
                    metadata={
                        "timestamp": datetime.utcnow().isoformat(),
                        "status": "healthy"
                    }
                )
                
                db.add(health_metric)
                db.commit()
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error in system health check: {str(e)}")
            await asyncio.sleep(600)  # Wait 10 minutes before retry