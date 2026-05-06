/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";

export interface GamePreviewCardProps {
  slug: string;
  title: string;
  description: string;
  image: string | StaticImageData;
}

const GamePreviewCard = ({
  slug,
  title,
  description,
  image,
}: GamePreviewCardProps) => (
  <Card className="overflow-hidden flex flex-col">
    <div className="aspect-video relative bg-bg">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
    <div className="p-5 flex flex-col gap-3 flex-1">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed flex-1">
        {description}
      </p>
      <Link href={`/game/${slug}`} className="self-start">
        <Button variant="primary" size="sm">
          Jouer
        </Button>
      </Link>
    </div>
  </Card>
);

export default GamePreviewCard;
