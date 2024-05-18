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
const Carousel = ({ scale = 1, gap = 5, aspectRatio = 1.778, children }) => {
    const carouselRef = (0, react_1.useRef)(null);
    const leftArrowRef = (0, react_1.useRef)(null);
    const rightArrowRef = (0, react_1.useRef)(null);
    const [showLeftArrow, setShowLeftArrow] = (0, react_1.useState)(false);
    const [childWidth, setChildWidth] = (0, react_1.useState)(0);
    const [isSliding, setIsSliding] = (0, react_1.useState)(false);
    const [windowSize, setWindowSize] = (0, react_1.useState)(0);
    const [pressed, setPressed] = (0, react_1.useState)(false);
    let arrowWidth = 0;
    const setCarouselSizes = () => {
        const carouselContainer = carouselRef.current;
        const items = carouselContainer === null || carouselContainer === void 0 ? void 0 : carouselContainer.getElementsByClassName('item');
        if (carouselContainer && items) {
            const carouselWidth = carouselContainer.getBoundingClientRect().width;
            let itemsInWindow;
            if (carouselWidth >= 1400) {
                itemsInWindow = 8;
                arrowWidth = 50;
            }
            else if (carouselWidth >= 1200) {
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
            // set height and width of the right and left arrows
            const leftArrow = leftArrowRef.current;
            const rightArrow = rightArrowRef.current;
            leftArrow.style.width = `${arrowWidth}px`;
            leftArrow.style.height = `${imgHeight}px`;
            rightArrow.style.width = `${arrowWidth}px`;
            rightArrow.style.height = `${imgHeight}px`;
            // set carousel height
            carouselContainer.style.height = `${imgHeight * scale}px`;
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
        // set left arrow display
        setShowLeftArrow(showLeftArrow);
        // set carousel width
        setCarouselSizes();
        window.addEventListener('resize', setCarouselSizes);
    }, []);
    // update left arrow
    (0, react_1.useEffect)(() => {
        const leftArrow = leftArrowRef.current;
        if (showLeftArrow) {
            leftArrow.style.display = "flex";
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
        const carouselContainer = carouselRef.current;
        const items = carouselContainer === null || carouselContainer === void 0 ? void 0 : carouselContainer.getElementsByClassName('item');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        console.log(items.length);
        // check if is sliding
        if (isSliding)
            return;
        setIsSliding(true);
        // append node to the end
        if (items) {
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
                carouselContainer.appendChild(newNode);
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
        const carouselContainer = carouselRef.current;
        const items = carouselContainer === null || carouselContainer === void 0 ? void 0 : carouselContainer.getElementsByClassName('item');
        let itemsToRight = 0; // items to the left of the window
        let itemsToDelete = 0;
        // check if is sliding
        if (isSliding)
            return;
        setIsSliding(true);
        // append node to the end
        if (items) {
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
                carouselContainer.insertBefore(newNode, carouselContainer.firstChild);
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
    const mouseOver = (itemDiv) => {
        const xPos = ((childWidth * scale) - childWidth) / 2; // difference between the child width and new width divided by 2
        itemDiv.style.width = `${(childWidth * scale)}px`;
        itemDiv.style.height = `${((childWidth / aspectRatio) * scale)}px`;
        itemDiv.style.transform = `translate(${-xPos}px, -50%)`;
        itemDiv.style.zIndex = '200';
    };
    const mouseLeave = (itemDiv) => {
        itemDiv.style.width = `${(childWidth)}px`;
        itemDiv.style.height = `${(childWidth / aspectRatio)}px`;
        itemDiv.style.transform = 'translate(0, -50%)';
        itemDiv.style.zIndex = '1';
    };
    // Mapping over children. Encapsulate each child in an item div
    const mappedChildren = react_1.default.Children.map(children, (child, index) => {
        // Check if the child is a valid React element
        if (react_1.default.isValidElement(child)) {
            return (react_1.default.createElement("div", { key: index, className: 'item', onMouseOver: (e) => { mouseOver(e.currentTarget); }, onMouseLeave: (e) => { mouseLeave(e.currentTarget); } }, child));
        }
        // If the child is not a valid React element, return it as it is
        return child;
    });
    return (react_1.default.createElement("div", { id: "carousel-container" },
        react_1.default.createElement("div", { id: "carousel", ref: carouselRef }, mappedChildren),
        react_1.default.createElement("div", { id: "left-arrow", ref: leftArrowRef, onClick: slideLeft },
            react_1.default.createElement("div", { className: 'arrow-lines-container' },
                react_1.default.createElement("div", { className: 'line r1' }),
                react_1.default.createElement("div", { className: 'line r2' }))),
        react_1.default.createElement("div", { id: "right-arrow", ref: rightArrowRef, onClick: slideRight },
            react_1.default.createElement("div", { className: 'arrow-lines-container' },
                react_1.default.createElement("div", { className: 'line l1' }),
                react_1.default.createElement("div", { className: 'line l2' })))));
};
exports.Carousel = Carousel;
//# sourceMappingURL=Carousel.js.map