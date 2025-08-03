"""
WebSocket Manager for Real-time Communication
Handles WebSocket connections, broadcasting, and real-time updates
"""

from fastapi import WebSocket
from typing import Dict, List, Set, Any
import json
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class WebSocketManager:
    """Manages WebSocket connections and real-time communication"""
    
    def __init__(self):
        # Store active connections: user_id -> WebSocket
        self.active_connections: Dict[str, WebSocket] = {}
        
        # Store channel subscriptions: channel -> set of user_ids
        self.channel_subscriptions: Dict[str, Set[str]] = {}
        
        # Store user subscriptions: user_id -> set of channels
        self.user_subscriptions: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept a WebSocket connection"""
        await websocket.accept()
        self.active_connections[user_id] = websocket
        self.user_subscriptions[user_id] = set()
        
        logger.info(f"WebSocket connected for user: {user_id}")
        
        # Send welcome message
        await self.send_to_user(user_id, {
            "type": "connection_established",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "message": "Real-time analytics connection established"
        })
    
    def disconnect(self, user_id: str):
        """Disconnect a WebSocket connection"""
        if user_id in self.active_connections:
            # Remove from all channel subscriptions
            if user_id in self.user_subscriptions:
                for channel in self.user_subscriptions[user_id]:
                    if channel in self.channel_subscriptions:
                        self.channel_subscriptions[channel].discard(user_id)
                        if not self.channel_subscriptions[channel]:
                            del self.channel_subscriptions[channel]
                
                del self.user_subscriptions[user_id]
            
            del self.active_connections[user_id]
            logger.info(f"WebSocket disconnected for user: {user_id}")
    
    async def send_to_user(self, user_id: str, message: Dict[str, Any]):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            try:
                websocket = self.active_connections[user_id]
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to user {user_id}: {str(e)}")
                # Remove disconnected connection
                self.disconnect(user_id)
    
    async def broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast a message to all connected users"""
        if not self.active_connections:
            return
        
        disconnected_users = []
        
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to user {user_id}: {str(e)}")
                disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
    
    async def broadcast_to_channel(self, channel: str, message: Dict[str, Any]):
        """Broadcast a message to all users subscribed to a channel"""
        if channel not in self.channel_subscriptions:
            return
        
        disconnected_users = []
        
        for user_id in self.channel_subscriptions[channel]:
            if user_id in self.active_connections:
                try:
                    websocket = self.active_connections[user_id]
                    await websocket.send_text(json.dumps(message))
                except Exception as e:
                    logger.error(f"Error sending to user {user_id} on channel {channel}: {str(e)}")
                    disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
    
    async def subscribe_to_channels(self, user_id: str, channels: List[str]):
        """Subscribe a user to multiple channels"""
        if user_id not in self.user_subscriptions:
            self.user_subscriptions[user_id] = set()
        
        for channel in channels:
            # Add user to channel
            if channel not in self.channel_subscriptions:
                self.channel_subscriptions[channel] = set()
            
            self.channel_subscriptions[channel].add(user_id)
            self.user_subscriptions[user_id].add(channel)
        
        logger.info(f"User {user_id} subscribed to channels: {channels}")
        
        # Send confirmation
        await self.send_to_user(user_id, {
            "type": "subscription_confirmed",
            "channels": channels,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def unsubscribe_from_channels(self, user_id: str, channels: List[str]):
        """Unsubscribe a user from multiple channels"""
        if user_id not in self.user_subscriptions:
            return
        
        for channel in channels:
            # Remove user from channel
            if channel in self.channel_subscriptions:
                self.channel_subscriptions[channel].discard(user_id)
                if not self.channel_subscriptions[channel]:
                    del self.channel_subscriptions[channel]
            
            self.user_subscriptions[user_id].discard(channel)
        
        logger.info(f"User {user_id} unsubscribed from channels: {channels}")
        
        # Send confirmation
        await self.send_to_user(user_id, {
            "type": "unsubscription_confirmed",
            "channels": channels,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    async def send_analytics_update(self, user_id: str, analytics_data: Dict[str, Any]):
        """Send analytics update to a user"""
        message = {
            "type": "analytics_update",
            "data": analytics_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.send_to_user(user_id, message)
    
    async def send_recommendation_update(self, user_id: str, recommendations: List[Dict[str, Any]]):
        """Send recommendation update to a user"""
        message = {
            "type": "recommendation_update",
            "recommendations": recommendations,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.send_to_user(user_id, message)
    
    async def send_alert(self, user_id: str, alert_data: Dict[str, Any]):
        """Send alert to a user"""
        message = {
            "type": "alert",
            "alert": alert_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.send_to_user(user_id, message)
    
    async def broadcast_system_notification(self, notification: Dict[str, Any]):
        """Broadcast system notification to all users"""
        message = {
            "type": "system_notification",
            "notification": notification,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.broadcast_to_all(message)
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get WebSocket connection statistics"""
        return {
            "total_connections": len(self.active_connections),
            "total_channels": len(self.channel_subscriptions),
            "active_users": list(self.active_connections.keys()),
            "channel_stats": {
                channel: len(users) 
                for channel, users in self.channel_subscriptions.items()
            }
        }
    
    async def ping_all_connections(self):
        """Ping all connections to check if they're alive"""
        disconnected_users = []
        
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.ping()
            except Exception as e:
                logger.warning(f"Connection lost for user {user_id}: {str(e)}")
                disconnected_users.append(user_id)
        
        # Clean up disconnected users
        for user_id in disconnected_users:
            self.disconnect(user_id)
        
        logger.info(f"Pinged {len(self.active_connections)} connections, removed {len(disconnected_users)} dead connections")

# Global WebSocket manager instance
websocket_manager = WebSocketManager()

# Background task to ping connections periodically
async def websocket_heartbeat():
    """Background task to maintain WebSocket connections"""
    while True:
        try:
            await websocket_manager.ping_all_connections()
            await asyncio.sleep(30)  # Ping every 30 seconds
        except Exception as e:
            logger.error(f"Error in WebSocket heartbeat: {str(e)}")
            await asyncio.sleep(30)