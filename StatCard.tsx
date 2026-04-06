import clsx from 'clsx';

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: 'rose' | 'forest' | 'sage' | 'sky' | 'peach';
};

const colorMap = {
  rose:   'bg-brand-rose/10 text-brand-rose',
  forest: 'bg-brand-forest/10 text-brand-forest',
  sage:   'bg-brand-sage/20 text-brand-forest',
  sky:    'bg-brand-sky/30 text-brand-charcoal/70',
  peach:  'bg-brand-peach/20 text-brand-charcoal/70',
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'rose' }: Props) {
  return (
    <div className="bg-white rounded-brand shadow-soft p-6 hover:shadow-card transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
            {title}
          </p>
          <p className="text-2xl font-semibold text-brand-charcoal font-body">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-brand-charcoal/40 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={clsx(
              'text-xs font-medium mt-2',
              trend.positive ? 'text-green-600' : 'text-red-500'
            )}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={clsx(
          'w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0',
          colorMap[color]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
