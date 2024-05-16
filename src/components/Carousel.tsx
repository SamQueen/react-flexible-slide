import React, { useEffect, useState } from 'react'
import './styles.css'

interface CarouselProps {
    aspectRatio: number,
    children: React.ReactNode
}

export const Carousel = ({ aspectRatio, children }: CarouselProps) => {
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [childWidth, setChildWidth] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [windowSize, setWindowSize] = useState(0);
    const [pressed, setPressed] = useState(false);
    let arrowWidth: number = 0;
    const gap = 5;

    const setCarouselSizes = () => {
        const carousel: HTMLElement | null = document.getElementById('carousel');
        const items: any = document.getElementsByClassName('item');

        if (carousel && items.length > 0) {
            const carouselWidth: number = carousel.getBoundingClientRect().width;
            let itemsInWindow;

            if (carouselWidth >= 1200) {
                itemsInWindow = 6
                arrowWidth = 50;
            } else if (carouselWidth >= 800) {
                itemsInWindow = 5;
                arrowWidth = 45;
            } else if (carouselWidth >= 600) {
                itemsInWindow = 4;
                arrowWidth = 40;
            } else {
                itemsInWindow = 2;
                arrowWidth = 35;
            }

            // set item window size
            setWindowSize(itemsInWindow);

            // set images width and height
            const imgWidth: number = ((carouselWidth - (arrowWidth * 2)) / itemsInWindow) - (gap * (itemsInWindow - 1)) / itemsInWindow;
            const imgHeight: number = imgWidth / aspectRatio;
            setChildWidth(imgWidth);

            // set width of the right and left arrows
            const leftArrow: any = document.getElementById('left-arrow');
            const rightArrow: any = document.getElementById('right-arrow');
            leftArrow.style.width = `${arrowWidth}px`;
            rightArrow.style.width = `${arrowWidth}px`;

            // set carousel height
            carousel.style.height = `${imgHeight}px`

            for (let i = 0; i < items.length; i++) {
                items[i].style.width = `${imgWidth}px`;
                items[i].style.height = `${imgHeight}px`;

                if (i === 0) {
                    items[i].style.left = `${(imgWidth * i) + arrowWidth}px`;
                } else {
                    items[i].style.left = `${(imgWidth * i) + (gap * i) + arrowWidth}px`;
                }
            }

        }
    };

    // init 
    useEffect(() => {
        const items: any = document.getElementsByClassName('item');
        const carousel: HTMLElement | null = document.getElementById('carousel');

        // set left arrow display
        setShowLeftArrow(showLeftArrow);

        if (carousel && items.length > 0) {
            // set carousel width
            setCarouselSizes();
            window.addEventListener('resize', setCarouselSizes);
        }
    }, []);

    // update left arrow
    useEffect(() => {
        const leftArrow: any = document.getElementById('left-arrow');

        if (showLeftArrow) {
            leftArrow.style.display = "block";
        } else {
            leftArrow.style.display = "none";
        }
    }, [showLeftArrow])

    const animateSlide = async (items: any, direction: string): Promise<void> => {

        return new Promise<void>(resolve => {
            setTimeout(() => {
                for (let i = 0; i < items.length; i++) {
                    const child: any = items[i];
                    const currentPosition: any = parseFloat(child.style.left) || 0;
                    let newPosition: number;

                    if (direction === 'right') {
                        newPosition = currentPosition - (childWidth * windowSize) - (gap * windowSize);
                    } else {
                        newPosition = currentPosition + (childWidth * windowSize) + (gap * windowSize);
                    }
                    child.style.left = `${newPosition}px`;
                }
                resolve();
            }, 100);
        });
    }

    const slideRight = () => {
        const items: any = document.getElementsByClassName('item');
        const carouselDiv: HTMLElement | null = document.getElementById('carousel');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        console.log(items.length);

        // check if is sliding
        if (isSliding) return;

        setIsSliding(true);

        // append node to the end
        if (carouselDiv) {
            const carousel = document.getElementById('carousel');
            const rigthBound = carousel!.getBoundingClientRect().width;

            for (let item of items) {
                const pos = parseFloat(item.style.left);

                if (pos > rigthBound) {
                    itemsToRight++;
                }
            }


            // append enough nodes to fill in the gaps
            for (let i = 0; i < (windowSize - itemsToRight); i++) {
                let newNode: any;

                if (pressed) {
                    newNode = items[i + 1].cloneNode(true);
                } else {
                    newNode = items[i].cloneNode(true);
                }

                const lastNode = items[items.length - 1];
                const lastNodePosition: any = parseFloat(lastNode.style.left) || 0;
                const newNodePosition: number = lastNodePosition + childWidth + gap;
                newNode.style.left = `${newNodePosition}px`;
                itemsToDelete++;
                carouselDiv.appendChild(newNode);
            }

            animateSlide(items, "right").then(() => {
                setTimeout(() => {
                    // show left arrow
                    if (!showLeftArrow) setShowLeftArrow(true);

                    // remove extra nodes
                    if (!pressed) itemsToDelete--;

                    for (let i = 0; i < itemsToDelete; i++) {
                        items[0].remove();
                    }

                    setIsSliding(false);
                    setPressed(true);
                }, 1000);
            });

        }
    }

    const slideLeft = () => {
        const items: any = document.getElementsByClassName('item');
        const carouselDiv: HTMLElement | null = document.getElementById('carousel');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        console.log(items.length);
        // check if is sliding
        if (isSliding) return;

        setIsSliding(true);

        // append node to the end
        if (carouselDiv) {
            const leftBound = 0;
            let itemsToLeft: number = 0;

            for (let item of items) {
                const pos = parseFloat(item.style.left);

                if (pos < leftBound) {
                    itemsToLeft++;
                }
            }

            // append enough nodes to fill in the gaps
            let index = items.length - 1;
            for (let i = 0; i < (windowSize - itemsToRight); i++) {
                let newNode = items[index - 1].cloneNode(true);

                const firstNode = items[0];
                const firstPosition: any = parseFloat(firstNode.style.left) || 0;
                const newNodePosition: number = firstPosition - (childWidth + gap);
                newNode.style.left = `${newNodePosition}px`;
                carouselDiv.insertBefore(newNode, carouselDiv.firstChild);
                itemsToDelete++;
            }

            animateSlide(items, "left").then(() => {
                setTimeout(() => {

                    // remove extra nodes
                    for (let i = 0; i < windowSize; i++) {
                        items[items.length - 1].remove();
                    }

                    setIsSliding(false);
                }, 1000);
            });
        }
    }

    return (
        <div id="carousel-container">
            <div id="carousel">
                {children}
            </div>

            <div id="left-arrow" onClick={slideLeft}> </div>

            <div id="right-arrow" onClick={slideRight}> </div>
        </div>
    )
}