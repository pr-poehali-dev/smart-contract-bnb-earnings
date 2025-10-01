import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BACKEND_URL = 'https://functions.poehali.dev/792345ca-214e-4b02-9fd9-1f95c3faceef';
const PLATFORM_WALLETS = {
  BNB: '0x98b49bb2c613700D3c31266d245392bCE61bD991',
  BTC: 'bc1qpxvpn87fqq2fjgvqdljhv2wzpumhfqxnnvek6r'
};

interface CryptoOption {
  symbol: string;
  name: string;
  icon: string;
  depositMin: string;
  withdrawMin: string;
  depositFee: string;
  withdrawFee: string;
}

const cryptoOptions: CryptoOption[] = [
  { 
    symbol: 'BNB', 
    name: 'BNB Smart Chain', 
    icon: '💎',
    depositMin: '0.04',
    withdrawMin: '1',
    depositFee: '10%',
    withdrawFee: '5%'
  },
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    icon: '₿',
    depositMin: '0.0005',
    withdrawMin: '0.01',
    depositFee: '10%',
    withdrawFee: '5%'
  }
];

const Index = () => {
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState<string>('BNB');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [referralCode] = useState('REF123ABC');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [userBalance] = useState({ BNB: '2.5', BTC: '0.025' });

  const packages = [
    {
      id: 1,
      name: 'Starter',
      prices: { BNB: '0.1', BTC: '0.0015' },
      commission: '3%',
      benefits: ['1 уровень рефералов', 'Базовая комиссия', 'Еженедельные выплаты']
    },
    {
      id: 2,
      name: 'Professional',
      prices: { BNB: '0.5', BTC: '0.0075' },
      commission: '5%',
      benefits: ['3 уровня рефералов', 'Увеличенная комиссия', 'Ежедневные выплаты', 'Приоритетная поддержка']
    },
    {
      id: 3,
      name: 'VIP',
      prices: { BNB: '1.0', BTC: '0.015' },
      commission: '10%',
      benefits: ['5 уровней рефералов', 'Максимальная комиссия', 'Моментальные выплаты', 'VIP поддержка', 'Бонусы за объем']
    }
  ];

  const referrals = [
    { id: 1, address: '0x7a2f...9b3c', level: 1, earned: '0.015 BNB', status: 'active' },
    { id: 2, address: '0x4d8e...1f2a', level: 2, earned: '0.0002 BTC', status: 'active' },
    { id: 3, address: '0x9c3b...7e4d', level: 1, earned: '0.023 BNB', status: 'active' }
  ];

  const currentCrypto = cryptoOptions.find(c => c.symbol === selectedCrypto)!;

  const copyAddress = () => {
    const walletAddress = PLATFORM_WALLETS[selectedCrypto as keyof typeof PLATFORM_WALLETS];
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
    toast({
      title: 'Адрес скопирован',
      description: `${selectedCrypto} адрес кошелька скопирован в буфер обмена`
    });
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Ссылка скопирована',
      description: 'Реферальная ссылка скопирована в буфер обмена'
    });
  };

  const handleBuyPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowPaymentModal(true);
  };

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const confirmDeposit = async () => {
    const amount = parseFloat(depositAmount);
    const minDeposit = parseFloat(currentCrypto.depositMin);

    if (!depositAmount || amount < minDeposit) {
      toast({
        title: 'Ошибка',
        description: `Минимальная сумма пополнения: ${currentCrypto.depositMin} ${selectedCrypto}`,
        variant: 'destructive'
      });
      return;
    }

    const fee = amount * 0.1;
    const youReceive = amount - fee;

    toast({
      title: 'Инструкция по пополнению',
      description: `Отправьте ${amount} ${selectedCrypto} на адрес. Вы получите ${youReceive.toFixed(6)} ${selectedCrypto} (комиссия ${fee.toFixed(6)} ${selectedCrypto})`
    });
  };

  const confirmWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const minWithdraw = parseFloat(currentCrypto.withdrawMin);
    const currentBalance = parseFloat(userBalance[selectedCrypto]);

    if (!withdrawAmount || amount < minWithdraw) {
      toast({
        title: 'Ошибка',
        description: `Минимальная сумма вывода: ${currentCrypto.withdrawMin} ${selectedCrypto}`,
        variant: 'destructive'
      });
      return;
    }

    if (amount > currentBalance) {
      toast({
        title: 'Ошибка',
        description: 'Недостаточно средств на балансе',
        variant: 'destructive'
      });
      return;
    }

    if (!withdrawAddress) {
      toast({
        title: 'Ошибка',
        description: 'Укажите адрес для вывода',
        variant: 'destructive'
      });
      return;
    }

    try {
      const fee = amount * 0.05;
      const youReceive = amount - fee;

      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'withdraw',
          amount: withdrawAmount,
          crypto: selectedCrypto,
          from_wallet: 'user_wallet',
          to_wallet: withdrawAddress
        })
      });

      toast({
        title: 'Заявка на вывод создана!',
        description: `Вы получите ${youReceive.toFixed(6)} ${selectedCrypto} (комиссия ${fee.toFixed(6)} ${selectedCrypto}). Обработка до 24 часов.`
      });
      
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку на вывод',
        variant: 'destructive'
      });
    }
  };

  const confirmPayment = async () => {
    if (!selectedPackage) return;

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'buy_package',
          package_id: selectedPackage.id,
          amount: selectedPackage.prices[selectedCrypto],
          crypto: selectedCrypto,
          wallet: 'user_wallet',
          referrer: new URLSearchParams(window.location.search).get('ref') || ''
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Заявка отправлена!',
          description: `После отправки ${selectedPackage.prices[selectedCrypto]} ${selectedCrypto} пакет будет активирован`
        });
        setShowPaymentModal(false);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                  CRYPTO PLATFORM
                </h1>
                <p className="text-muted-foreground text-lg">Многоуровневая реферальная система</p>
              </div>
              <a href="/admin" className="hidden md:block">
                <Button variant="outline" className="border-primary/30">
                  <Icon name="Settings" className="mr-2" size={18} />
                  Админ
                </Button>
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-2xl border border-primary/20">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="text-xs text-muted-foreground">BNB баланс</p>
                  <p className="text-xl font-bold text-foreground">{userBalance.BNB}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-2xl border border-accent/20">
                <span className="text-2xl">₿</span>
                <div>
                  <p className="text-xs text-muted-foreground">BTC баланс</p>
                  <p className="text-xl font-bold text-foreground">{userBalance.BTC}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 animate-scale-in">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="TrendingUp" className="text-primary" size={24} />
                <p className="text-muted-foreground text-sm">Всего заработано</p>
              </div>
              <p className="text-2xl font-bold text-foreground">0.046 BNB</p>
              <p className="text-sm text-muted-foreground">+ 0.0005 BTC</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Users" className="text-secondary" size={24} />
                <p className="text-muted-foreground text-sm">Рефералов</p>
              </div>
              <p className="text-3xl font-bold text-foreground">3</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Layers" className="text-accent" size={24} />
                <p className="text-muted-foreground text-sm">Активных уровней</p>
              </div>
              <p className="text-3xl font-bold text-foreground">2</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Coins" className="text-primary" size={24} />
                <p className="text-muted-foreground text-sm">Комиссия</p>
              </div>
              <p className="text-3xl font-bold text-foreground">5%</p>
            </Card>
          </div>
        </header>

        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-card to-primary/10 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon name="ArrowDownToLine" className="text-primary" size={28} />
                  <h3 className="text-xl font-bold text-foreground">Пополнение</h3>
                </div>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="w-[140px] bg-background border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map(crypto => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <span className="flex items-center gap-2">
                          <span>{crypto.icon}</span>
                          <span>{crypto.symbol}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Минимум:</span>
                  <span className="font-semibold text-foreground">{currentCrypto.depositMin} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Комиссия:</span>
                  <span className="font-semibold text-accent">{currentCrypto.depositFee}</span>
                </div>
              </div>
              <Button onClick={handleDeposit} className="w-full bg-gradient-to-r from-primary to-primary/80 hover:opacity-90">
                <Icon name="Plus" className="mr-2" size={18} />
                Пополнить баланс
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-secondary/10 border-secondary/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon name="ArrowUpFromLine" className="text-secondary" size={28} />
                  <h3 className="text-xl font-bold text-foreground">Вывод</h3>
                </div>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger className="w-[140px] bg-background border-secondary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map(crypto => (
                      <SelectItem key={crypto.symbol} value={crypto.symbol}>
                        <span className="flex items-center gap-2">
                          <span>{crypto.icon}</span>
                          <span>{crypto.symbol}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Минимум:</span>
                  <span className="font-semibold text-foreground">{currentCrypto.withdrawMin} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Комиссия:</span>
                  <span className="font-semibold text-accent">{currentCrypto.withdrawFee}</span>
                </div>
              </div>
              <Button onClick={handleWithdraw} className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90">
                <Icon name="ArrowRight" className="mr-2" size={18} />
                Вывести средства
              </Button>
            </Card>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Пакеты участия</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {packages.map((pkg, index) => (
              <Card
                key={pkg.id}
                className={`p-8 bg-gradient-to-br ${
                  index === 0 ? 'from-card to-primary/10 border-primary/30' :
                  index === 1 ? 'from-card to-secondary/10 border-secondary/30' :
                  'from-card to-accent/10 border-accent/30'
                } hover:scale-105 transition-transform duration-300 animate-scale-in`}
                style={{animationDelay: `${index * 0.15}s`}}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground">{pkg.name}</h3>
                  <Badge className={`${
                    index === 0 ? 'bg-primary' :
                    index === 1 ? 'bg-secondary text-background' :
                    'bg-accent text-background'
                  } text-sm px-3 py-1`}>
                    {pkg.commission}
                  </Badge>
                </div>
                
                <div className="mb-6">
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {pkg.prices['BNB']} BNB
                  </p>
                  <p className="text-sm text-muted-foreground">
                    или {pkg.prices['BTC']} BTC
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Icon name="CheckCircle" className="text-primary mt-0.5" size={18} />
                      <p className="text-sm text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleBuyPackage(pkg)}
                  className={`w-full ${
                    index === 0 ? 'bg-gradient-to-r from-primary to-primary/80' :
                    index === 1 ? 'bg-gradient-to-r from-secondary to-secondary/80' :
                    'bg-gradient-to-r from-accent to-accent/80'
                  } hover:opacity-90 transition-opacity`}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={18} />
                  Приобрести
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 animate-fade-in">
          <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Link" className="text-primary" size={28} />
              <h2 className="text-2xl font-bold text-foreground">Реферальная ссылка</h2>
            </div>
            
            <div className="bg-background/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-2">Ваша реферальная ссылка</p>
              <p className="text-sm text-foreground font-mono break-all mb-3">
                {window.location.origin}?ref={referralCode}
              </p>
              <Button
                onClick={copyReferralLink}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Icon name="Copy" className="mr-2" size={18} />
                Скопировать ссылку
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="TrendingUp" size={16} />
                <p>Получайте 10% от пополнений рефералов</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Coins" size={16} />
                <p>Получайте 5% от выводов рефералов</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="animate-fade-in">
          <Card className="p-8 bg-gradient-to-br from-card to-accent/5 border-accent/20">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="Users" className="text-accent" size={28} />
              <h2 className="text-2xl font-bold text-foreground">Мои рефералы</h2>
            </div>

            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Icon name="User" className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">{ref.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Уровень {ref.level}
                        </Badge>
                        <Badge className="text-xs bg-primary">
                          {ref.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Заработано</p>
                    <p className="text-lg font-bold text-accent">{ref.earned}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-8 bg-gradient-to-br from-card to-primary/10 border-primary/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Пополнение баланса</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowDepositModal(false)}>
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Выбранная валюта</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentCrypto.icon}</span>
                  <span className="text-lg font-bold text-foreground">{selectedCrypto}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Сумма пополнения</label>
                <Input
                  type="number"
                  placeholder={`Минимум ${currentCrypto.depositMin}`}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-background/50 border-border text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Комиссия {currentCrypto.depositFee} • Минимум {currentCrypto.depositMin} {selectedCrypto}
                </p>
              </div>

              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Адрес для пополнения {selectedCrypto === 'BTC' ? '(Сеть Bitcoin)' : '(Сеть BNB Smart Chain)'}</p>
                <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                  <p className="text-sm font-mono text-foreground flex-1 break-all">{PLATFORM_WALLETS[selectedCrypto as keyof typeof PLATFORM_WALLETS]}</p>
                  <Button size="icon" variant="ghost" onClick={copyAddress}>
                    <Icon name={copiedAddress ? "Check" : "Copy"} size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" className="text-accent mt-1" size={20} />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Важно:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Отправьте точную сумму на указанный адрес</li>
                      <li>С пополнения удерживается {currentCrypto.depositFee} комиссия</li>
                      <li>Зачисление после 3 подтверждений в сети</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={confirmDeposit}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
              >
                <Icon name="Check" className="mr-2" size={20} />
                Я отправил {depositAmount || '0'} {selectedCrypto}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-8 bg-gradient-to-br from-card to-secondary/10 border-secondary/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Вывод средств</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowWithdrawModal(false)}>
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Доступно для вывода</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentCrypto.icon}</span>
                  <span className="text-2xl font-bold text-foreground">{userBalance[selectedCrypto]} {selectedCrypto}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Сумма вывода</label>
                <Input
                  type="number"
                  placeholder={`Минимум ${currentCrypto.withdrawMin}`}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-background/50 border-border text-lg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Комиссия {currentCrypto.withdrawFee} • Минимум {currentCrypto.withdrawMin} {selectedCrypto}
                </p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Адрес получателя</label>
                <Input
                  type="text"
                  placeholder="Введите адрес кошелька"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-background/50 border-border font-mono"
                />
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" className="text-accent mt-1" size={20} />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Условия вывода:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Минимум для вывода: {currentCrypto.withdrawMin} {selectedCrypto}</li>
                      <li>Комиссия платформы: {currentCrypto.withdrawFee}</li>
                      <li>Обработка заявки: до 24 часов</li>
                      <li>Проверьте адрес перед отправкой!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={confirmWithdraw}
                className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-lg py-6"
              >
                <Icon name="Send" className="mr-2" size={20} />
                Создать заявку на вывод
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-8 bg-gradient-to-br from-card to-primary/10 border-primary/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Оплата пакета {selectedPackage.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)}>
                <Icon name="X" size={24} />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-3">Выберите валюту оплаты</p>
                <div className="grid grid-cols-2 gap-3">
                  {cryptoOptions.map(crypto => (
                    <button
                      key={crypto.symbol}
                      onClick={() => setSelectedCrypto(crypto.symbol)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCrypto === crypto.symbol
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{crypto.icon}</div>
                      <div className="text-sm font-semibold">{crypto.symbol}</div>
                      <div className="text-xs text-muted-foreground">{selectedPackage.prices[crypto.symbol]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Сумма к оплате</p>
                <p className="text-3xl font-bold text-primary">
                  {selectedPackage.prices[selectedCrypto]} {selectedCrypto}
                </p>
              </div>

              <div className="bg-background/50 rounded-xl p-4">
                <p className="text-sm text-muted-foreground mb-2">Адрес для оплаты {selectedCrypto === 'BTC' ? '(Сеть Bitcoin)' : '(Сеть BNB Smart Chain)'}</p>
                <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                  <p className="text-sm font-mono text-foreground flex-1 break-all">{PLATFORM_WALLETS[selectedCrypto as keyof typeof PLATFORM_WALLETS]}</p>
                  <Button size="icon" variant="ghost" onClick={copyAddress}>
                    <Icon name={copiedAddress ? "Check" : "Copy"} size={18} />
                  </Button>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon name="Info" className="text-accent mt-1" size={20} />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Инструкция:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Откройте Gem Wallet или другой крипто-кошелек</li>
                      <li>Отправьте точную сумму на указанный адрес</li>
                      <li>Пакет активируется автоматически после подтверждения</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button
                onClick={confirmPayment}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
              >
                <Icon name="Check" className="mr-2" size={20} />
                Я отправил платеж
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;