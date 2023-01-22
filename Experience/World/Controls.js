import * as THREE from 'three';
import Experience from '../Experience';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ASScroll from '@ashthornton/asscroll';

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    this.room.children.forEach((child) => {
      if (child.type === 'RectAreaLight') {
        this.fishtankLight = child;
      }
    });

    this.circleFirst = this.experience.world.floor.circleFirst;
    this.circleSecond = this.experience.world.floor.circleSecond;
    this.circleThird = this.experience.world.floor.circleThird;

    gsap.registerPlugin(ScrollTrigger);

    document.querySelector('.page').style.overflow = 'visible';

    // this.setSmoothScroll();
    this.setScrollTrigger();
  }

  // setupASScroll() {
  //   const asscroll = new ASScroll({
  //     ease: 0.3,
  //     disableRaf: true,
  //   });

  //   gsap.ticker.add(asscroll.update);

  //   ScrollTrigger.defaults({
  //     scroller: asscroll.containerElement,
  //   });

  //   ScrollTrigger.scrollerProxy(asscroll.containerElement, {
  //     scrollTop(value) {
  //       if (arguments.length) {
  //         asscroll.currentPos = value;
  //         return;
  //       }
  //       return asscroll.currentPos;
  //     },
  //     getBoundingClientRect() {
  //       return {
  //         top: 0,
  //         left: 0,
  //         width: window.innerWidth,
  //         height: window.innerHeight,
  //       };
  //     },
  //     fixedMarkers: true,
  //   });

  //   asscroll.on('update', ScrollTrigger.update);
  //   ScrollTrigger.addEventListener('refresh', asscroll.resize);

  //   requestAnimationFrame(() => {
  //     asscroll.enable({
  //       newScrollElements: document.querySelectorAll(
  //         '.gsap-marker-start, .gsap-marker-end, [asscroll]'
  //       ),
  //     });
  //   });
  //   return asscroll;
  // }

  // setSmoothScroll() {
  //   this.asscroll = this.setupASScroll();
  // }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      //Desktop
      '(min-width: 969px)': () => {
        // console.log("fired desktop");

        this.room.scale.set(0.27, 0.27, 0.27);
        this.room.position.set(0, 0, 0);
        this.fishtankLight.width = 0.8;
        this.fishtankLight.height = 0.5;
        this.camera.orthographicCamera.position.set(0, 6.7, 10);
        // First section -----------------------------------------
        this.firstMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        this.firstMoveTimeline.fromTo(
          this.room.position,
          { x: 0, y: 0, z: 0 },
          {
            x: () => {
              return this.sizes.width * 0.002;
            },
          }
        );

        // Second section -----------------------------------------
        this.secondMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: () => 1,

              y: () => 0.1,

              z: () => this.sizes.height * 0.0032,
            },
            'same'
          )
          .to(
            this.room.scale,
            {
              x: 0.92,
              y: 0.92,
              z: 0.92,
            },
            'same'
          )
          .to(
            this.fishtankLight,
            {
              width: 0.8 * 4,
              height: 0.5 * 4,
            },
            'same'
          );

        // Third section -----------------------------------------
        this.thirdMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          x: -4.1,
          y: 2,
        });
      },

      // Mobile
      '(max-width: 968px)': () => {
        // console.log("fired mobile");

        // Resets
        this.room.scale.set(0.2, 0.2, 0.2);
        this.room.position.set(0, 0, 0);
        this.fishtankLight.width = 0.3; // Change
        this.fishtankLight.height = 0.4; // Change
        this.camera.orthographicCamera.position.set(0, 6.5, 10);

        // First section -----------------------------------------
        this.firstMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            // invalidateOnRefresh: true,
          },
        }).to(this.room.scale, {
          x: 0.23,
          y: 0.23,
          z: 0.23,
        });

        // Second section -----------------------------------------
        this.secondMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.position,
            {
              x: 3,
              y: 0.2,
              z: () => this.sizes.height * 0.0032,
            },
            'same'
          )
          .to(
            this.room.scale,
            {
              x: 0.8,
              y: 0.8,
              z: 0.8,
            },
            'same'
          )
          .to(
            this.fishtankLight,
            {
              width: 0.8 * 3,
              height: 0.5 * 3,
            },
            'same'
          );

        // Third section -----------------------------------------
        this.thirdMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(this.camera.orthographicCamera.position, {
          x: 1.2,
          y: 2,
        });
      },

      // all
      all: () => {
        this.sections = document.querySelectorAll('.section');
        this.sections.forEach((section) => {
          if (section.classList.contains('right')) {
            gsap.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6,
              },
            });
            gsap.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          } else {
            gsap.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.6,
              },
            });
            gsap.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          }
        });

        // Circle animations
        // First section -----------------------------------------
        this.firstCircle = new gsap.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }).to(this.circleFirst.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Second section -----------------------------------------
        this.secondCircle = new gsap.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }).to(
          this.circleSecond.scale,
          {
            x: 3,
            y: 3,
            z: 3,
          },
          'same'
        );

        // Third section -----------------------------------------
        this.thirdCircle = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        }).to(this.circleThird.scale, {
          x: 3,
          y: 3,
          z: 3,
        });

        // Mini Platform Animations
        this.secondPartTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'center center',
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === 'Mini_floor') {
            this.first = gsap.to(child.position, {
              x: -2.82343,
              z: 5.75421,
              duration: 0.3,
            });
          }
          if (child.name === 'Mail_box') {
            this.second = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Lantern') {
            this.third = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Dirt') {
            this.fourth = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Flower1') {
            this.fifth = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Flower2') {
            this.sixth = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Floor1') {
            this.seventh = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Floor2') {
            this.eighth = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
          if (child.name === 'Floor3') {
            this.ninth = gsap.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
              ease: 'back.out(2)',
            });
          }
        });
        this.secondPartTimeline.add(this.first);
        this.secondPartTimeline.add(this.second);
        this.secondPartTimeline.add(this.third);
        this.secondPartTimeline.add(this.fourth, '-=0.2');
        this.secondPartTimeline.add(this.fifth, '-=0.2');
        this.secondPartTimeline.add(this.sixth, '-=0.2');
        this.secondPartTimeline.add(this.seventh, '-=0.2');
        this.secondPartTimeline.add(this.eighth);
        this.secondPartTimeline.add(this.ninth, '-=0.1');
      },
    });
  }
  resize() {}

  update() {}
}
