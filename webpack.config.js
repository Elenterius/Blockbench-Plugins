const path = require('path');

module.exports = {
  entry: {
    'plugins/gltf_exporter': ['./src/gltf/gltf_exporter'],
    'plugins/custom_modded_entity_mode': ['./src/misc/custom_modded_entity_mode']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
};