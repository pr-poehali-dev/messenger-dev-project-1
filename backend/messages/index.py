import json
import os
from typing import Any, Dict, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для работы с чатами и сообщениями
    GET /messages?user_id=1 - получить список чатов пользователя
    GET /messages?chat_id=1 - получить сообщения чата
    POST /messages - отправить новое сообщение
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            user_id = params.get('user_id')
            chat_id = params.get('chat_id')
            
            if chat_id:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT 
                        m.id,
                        m.text,
                        m.status,
                        m.created_at,
                        m.sender_id,
                        u.display_name as sender_name
                    FROM messages m
                    JOIN users u ON m.sender_id = u.id
                    WHERE m.chat_id = %s
                    ORDER BY m.created_at ASC
                ''', (chat_id,))
                
                messages = cursor.fetchall()
                cursor.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(m) for m in messages], default=str),
                    'isBase64Encoded': False
                }
            
            elif user_id:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT DISTINCT
                        c.id,
                        c.name,
                        c.is_group,
                        c.avatar_url,
                        (
                            SELECT m.text
                            FROM messages m
                            WHERE m.chat_id = c.id
                            ORDER BY m.created_at DESC
                            LIMIT 1
                        ) as last_message,
                        (
                            SELECT m.created_at
                            FROM messages m
                            WHERE m.chat_id = c.id
                            ORDER BY m.created_at DESC
                            LIMIT 1
                        ) as last_message_time,
                        (
                            SELECT COUNT(*)
                            FROM messages m
                            WHERE m.chat_id = c.id 
                            AND m.sender_id != %s
                            AND m.status != 'read'
                        ) as unread_count
                    FROM chats c
                    JOIN chat_members cm ON c.id = cm.chat_id
                    WHERE cm.user_id = %s
                    ORDER BY last_message_time DESC NULLS LAST
                ''', (user_id, user_id))
                
                chats = cursor.fetchall()
                cursor.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps([dict(c) for c in chats], default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            chat_id = body_data.get('chat_id')
            sender_id = body_data.get('sender_id')
            text = body_data.get('text')
            
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO messages (chat_id, sender_id, text, status)
                VALUES (%s, %s, %s, 'sent')
                RETURNING id, chat_id, sender_id, text, status, created_at
            ''', (chat_id, sender_id, text))
            
            new_message = cursor.fetchone()
            
            cursor.execute('''
                UPDATE chats
                SET updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (chat_id,))
            
            conn.commit()
            cursor.close()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(new_message), default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
