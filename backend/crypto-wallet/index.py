import json
import os
from typing import Dict, Any

PLATFORM_WALLETS = {
    'BNB': '0x98b49bb2c613700D3c31266d245392bCE61bD991',
    'BTC': '0x98b49bb2c613700D3c31266d245392bCE61bD991',
    'USDT': '0x98b49bb2c613700D3c31266d245392bCE61bD991',
    'ETH': '0x98b49bb2c613700D3c31266d245392bCE61bD991'
}

CRYPTO_RATES = {
    'BNB': 1.0,
    'BTC': 0.000015,
    'USDT': 600.0,
    'ETH': 0.00025
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка мультивалютных крипто-транзакций (BNB, BTC, USDT, ETH)
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
                    'platform_wallets': PLATFORM_WALLETS
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
            crypto = body_data.get('crypto', 'BNB')
            user_wallet = body_data.get('from_wallet', '')
            platform_wallet = PLATFORM_WALLETS.get(crypto, PLATFORM_WALLETS['BNB'])
            
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
                    'crypto': crypto,
                    'from': user_wallet,
                    'to': platform_wallet,
                    'message': f'Вывод {amount} {crypto} на кошелек {platform_wallet}'
                })
            }
        
        if action == 'buy_package':
            package_id = body_data.get('package_id')
            amount = body_data.get('amount', '0')
            crypto = body_data.get('crypto', 'BNB')
            user_wallet = body_data.get('wallet', '')
            referrer = body_data.get('referrer', '')
            platform_wallet = PLATFORM_WALLETS.get(crypto, PLATFORM_WALLETS['BNB'])
            
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
                    'crypto': crypto,
                    'from': user_wallet,
                    'to': platform_wallet,
                    'referrer': referrer,
                    'payment_address': platform_wallet,
                    'message': f'Покупка пакета #{package_id} за {amount} {crypto}'
                })
            }
        
        if action == 'get_payment_address':
            crypto = body_data.get('crypto', 'BNB')
            package_id = body_data.get('package_id', 1)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'address': PLATFORM_WALLETS.get(crypto, PLATFORM_WALLETS['BNB']),
                    'crypto': crypto,
                    'package_id': package_id
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