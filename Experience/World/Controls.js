import * as THREE from 'three';
import Experience from '../Experience';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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
    gsap.registerPlugin(ScrollTrigger);

    this.setScrollTrigger();
  }

  setScrollTrigger() {
    let mm = gsap.matchMedia();

    mm.add('(min-width: 969px)', () => {
      // Resets
      this.room.scale.set(0.27, 0.27, 0.27);
      this.fishtankLight.width = 0.8;
      this.fishtankLight.height = 0.5;

      // First section
      this.firstMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: '.first-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(this.room.position, {
        x: () => this.sizes.width * 0.002,
      });

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
        .to(
          this.room.position,
          {
            x: () => 1,
            z: () => this.sizes.height * 0.0032,
          },
          'same'
        )
        .to(
          this.room.scale,
          {
            x: () => 0.92,
            y: () => 0.92,
            z: () => 0.92,
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
    });

    // Third section
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
      y: -1,
    });

    mm.add('(max-width: 968px)', () => {
      // Resets
      this.room.scale.set(0.23, 0.23, 0.23);
      this.room.position.set(0, 0, 0);

      // First section
      this.firstMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: '.first-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(this.room.scale, {
        x: 0.3,
        y: 0.3,
        z: 0.3,
      });

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
        .to(
          this.room.scale,
          {
            x: 0.9,
            y: 0.9,
            z: 0.9,
          },
          'same'
        )
        .to(
          this.camera.orthographicCamera.position,
          {
            x: -3,
            y: 6.1,
          },
          'same'
        );

      // Third section
      this.thirdMoveTimeline = new gsap.timeline({
        scrollTrigger: {
          trigger: '.third-move',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }).to(
        this.camera.orthographicCamera.position,
        {
          x: -2.45,
          y: 0,
        },
        'same'
      );
    });
  }

  resize() {}

  update() {}
}
