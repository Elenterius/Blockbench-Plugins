// GLTFExporter Plugin for Blockbench (using threejs r105)

import "./GLTFExporter"; //global injection for threejs

function init_GLTFExporterPlugin() {

    function buildAnimationClips() {

        const animationClips = [];
        Animator.animations.forEach(animation => {

            const keyframeTracks = [];
            for (const uuid in animation.animators) {

                const animator = animation.animators[uuid];
                if (!(animator instanceof EffectAnimator) && animator.keyframes.length && animator.group) {
                    const group = animator.group;
                    const bone = group.mesh;

                    const channels = { 'rotation': {}, 'position': {}, 'scale': {} };
                    animator.keyframes.forEach(keyframe => {
                        let timecode = Math.clamp(trimFloatNumber(Math.round(keyframe.time * 60) / 60), 0);
                        channels[keyframe.channel][timecode] = keyframe.getArray();
                    });

                    // channels/tracks
                    if (Object.keys(channels["position"]).length > 0) {
                        const times = [];
                        const data = [];
                        Object.keys(channels["position"]).sort().forEach(time => {
                            const virtualPos = new THREE.Vector3();
                            virtualPos.copy(bone.fix_position);
                            const offset = new THREE.Vector3().fromArray(channels["position"][time]);
                            offset.x *= -1;
                            virtualPos.add(offset);

                            times.push(time);
                            data.push(virtualPos.x, virtualPos.y, virtualPos.z);
                        });

                        if (data.length > 0) keyframeTracks.push(new THREE.VectorKeyframeTrack(group.name + ".position", times, data));
                    }

                    if (Object.keys(channels["rotation"]).length > 0) {
                        const times = [];
                        const data = [];
                        Object.keys(channels["rotation"]).sort().forEach(time => {
                            const virtualRot = new THREE.Vector3();
                            virtualRot.copy(bone.fix_rotation);

                            const values = channels["rotation"][time];
                            const q = new THREE.Quaternion();
                            if (values.length === 4) {
                                const added_rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().fromArray(values), 'ZYX')
                                virtualRot.x -= added_rotation.x
                                virtualRot.y -= added_rotation.y
                                virtualRot.z += added_rotation.z
                                q.setFromEuler(new THREE.Euler(virtualRot.x, virtualRot.y, virtualRot.z, 'ZYX'));
                            }
                            else {
                                q.setFromEuler(new THREE.Euler(THREE.Math.degToRad(-values[0]), THREE.Math.degToRad(-values[1]), THREE.Math.degToRad(values[2]))); // 'ZYX'
                            }
                            data.push(q.x, q.y, q.z, q.w);
                            times.push(time);
                        });

                        if (data.length > 0) keyframeTracks.push(new THREE.QuaternionKeyframeTrack(group.name + ".quaternion", times, data));
                    }

                    if (Object.keys(channels["scale"]).length > 0) {
                        const times = [];
                        const data = [];
                        Object.keys(channels["scale"]).sort().forEach(time => {
                            const virtualScale = new THREE.Vector3();
                            virtualScale.copy(bone.scale);

                            const values = channels["scale"][time];
                            virtualScale.x *= values[0] || 0.00001;
                            virtualScale.y *= values[1] || 0.00001;
                            virtualScale.z *= values[2] || 0.00001;

                            data.push(virtualScale.x, virtualScale.y, virtualScale.z);
                            times.push(time);
                        });
                    }
                }
            }

            if (keyframeTracks.length > 0) animationClips.push(new THREE.AnimationClip(animation.name, animation.length, keyframeTracks));
        });

        return animationClips;
    }

    const codec = new Codec('gltf', {
        name: 'GL Transmission Format',
        extension: 'gltf',
        compile(options) {
            return new Promise(resolveMain => {
                // const old_scene_position = new THREE.Vector3().copy(scene.position);
                // scene.position.set(0, 0, 0); // not needed when exporting the geometry seperately from the scene

                new Promise(resolve => {
                    const exporter = new THREE.GLTFExporter();

                    // ambient light (sun) is not supported; could export lights
                    const blacklist = ["vertex_handles", "outline_group", "grid_group", "side_grid_x", "side_grid_y", "sun", "lights"];

                    let exportgroup = new THREE.Group();
                    exportgroup.name = options.geometry_name;
                    exportgroup.rotation.y = THREE.Math.degToRad(180); // rotate to match standard forward vector of glTF (+Z)

                    scene.children.forEach(child => { // root level
                        if (!blacklist.includes(child.name) && !(child instanceof THREE.TransformControls)) {
                            exportgroup.add(child.clone(true));
                        }
                    });

                    const scale = new THREE.Vector3(1, 1, 1); //TODO: implement rescaling of model
                    const embedImages = true; // options.embedImages; TODO: fix NON-Relative URI path
                    const animationClips = options.animations ? buildAnimationClips() : [];

                    exporter.parse(elements, exportgroup, gltf => resolve(gltf), { binary: options.binary, embedImages: embedImages, animations: animationClips });
                }).then(gltf => {
                    // scene.position.copy(old_scene_position);
                    resolveMain(options.binary ? gltf : JSON.stringify(gltf));
                });
            });
        },
        export(options) {
            const scope = this;
            const extension = options.binary ? 'glb' : this.extension;
            if (isApp) {
                Blockbench.export({
                    type: this.name,
                    extensions: [extension],
                    name: this.fileName(),
                    startpath: this.startPath(),
                    custom_writer: (content, path) => {
                        scope.compile(options).then(gltf => {
                            if (!options.binary) {
                                Blockbench.writeFile(path, { content: gltf }, path => scope.afterSave(path));
                            }
                            else {
                                if (!path) return;

                                // write buffer to file
                                fs.writeFileSync(path, Buffer.from(gltf));
                                scope.afterSave(path);
                            }
                        });
                    },
                })
            }
            else {
                this.compile(options).then(gltf => {
                    if (!options.binary) {
                        Blockbench.export({
                            type: this.name,
                            extensions: [extension],
                            name: this.fileName(),
                            content: gltf,
                        }, path => scope.afterDownload(path));
                    }
                    else { //binary
                        var file_name = this.fileName() + '.' + extension;
                        var blob = new Blob([gltf], { type: "application/octet-stream" });
                        saveAs(blob, file_name);
                        scope.afterDownload(file_name);
                    }
                });
            }
        }
    });

    codec.export_action = new Action({
        id: 'export_gltf',
        name: "Export GLTF",
        icon: 'icon-objects',
        description: 'Export Model to GLTF',
        category: 'file',
        click: () => {
            const name = Project.geometry_name || "object";
            new Dialog({
                id: 'gltf_export_options',
                title: 'Export glTF',
                lines: [
                    `<style>
                        .dialog_bar {
                            display: grid;
                            grid-template-columns: 2fr 1fr;
                        }
                        .dialog_bar > :first-child:not(button) {
                            width: min-content !important;
                        }
                        .dialog_bar > :last-child:not(button) {
                            width: 100% !important;
                            display: block !important;
                        }
                        #gltf_export_options > div:nth-child(10) {
                            display: block;
                            margin-top: 1rem;
                        }
                        input:read-only {
                            cursor: not-allowed;
                        }
                    </style>`,
                    '<h1>Export Settings</h1>'
                ],
                form: {
                    geometry_name: { label: 'Geometry Name', type: 'input', value: name },
                    binary: { label: 'Format', type: 'select', options: { json: '.gltf (json)', binary: '.glb (binary)' }, default: 'json' },
                    // scaleX: { label: 'Scale X', type: 'number', value: 1.0, step: 0.0001, readonly: true },
                    // scaleY: { label: 'Scale Y', type: 'number', value: 1.0, step: 0.0001, readonly: true },
                    // scaleZ: { label: 'Scale Z', type: 'number', value: 1.0, step: 0.0001, readonly: true },
                    // embedImages: { label: 'Embed Images', type: 'checkbox', value: true },
                    animations: { label: 'Animations', type: 'checkbox', value: true }
                },
                onConfirm: function (formData) {
                    codec.export({
                        scale: new THREE.Vector3(formData.scaleX, formData.scaleY, formData.scaleZ),
                        binary: (formData.binary === "binary" ? true : false),
                        embedImages: formData.embedImages,
                        animations: formData.animations,
                        geometry_name: formData.geometry_name
                    });
                    this.hide()
                }
            }).show();
        }
    });

    const version = '1.0.0-alpha.5.1.0';
    Plugin.register('gltf_exporter', {
        title: 'glTF Exporter',
        author: 'Elenterius',
        icon: 'icon-objects',
        description: 'Export Model with Animations to GL Transmission Format (glTF) Version 2.0',
        about: 'You can use https://sandbox.babylonjs.com/ to view your exported file online (gracefully handles glTF file errors & includes glTF validation reports)',
        version: version,
        variant: 'both',
        onload() {
            MenuBar.addAction(codec.export_action, 'file.export');
            console.log(`glTF Exporter [${version}] loaded!`);

            setTimeout(() => {
                const li = document.querySelector('#plugin_list > li[plugin=gltf_exporter]');
                if (!li.querySelector('div.github')) {
                    const ahref = '<div class="github">view on <a href="https://github.com/Elenterius/Blockbench-Plugins">github</a></div>';
                    li.querySelector('div.description').insertAdjacentHTML('afterend', ahref);
                }
                const vdiv = li.querySelector('span.version') || document.createElement("span");
                vdiv.innerHTML = `&nbsp;&nbsp;${version}`;
                vdiv.setAttribute('class', 'version');
                vdiv.style.opacity = 0.6;
                vdiv.style.fontSize = '0.75em';
                li.querySelector('div.title').appendChild(vdiv);
            }, 300);
        },
        onunload() {
            codec.export_action.delete();
            delete THREE.GLTFExporter; // remove reference
        }
    });
}

init_GLTFExporterPlugin();