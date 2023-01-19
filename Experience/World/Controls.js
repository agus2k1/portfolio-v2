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

    mm.add(
      {
        isDesktop: `(min-width: 969px)`,
        isMobile: `(max-width: 968px)`,
      },
      (context) => {
        let { isDesktop, isMobile } = context.conditions;

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
        let firstTargets = isDesktop ? this.room.position : this.room.scale;
        let firstChanges = {
          x: isDesktop ? () => this.sizes.width * 0.002 : 0.23,
          y: isDesktop ? '' : 0.23,
          z: isDesktop ? '' : 0.23,
        };

        // Second Move Modifiers
        let secondTargets = [
          this.room.position,
          this.room.scale,
          this.fishtankLight,
        ];
        let secondChanges = [
          {
            x: () => (isDesktop ? 1 : 3),
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
        ];

        // Third Move Modifiers
        let thirdTargets = this.camera.orthographicCamera.position;
        let thirdChanges = {
          x: () => (isDesktop ? -4.1 : 1),
          y: () => (isDesktop ? -1 : -1),
        };

        // First section
        this.firstMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(firstTargets, firstChanges);

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
          .to(secondTargets[2], secondChanges[2], 'same');

        // Third section
        this.thirdMoveTimeline = new gsap.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }).to(thirdTargets, thirdChanges);
      }
    );
  }

  resize() {}

  update() {}
}
