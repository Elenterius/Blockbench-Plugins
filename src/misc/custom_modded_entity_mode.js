Plugin.register('custom_modded_entity_mode', {
    title: 'Custom Modded Entity Mode',
    author: 'Elenterius',
    icon: 'fa-cubes',
    description: 'Enables Multi-Textures and Animation Mode for Modded Entity ModelFormat',
    version: '1.0.0-alpha.1',
    variant: 'both',
    onload() {
        // Enable Multiple Textures for Java Entity Models
        Formats.modded_entity.single_texture = false;

        // Enable Animation Editor
        Formats.modded_entity.animation_mode = true;
    },
    onunload() {
        Formats.modded_entity.single_texture = true;
        Formats.modded_entity.animation_mode = false;
    }
});