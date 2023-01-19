import * as THREE from 'three';
import Experience from '../Experience';
import GSAP from 'gsap';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

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

      if (child.name === 'Aquarium') {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0;
        child.children[0].material.color.set(0x1f7dc4);
        child.children[0].material.ior = 3;
        child.children[0].material.transmission = 1;
        child.children[0].material.opacity = 1;
      }

      if (child.name === 'Computer') {
        child.children[1].material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
    });

    // Fishtank Light
    const width = 0.8;
    const height = 0.5;
    const intensity = 4;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );

    rectLight.position.set(4, 4.2, -1);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 4;
    this.actualRoom.add(rectLight);
    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);

    // Blender room
    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.27, 0.27, 0.27);
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    // Yellow Fish
    this.fishAnimation = this.mixer.clipAction(this.room.animations[6]);
    this.fishAnimation.play();
    // Black/White Fish
    this.fishAnimation2 = this.mixer.clipAction(this.room.animations[7]);
    this.fishAnimation2.play();

    console.log(this.room.animations);
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
