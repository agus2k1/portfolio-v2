import Experience from './Experience';
import EventEmitter from 'events';
import gsap from 'gsap';
import convert from './Utils/Spans';

export default class Preloader extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera;
    this.world = this.experience.world;
    this.device = this.sizes.device;

    this.sizes.on('switchdevice', (device) => {
      this.device = device;
    });

    this.world.on('worldready', () => {
      this.setAssets();
      this.playIntro();
    });
  }

  setAssets() {
    convert(document.querySelector('.intro-text'));
    convert(document.querySelector('.hero-main-title'));
    convert(document.querySelector('.hero-main-description'));
    this.room = this.experience.world.room.actualRoom;
    this.roomChildren = this.experience.world.room.roomChildren;
    // console.log(this.room);
  }

  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = new gsap.timeline();
      this.timeline.set('.animated', { y: 0, yPercent: 100 });
      this.timeline.to('.preloader', {
        opacity: 0,
        delay: 1,
        onComplete: () => {
          document.querySelector('.preloader').classList.add('hidden');
        },
      });

      if (this.device === 'desktop') {
        this.timeline
          .to(this.roomChildren.cube.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.5)',
            duration: 0.7,
          })
          .to(this.room.position, {
            x: -1.35,
            ease: 'power1.out',
            duration: 0.7,
          });
      } else {
        this.timeline
          .to(this.roomChildren.cube.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: 'back.out(2.5)',
            duration: 0.7,
          })
          .to(this.room.position, {
            z: -1.5,
            ease: 'power1.out',
            duration: 0.7,
          });
      }
      this.timeline
        .to('.intro-text .animated', {
          yPercent: 0,
          stagger: 0.05,
          ease: 'back.out(1.7)',
        })
        .to(
          '.arrow-wrapper',
          {
            opacity: 1,
          },
          'same'
        )
        .to(
          '.toggle-bar',
          {
            opacity: 1,
            onComplete: resolve,
          },
          'same'
        );
    });
  }

  secondIntro() {
    return new Promise((resolve) => {
      this.secondTimeline = new gsap.timeline();

      this.secondTimeline
        .to(
          '.intro-text .animated',
          {
            yPercent: 100,
            stagger: 0.05,
            ease: 'back.in(1.7)',
          },
          'fadeout'
        )
        .to(
          '.arrow-wrapper',
          {
            opacity: 0,
          },
          'fadeout'
        )
        .to(
          this.room.position,
          {
            x: 0,
            y: 0,
            z: 1.41,
            ease: 'power1.out',
          },
          'same'
        )
        .to(
          this.roomChildren.cube.rotation,
          {
            y: Math.PI * 2 + Math.PI / 4,
          },
          'same'
        )
        .to(
          this.roomChildren.cube.scale,
          {
            x: 5,
            y: 4.5,
            z: 5,
          },
          'same'
        )
        .to(
          this.roomChildren.cube.position,
          {
            x: -0.001192,
            y: 4.23591,
            z: -0.012203,
          },
          'same'
        )
        .set(this.roomChildren.body.scale, {
          x: 1,
          y: 1,
          z: 1,
        })
        .to(
          this.roomChildren.cube.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
          },
          'home-page'
        )
        .to(
          '.hero-main-title .animated',
          {
            yPercent: 0,
            stagger: 0.07,
            ease: 'back.out(1.7)',
          },
          'home-page'
        )
        .to(
          '.hero-main-description .animated',
          {
            yPercent: 0,
            stagger: 0.05,
            ease: 'back.out(1.7)',
          },
          'home-page'
        )
        .to(
          this.roomChildren.aquarium.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-1.0'
        )
        .to(
          this.roomChildren.clock.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-0.9'
        )
        .to(
          this.roomChildren.shelves.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-0.5'
        )
        .to(
          this.roomChildren.floor_things.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-0.7'
        )
        .to(
          this.roomChildren.desks.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-0.9'
        )
        .to(this.roomChildren.table_stuff.scale, {
          x: 1,
          y: 1,
          z: 1,
          ease: 'back.out(2.2)',
          duration: 0.5,
        })
        .to(
          this.roomChildren.computer.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          '>-0.8'
        )
        .to(
          this.roomChildren.chair.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'back.out(2.2)',
            duration: 0.5,
          },
          'chair'
        )
        .to(
          this.roomChildren.chair.rotation,
          {
            y: Math.PI * 4 - Math.PI / 3,
            ease: 'power2.out',
            duration: 1,
          },
          'chair'
        )
        .to(this.roomChildren.mini_floor.scale, {
          x: 1,
          y: 1,
          z: 1,
        })
        .to('.arrow-wrapper', {
          opacity: 1,
          onComplete: resolve,
        });
    });
  }

  // // on Desktop
  onScroll(e) {
    if (e.deltaY > 0) {
      this.removeEventListeners();
      this.playSecondIntro();
    }
  }

  // On Mobile
  onTouch(e) {
    this.initialY = e.touches[0].clientY;
  }

  onTouchMove(e) {
    let currentY = e.touches[0].clientY;
    let difference = this.initialY - currentY;
    if (difference > 0) {
      this.removeEventListeners();
      this.playSecondIntro();
    }
    this.initialY = null;
  }

  removeEventListeners() {
    window.removeEventListener('wheel', this.scrollOnceEvent);
    window.removeEventListener('touchstart', this.touchStart);
    window.removeEventListener('touchmove', this.touchMove);
  }

  async playIntro() {
    await this.firstIntro();
    this.moveFlag = true;
    this.scrollOnceEvent = this.onScroll.bind(this);
    this.touchStart = this.onTouch.bind(this);
    this.touchMove = this.onTouchMove.bind(this);
    window.addEventListener('wheel', this.scrollOnceEvent);
    window.addEventListener('touchstart', this.touchStart);
    window.addEventListener('touchmove', this.touchMove);
  }

  async playSecondIntro() {
    this.moveFlag = false;
    this.scaleFlag = true;
    await this.secondIntro();
    this.scaleFlag = false;
    this.emit('enablecontrols');
    this.roomChildren.rectLight.intensity = 4;
  }

  move() {
    if (this.device === 'desktop') {
      this.room.position.set(-1.35, 0, 0);
    } else {
      this.room.position.set(0, 0, -1.5);
    }
  }

  scale() {
    if (this.device === 'desktop') {
      this.room.scale.set(0.27, 0.27, 0.27);
    } else {
      this.room.scale.set(0.2, 0.2, 0.2);
    }
  }

  update() {
    if (this.moveFlag) {
      this.move();
    }
    if (this.scaleFlag) {
      this.scale();
    }
  }
}
