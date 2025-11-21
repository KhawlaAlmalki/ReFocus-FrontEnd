import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Select, SelectContent, SelectItem,  SelectTrigger, SelectValue,} from 'src/components/ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,} from 'recharts';
import {ArrowLeft, TrendingUp, Download, Users, Clock, Star, Activity,} from 'lucide-react';

const gamePerformanceData = [
  { month: 'Jan', 'Focus Quest': 1245, 'Zen Garden': 432, 'Memory Match': 234 },
  { month: 'Feb', 'Focus Quest': 1450, 'Zen Garden': 589, 'Memory Match': 345 },
  { month: 'Mar', 'Focus Quest': 1890, 'Zen Garden': 754, 'Memory Match': 512 },
  { month: 'Apr', 'Focus Quest': 2100, 'Zen Garden': 921, 'Memory Match': 678 },
];

const engagementData = [
  { name: 'New Users', value: 35 },
  { name: 'Returning Users', value: 65 },
];

const sessionDurationData = [
  { game: 'Focus Quest', avgDuration: 28, target: 30 },
  { game: 'Zen Garden', avgDuration: 22, target: 25 },
  { game: 'Memory Match', avgDuration: 18, target: 20 },
  { game: 'Rhythm Runner', avgDuration: 25, target: 30 },
];

const COLORS = ['#0c2d59', '#6e94ac', '#d4a574', '#5b7c99'];

export default function DeveloperAnalytics() {
  const [selectedGame, setSelectedGame] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  const totalPlays = gamePerformanceData.reduce(
    (sum, month) => sum + month['Focus Quest'] + month['Zen Garden'] + month['Memory Match'],
    0
  );
  const avgRating = 4.7;
  const activeUsers = 1245;
  const avgSessionDuration = 24;
}