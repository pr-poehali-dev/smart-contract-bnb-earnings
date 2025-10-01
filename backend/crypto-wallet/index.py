import json
import os
from typing import Dict, Any

PLATFORM_WALLET = "0x98b49bb2c613700D3c31266d245392bCE61bD991"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка крипто-транзакций BNB (пополнение, вывод, баланс)
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными транзакции
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
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        action = params.get('action', 'balance')
        user_wallet = params.get('wallet', '')
        
        if action == 'balance':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'balance': '0.00',
                    'wallet': user_wallet,
                    'platform_wallet': PLATFORM_WALLET
                })
            }
        
        if action == 'referral_stats':
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'total_earned': '0.046',
                    'referrals_count': 3,
                    'active_levels': 2,
                    'commission_rate': '5%'
                })
            }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'withdraw':
            amount = body_data.get('amount', '0')
            user_wallet = body_data.get('from_wallet', '')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'transaction_hash': '0x' + 'a' * 64,
                    'amount': amount,
                    'from': user_wallet,
                    'to': PLATFORM_WALLET,
                    'message': f'Вывод {amount} BNB на кошелек {PLATFORM_WALLET}'
                })
            }
        
        if action == 'buy_package':
            package_id = body_data.get('package_id')
            amount = body_data.get('amount', '0')
            user_wallet = body_data.get('wallet', '')
            referrer = body_data.get('referrer', '')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'transaction_hash': '0x' + 'b' * 64,
                    'package_id': package_id,
                    'amount': amount,
                    'from': user_wallet,
                    'to': PLATFORM_WALLET,
                    'referrer': referrer,
                    'message': f'Покупка пакета #{package_id} за {amount} BNB'
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
