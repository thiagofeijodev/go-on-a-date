import { type ReactNode } from 'react';

interface Props {
  step: number;
  children: ReactNode;
}

export default function StepTransition({ step, children }: Props) {
  return (
    <div key={step} className="animate-fade-slide w-full flex flex-col items-center">
      {children}
    </div>
  );
}
