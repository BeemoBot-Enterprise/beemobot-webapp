import * as React from "react";
import { Card } from "@/components/atoms/Card";

export interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

const StatCard = ({ label, value, hint }: StatCardProps) => (
  <Card className="p-6 flex flex-col gap-1">
    <span className="text-sm text-text-muted">{label}</span>
    <span className="text-3xl font-semibold text-text">{value}</span>
    {hint && <span className="text-xs text-text-muted">{hint}</span>}
  </Card>
);

export default StatCard;
