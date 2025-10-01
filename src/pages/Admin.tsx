import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface WithdrawRequest {
  id: number;
  user: string;
  amount: string;
  crypto: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  fee: string;
  userReceives: string;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'package';
  user: string;
  amount: string;
  crypto: string;
  fee: string;
  earnings: string;
  date: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedCrypto, setSelectedCrypto] = useState('all');

  const [withdrawRequests] = useState<WithdrawRequest[]>([
    {
      id: 1,
      user: '0x7a2f...9b3c',
      amount: '2.5',
      crypto: 'BNB',
      address: '0x1234567890123456789012345678901234567890',
      status: 'pending',
      date: '2025-01-10 15:30',
      fee: '0.125',
      userReceives: '2.375'
    },
    {
      id: 2,
      user: '0x4d8e...1f2a',
      amount: '0.05',
      crypto: 'BTC',
      address: '0x9876543210987654321098765432109876543210',
      status: 'pending',
      date: '2025-01-10 14:20',
      fee: '0.0025',
      userReceives: '0.0475'
    },
    {
      id: 3,
      user: '0x9c3b...7e4d',
      amount: '1.0',
      crypto: 'BNB',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      status: 'approved',
      date: '2025-01-09 18:45',
      fee: '0.05',
      userReceives: '0.95'
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: 'deposit',
      user: '0x7a2f...9b3c',
      amount: '1.0',
      crypto: 'BNB',
      fee: '10%',
      earnings: '0.1',
      date: '2025-01-10 16:00'
    },
    {
      id: 2,
      type: 'package',
      user: '0x4d8e...1f2a',
      amount: '0.5',
      crypto: 'BNB',
      fee: '100%',
      earnings: '0.5',
      date: '2025-01-10 15:30'
    },
    {
      id: 3,
      type: 'withdraw',
      user: '0x9c3b...7e4d',
      amount: '2.0',
      crypto: 'BTC',
      fee: '5%',
      earnings: '0.1',
      date: '2025-01-10 14:15'
    },
    {
      id: 4,
      type: 'deposit',
      user: '0x1a2b...3c4d',
      amount: '0.01',
      crypto: 'BTC',
      fee: '10%',
      earnings: '0.001',
      date: '2025-01-10 13:00'
    }
  ]);

  const stats = {
    today: {
      deposits: { BNB: '1.5', BTC: '0.02', earnings: { BNB: '0.15', BTC: '0.002' } },
      withdraws: { BNB: '3.0', BTC: '0.05', earnings: { BNB: '0.15', BTC: '0.0025' } },
      packages: { BNB: '1.5', BTC: '0.015', earnings: { BNB: '1.5', BTC: '0.015' } },
      total: { BNB: '1.8', BTC: '0.0195' }
    },
    week: {
      deposits: { BNB: '10.5', BTC: '0.15', earnings: { BNB: '1.05', BTC: '0.015' } },
      withdraws: { BNB: '8.0', BTC: '0.12', earnings: { BNB: '0.4', BTC: '0.006' } },
      packages: { BNB: '5.5', BTC: '0.075', earnings: { BNB: '5.5', BTC: '0.075' } },
      total: { BNB: '6.95', BTC: '0.096' }
    },
    month: {
      deposits: { BNB: '45.0', BTC: '0.65', earnings: { BNB: '4.5', BTC: '0.065' } },
      withdraws: { BNB: '35.0', BTC: '0.5', earnings: { BNB: '1.75', BTC: '0.025' } },
      packages: { BNB: '22.0', BTC: '0.3', earnings: { BNB: '22.0', BTC: '0.3' } },
      total: { BNB: '28.25', BTC: '0.39' }
    }
  };

  const currentStats = stats[selectedPeriod as keyof typeof stats];

  const handleApprove = async (request: WithdrawRequest) => {
    toast({
      title: 'Заявка одобрена',
      description: `Отправьте ${request.userReceives} ${request.crypto} на адрес ${request.address.slice(0, 10)}...`
    });
  };

  const handleReject = async (request: WithdrawRequest) => {
    toast({
      title: 'Заявка отклонена',
      description: `Вывод для ${request.user} отклонён`,
      variant: 'destructive'
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Адрес скопирован',
      description: 'Адрес скопирован в буфер обмена'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return 'ArrowDownToLine';
      case 'withdraw': return 'ArrowUpFromLine';
      case 'package': return 'ShoppingCart';
      default: return 'Coins';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Пополнение';
      case 'withdraw': return 'Вывод';
      case 'package': return 'Пакет';
      default: return type;
    }
  };

  const pendingRequests = withdrawRequests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
                АДМИН ПАНЕЛЬ
              </h1>
              <p className="text-muted-foreground text-lg">Управление платформой и статистика</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[160px] bg-card border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pendingRequests.length > 0 && (
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 mb-8 animate-scale-in">
              <div className="flex items-center gap-3">
                <Icon name="AlertCircle" className="text-accent" size={24} />
                <div>
                  <p className="font-bold text-foreground">Новые заявки на вывод</p>
                  <p className="text-sm text-muted-foreground">{pendingRequests.length} заявок ожидают обработки</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 animate-scale-in">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="TrendingUp" className="text-primary" size={24} />
                <p className="text-muted-foreground text-sm">Общий заработок</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{currentStats.total.BNB} BNB</p>
              <p className="text-sm text-muted-foreground">{currentStats.total.BTC} BTC</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 animate-scale-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="ArrowDownToLine" className="text-secondary" size={24} />
                <p className="text-muted-foreground text-sm">С пополнений</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{currentStats.deposits.earnings.BNB} BNB</p>
              <p className="text-sm text-muted-foreground">{currentStats.deposits.earnings.BTC} BTC</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 animate-scale-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="ArrowUpFromLine" className="text-accent" size={24} />
                <p className="text-muted-foreground text-sm">С выводов</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{currentStats.withdraws.earnings.BNB} BNB</p>
              <p className="text-sm text-muted-foreground">{currentStats.withdraws.earnings.BTC} BTC</p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30 animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="ShoppingCart" className="text-primary" size={24} />
                <p className="text-muted-foreground text-sm">С пакетов</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{currentStats.packages.earnings.BNB} BNB</p>
              <p className="text-sm text-muted-foreground">{currentStats.packages.earnings.BTC} BTC</p>
            </Card>
          </div>
        </header>

        <section className="mb-12 animate-fade-in">
          <Card className="p-8 bg-gradient-to-br from-card to-accent/5 border-accent/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Icon name="FileText" className="text-accent" size={28} />
                <h2 className="text-2xl font-bold text-foreground">Заявки на вывод</h2>
              </div>
              <Badge className="bg-accent text-background">
                {pendingRequests.length} ожидают
              </Badge>
            </div>

            <div className="space-y-4">
              {withdrawRequests.map((request) => (
                <Card key={request.id} className={`p-6 ${
                  request.status === 'pending' ? 'bg-accent/10 border-accent/30' :
                  request.status === 'approved' ? 'bg-primary/10 border-primary/30' :
                  'bg-destructive/10 border-destructive/30'
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Icon name="User" className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-mono text-sm text-foreground">{request.user}</p>
                          <p className="text-xs text-muted-foreground">{request.date}</p>
                        </div>
                      </div>
                      <Badge className={
                        request.status === 'pending' ? 'bg-accent' :
                        request.status === 'approved' ? 'bg-primary' :
                        'bg-destructive'
                      }>
                        {request.status === 'pending' ? 'Ожидает' :
                         request.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Сумма заявки</p>
                        <p className="text-lg font-bold text-foreground">{request.amount} {request.crypto}</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Твоя комиссия</p>
                        <p className="text-lg font-bold text-accent">{request.fee} {request.crypto}</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Отправить</p>
                        <p className="text-lg font-bold text-primary">{request.userReceives} {request.crypto}</p>
                      </div>
                      <div className="bg-background/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Валюта</p>
                        <p className="text-lg font-bold text-foreground">{request.crypto}</p>
                      </div>
                    </div>

                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-2">Адрес получателя</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-foreground flex-1 break-all">{request.address}</p>
                        <Button size="icon" variant="ghost" onClick={() => copyAddress(request.address)}>
                          <Icon name="Copy" size={18} />
                        </Button>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(request)}
                          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                        >
                          <Icon name="Check" className="mr-2" size={18} />
                          Одобрить и отправить
                        </Button>
                        <Button
                          onClick={() => handleReject(request)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Icon name="X" className="mr-2" size={18} />
                          Отклонить
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </section>

        <section className="animate-fade-in">
          <Card className="p-8 bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Icon name="Activity" className="text-primary" size={28} />
                <h2 className="text-2xl font-bold text-foreground">История транзакций</h2>
              </div>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger className="w-[140px] bg-background border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="BNB">BNB</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {transactions
                .filter(t => selectedCrypto === 'all' || t.crypto === selectedCrypto)
                .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-secondary/20' :
                      tx.type === 'withdraw' ? 'bg-accent/20' :
                      'bg-primary/20'
                    }`}>
                      <Icon name={getTypeIcon(tx.type)} className={
                        tx.type === 'deposit' ? 'text-secondary' :
                        tx.type === 'withdraw' ? 'text-accent' :
                        'text-primary'
                      } size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{getTypeLabel(tx.type)}</p>
                        <Badge variant="outline" className="text-xs">{tx.crypto}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{tx.user} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Твой доход</p>
                    <p className="text-lg font-bold text-accent">+{tx.earnings} {tx.crypto}</p>
                    <p className="text-xs text-muted-foreground">из {tx.amount} {tx.crypto} ({tx.fee})</p>
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

export default Admin;
