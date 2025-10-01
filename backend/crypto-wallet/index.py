import json
import os
from typing import Dict, Any

PLATFORM_WALLET = '0x98b49bb2c613700D3c31266d245392bCE61bD991'

DEPOSIT_LIMITS = {
    'BNB': {'min': 0.04, 'fee': 0.10},
    'BTC': {'min': 0.0005, 'fee': 0.10}
}

WITHDRAW_LIMITS = {
    'BNB': {'min': 1.0, 'fee': 0.05},
    'BTC': {'min': 0.01, 'fee': 0.05}
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка крипто-транзакций BNB и BTC с комиссиями
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
                    'balance': {'BNB': '2.5', 'BTC': '0.025'},
                    'wallet': user_wallet,
                    'platform_wallet': PLATFORM_WALLET,
                    'deposit_limits': DEPOSIT_LIMITS,
                    'withdraw_limits': WITHDRAW_LIMITS
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
            amount = float(body_data.get('amount', '0'))
            crypto = body_data.get('crypto', 'BNB')
            user_wallet = body_data.get('from_wallet', '')
            to_wallet = body_data.get('to_wallet', '')
            
            limits = WITHDRAW_LIMITS.get(crypto, WITHDRAW_LIMITS['BNB'])
            
            if amount < limits['min']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': f'Минимальная сумма вывода: {limits["min"]} {crypto}'
                    })
                }
            
            fee = amount * limits['fee']
            platform_earnings = fee
            user_receives = amount - fee
            
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
                    'fee': fee,
                    'user_receives': user_receives,
                    'platform_earnings': platform_earnings,
                    'crypto': crypto,
                    'from': user_wallet,
                    'to': to_wallet,
                    'platform_wallet': PLATFORM_WALLET,
                    'message': f'Заявка на вывод {amount} {crypto}. Вы получите {user_receives:.6f} {crypto}. Комиссия: {fee:.6f} {crypto}'
                })
            }
        
        if action == 'deposit':
            amount = float(body_data.get('amount', '0'))
            crypto = body_data.get('crypto', 'BNB')
            user_wallet = body_data.get('from_wallet', '')
            
            limits = DEPOSIT_LIMITS.get(crypto, DEPOSIT_LIMITS['BNB'])
            
            if amount < limits['min']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': f'Минимальная сумма пополнения: {limits["min"]} {crypto}'
                    })
                }
            
            fee = amount * limits['fee']
            platform_earnings = fee
            user_receives = amount - fee
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'transaction_hash': '0x' + 'c' * 64,
                    'amount': amount,
                    'fee': fee,
                    'user_receives': user_receives,
                    'platform_earnings': platform_earnings,
                    'crypto': crypto,
                    'from': user_wallet,
                    'to': PLATFORM_WALLET,
                    'deposit_address': PLATFORM_WALLET,
                    'message': f'Пополнение {amount} {crypto}. Вы получите {user_receives:.6f} {crypto}. Комиссия: {fee:.6f} {crypto}'
                })
            }
        
        if action == 'buy_package':
            package_id = body_data.get('package_id')
            amount = body_data.get('amount', '0')
            crypto = body_data.get('crypto', 'BNB')
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
                    'crypto': crypto,
                    'from': user_wallet,
                    'to': PLATFORM_WALLET,
                    'referrer': referrer,
                    'payment_address': PLATFORM_WALLET,
                    'message': f'Покупка пакета #{package_id} за {amount} {crypto}'
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