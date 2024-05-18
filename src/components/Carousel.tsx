import React, { useEffect, useState, useRef, ReactNode } from 'react'
import './styles.css'

interface CarouselProps {
    scale?: number,
    aspectRatio?: number,
    gap?: number,
    children: React.ReactNode
}

export const Carousel = ({ scale = 1, gap = 5, aspectRatio = 1.778, children }: CarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const leftArrowRef = useRef<HTMLDivElement>(null);
    const rightArrowRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [childWidth, setChildWidth] = useState(0);
    const [isSliding, setIsSliding] = useState(false);
    const [windowSize, setWindowSize] = useState(0);
    const [pressed, setPressed] = useState(false);
    const [arrowWidth, setArrowWidth] = useState(50);

    const setCarouselSizes = () => {
        const carouselContainer = carouselRef.current;
        const items: any = carouselContainer?.getElementsByClassName('item');

        if (carouselContainer && items) {
            const carouselWidth: number = carouselContainer.getBoundingClientRect().width;
            let itemsInWindow;

            if (carouselWidth >= 1400) {
                itemsInWindow = 8
                setArrowWidth(50);
            } else if (carouselWidth >= 1200) {
                itemsInWindow = 6
                setArrowWidth(50);
            } else if (carouselWidth >= 800) {
                itemsInWindow = 5;
                setArrowWidth(45);
            } else if (carouselWidth >= 600) {
                itemsInWindow = 4;
                setArrowWidth(40);
            } else {
                itemsInWindow = 2;
                setArrowWidth(35);
            }

            // set item window size
            setWindowSize(itemsInWindow);

            // set images width and height
            const imgWidth: number = ((carouselWidth - (arrowWidth * 2)) / itemsInWindow) - (gap * (itemsInWindow - 1)) / itemsInWindow;
            const imgHeight: number = imgWidth / aspectRatio;
            setChildWidth(imgWidth);

            // set height and width of the right and left arrows
            const leftArrow = leftArrowRef.current;
            const rightArrow = rightArrowRef.current;
            leftArrow!.style.width = `${arrowWidth}px`;
            leftArrow!.style.height = `${imgHeight}px`;
            rightArrow!.style.width = `${arrowWidth}px`;
            rightArrow!.style.height = `${imgHeight}px`;

            // set carousel height
            carouselContainer.style.height = `${imgHeight * scale}px`

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
        // set left arrow display
        setShowLeftArrow(showLeftArrow);

        // set carousel width
        setCarouselSizes();
        window.addEventListener('resize', setCarouselSizes);
    }, []);

    // update left arrow
    useEffect(() => {
        const leftArrow = leftArrowRef.current;

        if (showLeftArrow) {
            leftArrow!.style.display = "flex";
        } else {
            leftArrow!.style.display = "none";
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

    const mouseOver = (itemDiv: HTMLDivElement, calledDirectly: boolean) => {
        const handleMouseOver = () => {
            const carouselWidth = carouselRef.current?.getBoundingClientRect().width;
            const pos: number = parseFloat(itemDiv.style.left);
            const xPos = ((childWidth * scale) - childWidth) / 2; // difference between the child width and new width divided by 2

            itemDiv.style.width = `${(childWidth * scale)}px`;
            itemDiv.style.height = `${((childWidth / aspectRatio) * scale)}px`;
            itemDiv.style.zIndex = '200';

            // if first or last item in the carousel window
            if (pos === arrowWidth) {
                ;
            } else if ((pos + childWidth) === (carouselWidth! - arrowWidth)) {
                itemDiv.style.transform = `translate(${-(2 * xPos)}px, -50%)`;
            } else {
                itemDiv.style.transform = `translate(${-xPos}px, -50%)`;
            }
        }
        if (!calledDirectly)
            handleMouseOver();

        return () => {
            handleMouseOver();
        }

    }

    const mouseLeave = (itemDiv: HTMLDivElement, calledDirectly: boolean) => {
        const handleMouseLeave = () => {
            itemDiv.style.width = `${(childWidth)}px`;
            itemDiv.style.height = `${(childWidth / aspectRatio)}px`;
            itemDiv.style.transform = 'translate(0, -50%)';
            itemDiv.style.zIndex = '1';
        }

        if (!calledDirectly)
            handleMouseLeave();

        return () => {
            handleMouseLeave();
        }
    }

    const slideRight = () => {
        const carouselContainer = carouselRef.current;
        const items: any = carouselContainer?.getElementsByClassName('item');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;

        // check if is sliding
        if (isSliding) return;

        setIsSliding(true);

        // append node to the end
        if (items) {
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
                let newNode: HTMLDivElement;

                if (pressed) {
                    newNode = items[i + 1].cloneNode(true) as HTMLDivElement;
                } else {
                    newNode = items[i].cloneNode(true) as HTMLDivElement;
                }

                //manually attach event listeners
                newNode.addEventListener('mouseover', mouseOver(newNode, true));
                newNode.addEventListener('mouseleave', mouseLeave(newNode, true));

                const lastNode = items[items.length - 1];
                const lastNodePosition: any = parseFloat(lastNode.style.left) || 0;
                const newNodePosition: number = lastNodePosition + childWidth + gap;
                newNode.style.left = `${newNodePosition}px`;
                itemsToDelete++;
                carouselContainer!.appendChild(newNode);
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
        const carouselContainer = carouselRef.current;
        const items: any = carouselContainer?.getElementsByClassName('item');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;

        // check if is sliding
        if (isSliding) return;

        setIsSliding(true);

        // append node to the end
        if (items) {
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
                let newNode = items[index - 1].cloneNode(true) as HTMLDivElement;

                // manually attach event listeners
                newNode.addEventListener('mouseover', mouseOver(newNode, true));
                newNode.addEventListener('mouseleave', mouseLeave(newNode, true));

                const firstNode = items[0];
                const firstPosition: any = parseFloat(firstNode.style.left) || 0;
                const newNodePosition: number = firstPosition - (childWidth + gap);
                newNode.style.left = `${newNodePosition}px`;
                carouselContainer!.insertBefore(newNode, carouselContainer!.firstChild);
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

    // Mapping over children. Encapsulate each child in an item div
    const mappedChildren = React.Children.map(children, (child: ReactNode, index: number) => {

        // Check if the child is a valid React element
        if (React.isValidElement(child)) {
            return (
                <div key={index} className='item' onMouseOver={(e) => { mouseOver(e.currentTarget, false) }} onMouseLeave={(e) => { mouseLeave(e.currentTarget, false) }}>
                    {child}
                </div>
            );
        }

        // If the child is not a valid React element, return it as it is
        return child;
    });

    return (
        <div id="carousel-container">
            <div id="carousel" ref={carouselRef}>
                {mappedChildren}
            </div>

            <div id="left-arrow" ref={leftArrowRef} onClick={slideLeft}>
                <div className='arrow-lines-container'>
                    <div className='line r1'></div>
                    <div className='line r2'></div>
                </div>
            </div>

            <div id="right-arrow" ref={rightArrowRef} onClick={slideRight}>
                <div className='arrow-lines-container'>
                    <div className='line l1'></div>
                    <div className='line l2'></div>
                </div>
            </div>
        </div>
    )
}