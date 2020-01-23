// GLTFExporter Plugin for Blockbench (using threejs r105)

import "./GLTFExporter"; //global injection for threejs

function init_GLTFExporterPlugin() {

    function buildAnimationClip() {

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

        ///////////////////////////////////////////////////////////////////////////////////// OLD
        // const animationClips = [];
        // for (const [animName, anim] of Object.entries(Animator.buildFile().animations)) {

        //     if (anim.hasOwnProperty('bones')) {
        //         const keyframeTracks = [];
        //         for (const [boneName, bone] of Object.entries(anim.bones)) {
        //             for (const [trackName, track] of Object.entries(bone)) { //eg. position, rotation or scale

        //                 const times = [];
        //                 const data = [];
        //                 if (trackName === "rotation") {
        //                     for (const [time, values] of Object.entries(track)) {
        //                         times.push(parseFloat(time));
        //                         var q = new THREE.Quaternion();
        //                         q.setFromEuler(new THREE.Euler(THREE.Math.degToRad(-values[0]), THREE.Math.degToRad(-values[1]), THREE.Math.degToRad(values[2]))); // 'ZYX'
        //                         data.push(q.x, q.y, q.z, q.w);
        //                     }
        //                     if (data.length > 0) keyframeTracks.push(new THREE.QuaternionKeyframeTrack(boneName + ".quaternion", times, data)); // InterpolateLinear is default
        //                 }
        //                 else {
        //                     for (const [time, values] of Object.entries(track)) {
        //                         times.push(parseFloat(time));
        //                         data.push(values[0], values[1], values[2]);
        //                     }
        //                     if (data.length > 0) keyframeTracks.push(new THREE.VectorKeyframeTrack(boneName + "." + trackName, times, data)); // InterpolateLinear is default
        //                 }
        //             }
        //         }
        //         // const duration = anim.hasOwnProperty('animation_length') ? anim.animation_length : 0;
        //         animationClips.push(new THREE.AnimationClip(animName, anim.animation_length, keyframeTracks));
        //     }
        // }
        //////////////////////////////////////////////////////////

        return animationClips;
    }

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
                        if (!blacklist.includes(child.name) && !(child instanceof THREE.TransformControls)) {
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

                    const animationClips = buildAnimationClip();
                    // https://sandbox.babylonjs.com/

                    exporter.parse(exportlist, gltf => resolve(gltf), { binary: false, embedImages: true, animations: animationClips });
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
        version: '1.0.0-alpha.2',
        variant: 'both',
        onload() {
            MenuBar.addAction(codec.export_action, 'file.export');
            console.log("glTF Exporter [1.0.0-alpha.2] loaded!");
        },
        onunload() {
            codec.export_action.delete();
            delete THREE.GLTFExporter; // remove reference
        }
    });
}

init_GLTFExporterPlugin();