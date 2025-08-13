import * as THREE from 'three'



const material = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    transparent: true,
    opacity: 1,
    ior: 1.2,
    thickness: 1,
    roughness: 0,
    metalness: 0,
    specularIntensity: 0,
    envMapIntensity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

export default class RefractionSphere extends THREE.Mesh {
    constructor(scale, ior, opacity = 1.0) {
        super();
        this.geometry = new THREE.SphereGeometry(scale, 64, 32);
        this.material = new THREE.MeshPhysicalMaterial({
            transmission: 1,
            transparent: true,
            opacity: opacity,
            ior: ior,
            thickness: 1,
            roughness: 0,
            metalness: 0,
            specularIntensity: 0,
            envMapIntensity: 1,
            depthWrite: false,
            dithering: true,
          });
        this.renderOrder = 0;
    }
}
