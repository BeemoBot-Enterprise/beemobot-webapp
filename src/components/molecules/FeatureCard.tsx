import * as React from "react";
import { Card } from "@/components/atoms/Card";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6">
    <div className="text-text-muted mb-3 [&>svg]:h-6 [&>svg]:w-6">{icon}</div>
    <h3 className="text-xl font-semibold text-text mb-1">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed">{description}</p>
  </Card>
);

export default FeatureCard;
