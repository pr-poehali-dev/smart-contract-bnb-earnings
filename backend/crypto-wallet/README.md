# Смарт-контракт многоуровневой реферальной системы

## Адрес владельца платформы
`0x98b49bb2c613700D3c31266d245392bCE61bD991`

## Описание
Смарт-контракт на Solidity для BNB Smart Chain (BSC) с многоуровневой реферальной системой.

## Возможности

### Пакеты участия:
1. **Starter** - 0.1 BNB
   - Комиссия: 3%
   - Уровни: 1

2. **Professional** - 0.5 BNB
   - Комиссия: 5%
   - Уровни: 3

3. **VIP** - 1.0 BNB
   - Комиссия: 10%
   - Уровни: 5

### Функции контракта:

#### `buyPackage(uint256 packageId, address referrer)`
Покупка пакета участия. Принимает BNB и регистрирует пользователя с рефералом.

#### `withdraw(uint256 amount)`
Вывод заработанных средств (минимум 0.01 BNB).

#### `getBalance()`
Проверка доступного баланса для вывода.

#### `getUserInfo(address user)`
Получение информации о пользователе: реферер, пакет, заработок, рефералы.

## Как развернуть контракт

### Вариант 1: Remix IDE (Простой способ)

1. Откройте https://remix.ethereum.org/
2. Создайте новый файл `MultiLevelReferral.sol`
3. Скопируйте код из `contract.sol`
4. Компилируйте контракт (Solidity 0.8.0+)
5. Подключите MetaMask к BSC Mainnet или BSC Testnet
6. Разверните контракт (Deploy)
7. Сохраните адрес развернутого контракта

### Вариант 2: Hardhat (Для разработчиков)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

Создайте `scripts/deploy.js`:
```javascript
async function main() {
  const Contract = await ethers.getContractFactory("MultiLevelReferral");
  const contract = await Contract.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Запустите:
```bash
npx hardhat run scripts/deploy.js --network bsc
```

### Настройка в frontend

После деплоя контракта:

1. Скопируйте адрес контракта
2. Обновите `src/pages/Index.tsx`:
```typescript
const CONTRACT_ADDRESS = 'ВАШ_АДРЕС_КОНТРАКТА';
```

3. Добавьте ABI контракта в `src/contracts/abi.json`

## Сети BSC

### Mainnet
- RPC: https://bsc-dataseed.binance.org/
- Chain ID: 56
- Symbol: BNB
- Explorer: https://bscscan.com/

### Testnet
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- Chain ID: 97
- Symbol: tBNB
- Explorer: https://testnet.bscscan.com/
- Faucet: https://testnet.binance.org/faucet-smart

## Требования

- MetaMask или Trust Wallet
- BNB для газа (деплой ~0.1-0.5 BNB на mainnet, бесплатно на testnet)
- Базовое понимание работы с Web3

## Безопасность

⚠️ **ВАЖНО:**
- Контракт нельзя изменить после деплоя
- Проверьте код перед развертыванием
- Начните с testnet для тестирования
- Владелец контракта может обновлять пакеты и делать emergency withdraw

## Интеграция с backend

Backend функция `crypto-wallet` уже настроена для работы с контрактом:
- URL: `https://functions.poehali.dev/792345ca-214e-4b02-9fd9-1f95c3faceef`
- Методы: balance, referral_stats, withdraw, buy_package

## Комиссии

Все транзакции в BSC требуют газа в BNB:
- Покупка пакета: ~0.0001-0.0003 BNB
- Вывод средств: ~0.0001-0.0002 BNB
- Деплой контракта: ~0.1-0.5 BNB (одноразово)

## Поддержка

Платформа автоматически распределяет комиссии по уровням рефералов согласно купленному пакету.
Все средства идут через смарт-контракт - прозрачно и безопасно.
