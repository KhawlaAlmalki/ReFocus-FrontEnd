import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-muted">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">
          This page is being built. Continue prompting me to help fill in this page content!
        </p>
        <p className="text-xs text-muted-foreground">
          Path: <code className="bg-background px-2 py-1 rounded">{location.pathname}</code>
        </p>
      </Card>
    </div>
  );
};
