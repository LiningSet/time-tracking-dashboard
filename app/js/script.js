const timeBtns = document.querySelectorAll(".time-btn");
const slots = document.querySelectorAll(".slot");

gsap.set(".slot-sticker", {
  top: "50%",
  right: "50%",
  x: "50%",
  y: "-50%",
  rotate: "-45deg",
});

fetch("/time-tracking-dashboard-main/app/js/data.json")
  .then((result) => result.json())
  .then((data) => {
    /*because of an animation lag that occured when there was default transform property 
    on slots, i basically cleared them right before proceeding with gsap
    - the default was needed in case gsap didn't respond for obvious reasons*/

    console.log(data);
    setInitialData();
    animation("ff", "reveal");

    /*everytime the slot sticker flips, on completion this function is called. it updates
     the visible data to either daily, weekly or monthly based on user preference*/
    function updateHours(btn) {
      data.forEach((object) => {
        let objectTitle = object.title.includes(" ")
          ? object.title.replace(" ", "-")
          : object.title;
        let associatedSlot = document.querySelector(
          `.${objectTitle.toLowerCase()}`
        );

        let timeframe;
        switch (btn.dataset.show) {
          case "daily":
            timeframe = {
              sub: object.timeframes.daily,
              addressAs: "Yesterday",
            };
            break;
          case "weekly":
            timeframe = {
              sub: object.timeframes.weekly,
              addressAs: "Last Week",
            };
            break;
          case "monthly":
            timeframe = {
              sub: object.timeframes.monthly,
              addressAs: "Last Month",
            };
            break;
        }
        associatedSlot.querySelector(".current").innerText =
          timeframe.sub.current === 1
            ? `${timeframe.sub.current}hr`
            : `${timeframe.sub.current}hrs`;

        associatedSlot.querySelector(".previous").innerText =
          timeframe.sub.previous === 1
            ? `${timeframe.addressAs} - ${timeframe.sub.previous}hr`
            : `${timeframe.addressAs} - ${timeframe.sub.previous}hrs`;
      });
    }

    function setInitialData() {
      data.forEach((object) => {
        let objectTitle = object.title.includes(" ")
          ? object.title.replace(" ", "-")
          : object.title;
        let associatedSlot = document.querySelector(
          `.${objectTitle.toLowerCase()}`
        );

        associatedSlot.querySelector(".current").innerText =
          object.timeframes.daily.current === 1
            ? `${object.timeframes.daily.current}hr`
            : `${object.timeframes.daily.current}hrs`;

        associatedSlot.querySelector(".previous").innerText =
          object.timeframes.daily.previous === 1
            ? `Yesterday - ${object.timeframes.daily.previous}hr`
            : `Yesterday - ${object.timeframes.daily.previous}hrs`;
      });
    }

    function animation(paramBtn, state) {
      let tlReveal = gsap.timeline({
        defaults: { duration: 0.5, ease: Power1.easeInOut, stagger: 0.125 },
        reversed: true,
      });
      tlReveal
        .to(".slot-sticker", {
          top: "-0.25rem",
          right: "0",
          x: "0",
          y: "0",
          rotate: "0",
        })
        .to(".slot-inner", { bottom: "-0.25rem" }, ">-1.5");

      let tlHide = gsap.timeline({
        defaults: { duration: 0.5, ease: Power1.easeInOut, stagger: 0.125 },
        reversed: true,
      });
      tlHide
        .to(".slot-sticker", {
          top: "50%",
          right: "50%",
          x: "50%",
          y: "-50%",
          rotate: "-45deg",
        })
        .to(
          ".slot-inner",
          {
            bottom: "-100%",
            onComplete: updateHours,
            onCompleteParams: [paramBtn],
          },
          ">-1.5"
        );

      if (state === "reveal") {
        tlReveal.play();
      } else {
        tlHide.play();
      }
    }

    timeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        animation(btn, "hide");
        setTimeout(() => {
          animation(btn, "reveal");
        }, 1000);

        timeBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
  });
