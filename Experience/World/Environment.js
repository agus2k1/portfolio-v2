import * as THREE from 'three';
import Experience from '../Experience';
import gsap from 'gsap';
import GUI from 'lil-gui';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    // this.gui = new GUI();
    // this.obj = {
    //   colorObj: { r: 0, g: 0, b: 0 },
    //   intensity: 3,
    // };

    // this.setGUI();
    this.setSunlight();
  }

  // setGUI() {
  //   this.gui.addColor(this.obj, 'colorObj').onChange(() => {
  //     this.sunLight.color.copy(this.obj.colorObj);
  //     this.ambientLight.color.copy(this.obj.colorObj);
  //     console.log(this.obj.colorObj);
  //   });
  //   this.gui.add(this.obj, 'intensity').onChange(() => {
  //     this.sunLight.intensity = this.obj.intensity;
  //     this.ambientLight.intensity = this.obj.intensity;
  //   });
  // }

  setSunlight() {
    // Sun Light
    this.sunLight = new THREE.DirectionalLight('#ffffff', 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(-2, 5, 3);
    this.scene.add(this.sunLight);

    // Ambient Light
    this.ambientLight = new THREE.AmbientLight('#ffffff', 2);
    this.scene.add(this.ambientLight);

    // Camera Helper
    // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
    // this.scene.add(helper);
  }

  switchTheme(theme) {
    if (theme === 'dark') {
      gsap.to(this.sunLight.color, {
        r: 0.050980392156862744,
        g: 0.054901960784313725,
        b: 0.16862745098039217,
      });
      gsap.to(this.ambientLight.color, {
        r: 0.050980392156862744,
        g: 0.054901960784313725,
        b: 0.16862745098039217,
      });
      gsap.to(this.sunLight, {
        intensity: 2,
      });
      gsap.to(this.ambientLight, {
        intensity: 2,
      });
    } else {
      gsap.to(this.sunLight.color, {
        r: 1,
        g: 1,
        b: 1,
      });
      gsap.to(this.ambientLight.color, {
        r: 1,
        g: 1,
        b: 1,
      });
      gsap.to(this.sunLight, {
        intensity: 3,
      });
      gsap.to(this.ambientLight, {
        intensity: 2,
      });
    }
  }

  resize() {}

  update() {}
}
