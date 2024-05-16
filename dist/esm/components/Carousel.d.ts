import React from 'react';
import './styles.css';
interface CarouselProps {
    aspectRatio: number;
    children: React.ReactNode;
}
export declare const Carousel: ({ aspectRatio, children }: CarouselProps) => React.JSX.Element;
export {};
