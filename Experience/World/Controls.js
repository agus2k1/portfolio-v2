import * as THREE from 'three';
import Experience from '../Experience';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ASScroll from '@ashthornton/asscroll';

export default class Controls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
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

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  setupASScroll() {
    const asscroll = new ASScroll({
      disableRaf: true,
      ease: 0.3,
    });

    gsap.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on('update', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          '.gsap-marker-start, .gsap-marker-end, [asscroll]'
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  setScrollTrigger() {
    let mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: `(min-width: 969px)`,
        isMobile: `(max-width: 968px)`,
      },
      (context) => {
        let { isDesktop, isMobile } = context.conditions;

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

        // Resets
        if (isDesktop) {
          this.room.scale.set(0.27, 0.27, 0.27);
          this.room.position.set(0, 0, 0);
          this.fishtankLight.width = 0.8;
          this.fishtankLight.height = 0.5;
        } else if (isMobile) {
          this.room.scale.set(0.2, 0.2, 0.2);
          this.room.position.set(0, 0, 0);
        }

        // First Move Modifiers
        let firstTargets = [
          isDesktop ? this.room.position : this.room.scale,
          this.circleFirst.scale,
        ];
        let firstChanges = [
          {
            x: isDesktop ? () => this.sizes.width * 0.002 : 0.23,
            y: isDesktop ? '' : 0.23,
            z: isDesktop ? '' : 0.23,
          },
          {
            x: 3,
            y: 3,
            z: 3,
          },
        ];

        // Second Move Modifiers
        let secondTargets = [
          this.room.position,
          this.room.scale,
          this.fishtankLight,
          this.circleSecond.scale,
        ];
        let secondChanges = [
          {
            x: () => (isDesktop ? 1 : 3),
            y: 0.2,
            z: () => this.sizes.height * 0.0032,
          },
          {
            x: () => (isDesktop ? 0.92 : 0.8),
            y: () => (isDesktop ? 0.92 : 0.8),
            z: () => (isDesktop ? 0.92 : 0.8),
          },
          {
            width: () => (isDesktop ? 0.8 * 4 : 0.8 * 3),
            height: () => (isDesktop ? 0.5 * 4 : 0.5 * 3),
          },
          {
            x: 3,
            y: 3,
            z: 3,
          },
        ];

        // Third Move Modifiers
        let thirdTargets = [
          this.camera.orthographicCamera.position,
          this.circleThird.scale,
        ];
        let thirdChanges = [
          {
            x: () => (isDesktop ? -4.1 : 1),
            y: () => (isDesktop ? -1 : -1),
          },
          {
            x: 3,
            y: 3,
            z: 3,
          },
        ];

        // First section
        this.firstMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(firstTargets[0], firstChanges[0], 'same')
          .to(firstTargets[1], firstChanges[1], 'same');

        // Second section
        this.secondMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(secondTargets[0], secondChanges[0], 'same')
          .to(secondTargets[1], secondChanges[1], 'same')
          .to(secondTargets[2], secondChanges[2], 'same')
          .to(secondTargets[3], secondChanges[3], 'same');

        // Third section
        this.secondPartTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
          .to(thirdTargets[0], thirdChanges[0], 'same')
          .to(thirdTargets[1], thirdChanges[1], 'same');

        // Blender Objects Animations
        console.log(this.room.children);

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
        this.secondPartTimeline.add(this.ninth, '-=0.2');
      }
    );
  }

  resize() {}

  update() {}
}
