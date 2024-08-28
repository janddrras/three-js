import { TextureLoader, CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
  constructor(_sources) {
    super()

    this.sources = _sources

    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new TextureLoader()
    this.loaders.cubeTextureLoader = new CubeTextureLoader()
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'texture':
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file)
          })
          break
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) this.trigger('ready')
  }
}
