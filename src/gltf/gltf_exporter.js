// GLTFExporter Plugin for Blockbench (using threejs r105)

import "./GLTFExporter"; //global injection for threejs

function init_GLTFExporterPlugin() {

    const codec = new Codec('gltf', {
        name: 'GL Transmission Format (JSON)',
        extension: 'gltf',
        compile(options) {
            return new Promise(resolveMain => {
                const old_scene_position = new THREE.Vector3().copy(scene.position);
                scene.position.set(0, 0, 0);

                new Promise(resolve => {
                    const exporter = new THREE.GLTFExporter();

                    //TODO: flip frontview with backview
                    const blacklist = ["vertex_handles", "outline_group", "grid_group", "side_grid_x", "side_grid_y", "sun", "lights"]; // ambient light (sun) is not supported; could export lights
                    const exportlist = [];
                    scene.children.forEach(child => {
                        if (!blacklist.includes(child.name) && !(child instanceof THREE.TransformControls))
                        {
                            exportlist.push(child);
                        }
                    });

                    //TODO: handle elements with export false

                    // scene.traverse(child => {
                    //     if (child instanceof THREE.Mesh) {
                    //         const element = elements.findInArray('uuid', child.name)
                    //         if (!element) return;
                    //         if (element.export === false) return;
                    //         console.log(element.name);
                    //         export_mesh.push(child);
                    //     };
                    // });

                    exporter.parse(exportlist, gltf => resolve(gltf), { binary: false, embedImages: true }); // animations
                }).then(gltf => {
                    scene.position.copy(old_scene_position);
                    resolveMain(JSON.stringify(gltf));
                });
            });
        },
        export() {
            const scope = this;
            if (isApp) {
                Blockbench.export({
                    type: this.name,
                    extensions: [this.extension],
                    name: this.fileName(),
                    startpath: this.startPath(),
                    custom_writer: (content, path) => {
                        scope.compile().then(gltf => {
                            content = gltf;
                            Blockbench.writeFile(path, { content }, path => scope.afterSave(path));
                        });
                    },
                })
            }
            else {
                this.compile().then(content => {
                    Blockbench.export({
                        type: this.name,
                        extensions: [this.extension],
                        name: this.fileName(),
                        content: content,
                    }, path => scope.afterDownload(path));
                });
            }
        }
    });

    codec.export_action = new Action({
        id: 'export_gltf',
        name: "Export GLTF (.gltf)",
        icon: 'icon-objects',
        description: 'Export Model to GLTF',
        category: 'file',
        click: () => {
            codec.export();
        }
    });

    Plugin.register('gltf_exporter', {
        title: 'glTF Exporter',
        author: 'Elenterius',
        icon: 'icon-objects',
        description: 'Export Model to glTF Fileformat',
        version: '1.0.0-alpha.1',
        variant: 'both',
        onload() {
            MenuBar.addAction(codec.export_action, 'file.export');
            console.log("glTF Exporter Plugin loaded!");
        },
        onunload() {
            codec.export_action.delete();
            delete THREE.GLTFExporter; // remove reference
        }
    });
}

init_GLTFExporterPlugin();