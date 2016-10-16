
//carousel 생성자 함수
function Carousel(options) {
    var el = document.getElementById(options.id),
        autoplay       = options.autoplay || false,
        interval       = options.interval || 3000,
        controlDots    = options.dots && true,
        controlArrows  = options.arrows && true,
        controlButtons = options.buttons && true,

        count   = el.querySelectorAll('li').length,
        // options.initial >= count가 true 이면 count를, false 이면 options.initial을 반환 
        initial = 0 || (options.initial >= count) ? count : options.initial,
        current = 0,
        cycle   = null;

 
    if (count > 1) render();

   
    function render() {
        if (controlDots) showDots();
        if (controlArrows) showArrows();
        if (controlButtons) showButtons();
        if (autoplay) play();

        moveItem(count - 1, -el.offsetWidth + 'px', 'afterBegin');

        if (initial) initSlide(initial);
    }

  
    function moveItem(i, marginLeft, position) {
        var itemToMove = el.querySelectorAll(".carousel-items li")[i];
        itemToMove.style.marginLeft = marginLeft;

        el.querySelector(".carousel-items").removeChild(itemToMove);
        el.querySelector(".carousel-items").insertAdjacentHTML(position, itemToMove.outerHTML);
    }

   
    function showDots() {
        var dotContainer = document.createElement("ul");
        dotContainer.classList.add('b-carousel__nav-dots');
        dotContainer.addEventListener("click", scrollToImage);

        for (var i = 0; i < count; i++) {
            var dotElement = document.createElement("li");
            dotElement.setAttribute('data-position', i);

            dotContainer.appendChild(dotElement);
        }

        el.appendChild(dotContainer);
        currentDot();
    }


    function currentDot() {
        [].forEach.call(el.querySelectorAll(".b-carousel__nav-dots li"), function(item) {
            item.classList.remove('active');
        });

        switch (current) {
            case -1:
                current = count - 1;
                break;
            case count:
                current = 0;
                break;
            default:
                current;
        }

        el.querySelectorAll(".b-carousel__nav-dots li")[current].classList.add("active");
    }

    function scrollToImage(e) {
        if (e.target.tagName !== "LI") return;
        initSlide(e.target.getAttribute('data-position'));
    }

    function showArrows() {
        var buttonPrev = document.createElement("button");
        buttonPrev.innerHTML = "&lsaquo;"
        buttonPrev.classList.add('b-carousel__nav-arrow_prev');

        var buttonNext = document.createElement("button");
        buttonNext.innerHTML = "&rsaquo;"
        buttonNext.classList.add('b-carousel__nav-arrow_next');

        buttonPrev.addEventListener('click', prev);
        buttonNext.addEventListener('click', next);

        el.appendChild(buttonPrev);
        el.appendChild(buttonNext);
    }

  
    function showButtons() {
        var buttonPlay = document.createElement("button");
        buttonPlay.innerHTML = "Play";
        buttonPlay.classList.add('b-carousel__button_play');
        buttonPlay.addEventListener("click", play);

        var buttonStop = document.createElement("button");
        buttonStop.innerHTML = "Stop";
        buttonStop.classList.add('b-carousel__button_stop');
        buttonStop.addEventListener("click", stop);

        el.appendChild(buttonPlay);
        el.appendChild(buttonStop);
    }

  
    function animatePrev(item, marginLeft) {
        if (marginLeft >= 0) {
            item.style.marginLeft = "";
            return;
        }

        item.style.marginLeft = marginLeft + "px";

        setTimeout(function() {
            animatePrev(item, marginLeft + 100);
        }, 20);
    }

  
    function animateNext(item, marginLeft) {
        if (marginLeft <= -el.offsetWidth) {
            item.style.marginLeft = -el.offsetWidth + "px";
            return;
        }

        item.style.marginLeft = marginLeft + "px";

        setTimeout(function() {
            animateNext(item, marginLeft - 100);
        }, 20);
    }

 
    function initSlide(slide) {
        var delta = current - slide;

        if (delta === 0) return;

        if (delta < 0) {
            for (var i = 0; i < -delta; i++) {
                next();
            }
        } else {
            for (var i = 0; i < delta; i++) {
                prev();
            }
        }
    }


    function prev() {
        animatePrev(el.querySelectorAll(".carousel-items li")[0], 0);
        moveItem(count - 1, -el.offsetWidth + 'px', 'afterBegin');
        current--;
        currentDot();
    }

  
    function next() {
        animateNext(el.querySelectorAll(".carousel-items li")[1], -el.offsetWidth);
        moveItem(0, '', 'beforeEnd');
        current++;
        currentDot();
    }

  
    function play() {
        if (cycle) return;
        cycle = setInterval(next, interval);
    }

   
    function stop() {
        clearInterval(cycle);
        cycle = null;
    }

    this.initSlide = initSlide;
    this.prev = prev;
    this.next = next;
    this.play = play;
    this.stop = stop;
}
