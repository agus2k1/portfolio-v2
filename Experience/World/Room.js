import * as THREE from 'three';
import Experience from '../Experience';

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;

    this.setModel();
    this.setAnimation();
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
  }

  setAnimation() {
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    // Yellow Fish
    this.fishAnimation = this.mixer.clipAction(this.room.animations[40]);
    this.fishAnimation.play();
    // Black/White Fish
    this.fishAnimation2 = this.mixer.clipAction(this.room.animations[41]);
    this.fishAnimation2.play();

    console.log(this.room);
  }

  resize() {}

  update() {
    this.mixer.update(this.time.delta * 0.001);
  }
}
