function launchCarousel(id) {
    const scrollRightBtn = document.querySelector(id + " .scroll-right");
    const scrollLeftBtn = document.querySelector(id + " .scroll-left");
    const carousel = document.querySelector(id + " .carousel-boxes-container");
    carousel.scrollLeft = 0; //reset on position 0

    const getCarouselMeasuresObj = () => {
        return {
            selectItem: function () { return document.querySelectorAll(id + ' .select-carousel-item') },
            itemWidth: function () { return this.selectItem()[0].offsetWidth },
            carouselWidth: function () { return this.itemWidth() * this.selectItem().length },
            wrapperWidth: function () { return document.querySelector(id).offsetWidth },
            optimumScrollShift: function () {
                let itemWidth = this.itemWidth();
                let calculatedOptimum = Math.floor(this.wrapperWidth() / this.itemWidth()) * this.itemWidth();
                return (itemWidth > calculatedOptimum) ? itemWidth : calculatedOptimum;
            },
            endLimit: function () {
                return (this.carouselWidth() - ((this.wrapperWidth() / this.carouselWidth())) * this.carouselWidth());
            },
            scrollbarHideStyle: function () {
                return "top: " + (document.querySelector(id + ' .carousel-hide-scrollbar-wrapper').clientHeight - document.querySelector(id + ' .carousel-boxes-container').clientHeight) + "px;";
            }
        }
    }

    let carouselMeasures = getCarouselMeasuresObj();
    // hide scrollbar according to current scrollbar height
    carousel.style = carouselMeasures.scrollbarHideStyle();

    /* change values when window is resized */
    window.addEventListener('resize', function () {
        let carouselMeasures = getCarouselMeasuresObj();
        // hide scrollbar according to current scrollbar height
        carousel.style = carouselMeasures.scrollbarHideStyle();
    });

    //scroll animation
    function scrollTo(element, scrollIncrement, duration) {
        var start = element.scrollLeft;
        change = (element.scrollLeft + scrollIncrement) - start,
            currentTime = 0,
            incrementTime = 20;

        var animateScroll = function () {
            currentTime += incrementTime;
            var val = Math.floor(Math.easeInOutQuad(currentTime, start, change, duration));
            element.scrollLeft = val;
            if (currentTime < duration) { setTimeout(animateScroll, incrementTime); }
        };
        animateScroll();
    }
    //t=current time //b=start value //c=change in value //d=duration 
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2; if (t < 1) return c / 2 * t * t
            + b; t--; return -c / 2 * (t * (t - 2) - 1) + b;
    };

    // move via buttons
    scrollRightBtn.addEventListener('click', function () {
        scrollTo(carousel, carouselMeasures.optimumScrollShift(), 500);
    }, false);
    scrollLeftBtn.addEventListener('click', function () {
        scrollTo(carousel, -(carouselMeasures.optimumScrollShift()), 500);
    }, false);

    // hide arrow buttons depending on scroll position
    carousel.addEventListener('scroll', function (e) {
        if (carousel.scrollLeft > 0) {
            scrollLeftBtn.style.display = "flex";
        } else {
            scrollLeftBtn.style.display = "none";
        }

        if (Math.ceil(carousel.scrollLeft) >= carouselMeasures.endLimit()) {
            scrollRightBtn.style.display = "none";
        } else {
            scrollRightBtn.style.display = "flex";
        }
    });

}
