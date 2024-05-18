import React from 'react';
import './styles.css';
interface CarouselProps {
    scale?: number;
    aspectRatio?: number;
    gap?: number;
    children: React.ReactNode;
}
export declare const Carousel: ({ scale, gap, aspectRatio, children }: CarouselProps) => React.JSX.Element;
export {};
