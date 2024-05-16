"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carousel = void 0;
const react_1 = __importStar(require("react"));
require("./styles.css");
const Carousel = ({ aspectRatio, children }) => {
    const [showLeftArrow, setShowLeftArrow] = (0, react_1.useState)(false);
    const [childWidth, setChildWidth] = (0, react_1.useState)(0);
    const [isSliding, setIsSliding] = (0, react_1.useState)(false);
    const [windowSize, setWindowSize] = (0, react_1.useState)(0);
    const [pressed, setPressed] = (0, react_1.useState)(false);
    let arrowWidth = 0;
    const gap = 5;
    const setCarouselSizes = () => {
        const carousel = document.getElementById('carousel');
        const items = document.getElementsByClassName('item');
        if (carousel && items.length > 0) {
            const carouselWidth = carousel.getBoundingClientRect().width;
            let itemsInWindow;
            if (carouselWidth >= 1200) {
                itemsInWindow = 6;
                arrowWidth = 50;
            }
            else if (carouselWidth >= 800) {
                itemsInWindow = 5;
                arrowWidth = 45;
            }
            else if (carouselWidth >= 600) {
                itemsInWindow = 4;
                arrowWidth = 40;
            }
            else {
                itemsInWindow = 2;
                arrowWidth = 35;
            }
            // set item window size
            setWindowSize(itemsInWindow);
            // set images width and height
            const imgWidth = ((carouselWidth - (arrowWidth * 2)) / itemsInWindow) - (gap * (itemsInWindow - 1)) / itemsInWindow;
            const imgHeight = imgWidth / aspectRatio;
            setChildWidth(imgWidth);
            // set width of the right and left arrows
            const leftArrow = document.getElementById('left-arrow');
            const rightArrow = document.getElementById('right-arrow');
            leftArrow.style.width = `${arrowWidth}px`;
            rightArrow.style.width = `${arrowWidth}px`;
            // set carousel height
            carousel.style.height = `${imgHeight}px`;
            for (let i = 0; i < items.length; i++) {
                items[i].style.width = `${imgWidth}px`;
                items[i].style.height = `${imgHeight}px`;
                if (i === 0) {
                    items[i].style.left = `${(imgWidth * i) + arrowWidth}px`;
                }
                else {
                    items[i].style.left = `${(imgWidth * i) + (gap * i) + arrowWidth}px`;
                }
            }
        }
    };
    // init 
    (0, react_1.useEffect)(() => {
        const items = document.getElementsByClassName('item');
        const carousel = document.getElementById('carousel');
        // set left arrow display
        setShowLeftArrow(showLeftArrow);
        if (carousel && items.length > 0) {
            // set carousel width
            setCarouselSizes();
            window.addEventListener('resize', setCarouselSizes);
        }
    }, []);
    // update left arrow
    (0, react_1.useEffect)(() => {
        const leftArrow = document.getElementById('left-arrow');
        if (showLeftArrow) {
            leftArrow.style.display = "block";
        }
        else {
            leftArrow.style.display = "none";
        }
    }, [showLeftArrow]);
    const animateSlide = (items, direction) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise(resolve => {
            setTimeout(() => {
                for (let i = 0; i < items.length; i++) {
                    const child = items[i];
                    const currentPosition = parseFloat(child.style.left) || 0;
                    let newPosition;
                    if (direction === 'right') {
                        newPosition = currentPosition - (childWidth * windowSize) - (gap * windowSize);
                    }
                    else {
                        newPosition = currentPosition + (childWidth * windowSize) + (gap * windowSize);
                    }
                    child.style.left = `${newPosition}px`;
                }
                resolve();
            }, 100);
        });
    });
    const slideRight = () => {
        const items = document.getElementsByClassName('item');
        const carouselDiv = document.getElementById('carousel');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        console.log(items.length);
        // check if is sliding
        if (isSliding)
            return;
        setIsSliding(true);
        // append node to the end
        if (carouselDiv) {
            const carousel = document.getElementById('carousel');
            const rigthBound = carousel.getBoundingClientRect().width;
            for (let item of items) {
                const pos = parseFloat(item.style.left);
                if (pos > rigthBound) {
                    itemsToRight++;
                }
            }
            // append enough nodes to fill in the gaps
            for (let i = 0; i < (windowSize - itemsToRight); i++) {
                let newNode;
                if (pressed) {
                    newNode = items[i + 1].cloneNode(true);
                }
                else {
                    newNode = items[i].cloneNode(true);
                }
                const lastNode = items[items.length - 1];
                const lastNodePosition = parseFloat(lastNode.style.left) || 0;
                const newNodePosition = lastNodePosition + childWidth + gap;
                newNode.style.left = `${newNodePosition}px`;
                itemsToDelete++;
                carouselDiv.appendChild(newNode);
            }
            animateSlide(items, "right").then(() => {
                setTimeout(() => {
                    // show left arrow
                    if (!showLeftArrow)
                        setShowLeftArrow(true);
                    // remove extra nodes
                    if (!pressed)
                        itemsToDelete--;
                    for (let i = 0; i < itemsToDelete; i++) {
                        items[0].remove();
                    }
                    setIsSliding(false);
                    setPressed(true);
                }, 1000);
            });
        }
    };
    const slideLeft = () => {
        const items = document.getElementsByClassName('item');
        const carouselDiv = document.getElementById('carousel');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        console.log(items.length);
        // check if is sliding
        if (isSliding)
            return;
        setIsSliding(true);
        // append node to the end
        if (carouselDiv) {
            const leftBound = 0;
            let itemsToLeft = 0;
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
                const firstPosition = parseFloat(firstNode.style.left) || 0;
                const newNodePosition = firstPosition - (childWidth + gap);
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
    };
    return (react_1.default.createElement("div", { id: "carousel-container" },
        react_1.default.createElement("div", { id: "carousel" }, children),
        react_1.default.createElement("div", { id: "left-arrow", onClick: slideLeft }, " "),
        react_1.default.createElement("div", { id: "right-arrow", onClick: slideRight }, " ")));
};
exports.Carousel = Carousel;
//# sourceMappingURL=Carousel.js.map