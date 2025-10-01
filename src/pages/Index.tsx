import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance] = useState('0.00');
  const [referralCode] = useState('REF123ABC');
  const [copiedLink, setCopiedLink] = useState(false);

  const packages = [
    {
      id: 1,
      name: 'Starter',
      price: '0.1',
      commission: '3%',
      benefits: ['1 уровень рефералов', 'Базовая комиссия', 'Еженедельные выплаты']
    },
    {
      id: 2,
      name: 'Professional',
      price: '0.5',
      commission: '5%',
      benefits: ['3 уровня рефералов', 'Увеличенная комиссия', 'Ежедневные выплаты', 'Приоритетная поддержка']
    },
    {
      id: 3,
      name: 'VIP',
      price: '1.0',
      commission: '10%',
      benefits: ['5 уровней рефералов', 'Максимальная комиссия', 'Моментальные выплаты', 'VIP поддержка', 'Бонусы за объем']
    }
  ];

  const referrals = [
    { id: 1, address: '0x7a2f...9b3c', level: 1, earned: '0.015', status: 'active' },
    { id: 2, address: '0x4d8e...1f2a', level: 2, earned: '0.008', status: 'active' },
    { id: 3, address: '0x9c3b...7e4d', level: 1, earned: '0.023', status: 'active' }
  ];

  const connectWallet = () => {
    setWalletConnected(true);
    toast({
      title: 'Кошелек подключен',
      description: 'Ваш BNB кошелек успешно подключен'
    });
  };

  const copyReferralLink = () => {
    const link = `https://crypto-platform.com/ref/${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: 'Ссылка скопирована',
      description: 'Реферальная ссылка скопирована в буфер обмена'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                CRYPTO PLATFORM
              </h1>
              <p className="text-muted-foreground text-lg">Многоуровневая реферальная система на BNB</p>
            </div>
            {!walletConnected ? (
              <Button
                onClick={connectWallet}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                <Icon name="Wallet" className="mr-2" size={20} />
                Подключить кошелек
              </Button>
            ) : (
              <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-2xl border border-primary/20">
                <Icon name="Wallet" className="text-primary" size={24} />
                <div>
                  <p className="text-xs text-muted-foreground">Баланс BNB</p>
                  <p className="text-xl font-bold text-foreground">{balance}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 animate-scale-in">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="TrendingUp" className="text-primary" size={24} />
                <p className="text-muted-foreground text-sm">Всего заработано</p>
              </div>
              <p className="text-3xl font-bold text-foreground">0.046 BNB</p>
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

        <section className="mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Пакеты участия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <p className="text-4xl font-bold text-foreground mb-1">{pkg.price} BNB</p>
                  <p className="text-muted-foreground text-sm">единоразово</p>
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
                  className={`w-full ${
                    index === 0 ? 'bg-gradient-to-r from-primary to-primary/80' :
                    index === 1 ? 'bg-gradient-to-r from-secondary to-secondary/80' :
                    'bg-gradient-to-r from-accent to-accent/80'
                  } hover:opacity-90 transition-opacity`}
                  disabled={!walletConnected}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={18} />
                  Приобрести
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Link" className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Реферальная ссылка</h2>
              </div>
              
              <div className="bg-background/50 rounded-xl p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2">Ваша реферальная ссылка</p>
                <p className="text-sm text-foreground font-mono break-all mb-3">
                  https://crypto-platform.com/ref/{referralCode}
                </p>
                <Button
                  onClick={copyReferralLink}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Icon name={copiedLink ? "Check" : "Copy"} className="mr-2" size={18} />
                  {copiedLink ? 'Скопировано!' : 'Скопировать ссылку'}
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Info" size={16} />
                  <p>Поделитесь ссылкой для получения комиссии</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="TrendingUp" size={16} />
                  <p>Комиссия начисляется автоматически</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Wallet" className="text-secondary" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Управление балансом</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Сумма BNB</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-background/50 border-border"
                    disabled={!walletConnected}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                    disabled={!walletConnected}
                  >
                    <Icon name="ArrowDownToLine" className="mr-2" size={18} />
                    Пополнить
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-secondary to-secondary/80 hover:opacity-90"
                    disabled={!walletConnected}
                  >
                    <Icon name="ArrowUpFromLine" className="mr-2" size={18} />
                    Вывести
                  </Button>
                </div>

                <div className="bg-muted/30 rounded-lg p-3 mt-4">
                  <p className="text-xs text-muted-foreground mb-1">Минимальный вывод</p>
                  <p className="text-sm font-semibold text-foreground">0.01 BNB</p>
                </div>
              </div>
            </Card>
          </div>
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
                    <p className="text-lg font-bold text-accent">{ref.earned} BNB</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;
