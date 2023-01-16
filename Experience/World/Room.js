import * as THREE from 'three';
import Experience from '../Experience';
import GSAP from 'gsap';

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      if (child.name === 'Water') {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.roughness = 0;
        child.material.color.set(0x1f7dc4);
        child.material.ior = 3;
        child.material.transmission = 1;
        child.material.opacity = 1;
      }

      if (child.name === 'Screen') {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
    });

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.3, 0.3, 0.3);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    // Yellow Fish
    this.fishAnimation = this.mixer.clipAction(this.room.animations[40]);
    this.fishAnimation.play();
    // Black/White Fish
    this.fishAnimation2 = this.mixer.clipAction(this.room.animations[41]);
    this.fishAnimation2.play();
  }

  onMouseMove() {
    window.addEventListener('mousemove', (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth; // From -1 to 1
      this.lerp.target = this.rotation * 0.1;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.001);
  }
}
